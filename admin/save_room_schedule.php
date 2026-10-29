<?php
require "db.php";

header("Content-Type: application/json; charset=UTF-8");

function respond($success, $message, $statusCode = 200) {
    http_response_code($statusCode);

    echo json_encode([
        "success" => $success,
        "message" => $message
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(false, "Invalid request method.", 405);
}

$roomId = filter_input(INPUT_POST, "room_id", FILTER_VALIDATE_INT);
$day = $_POST["day"] ?? "";
$schedulesJson = $_POST["schedules"] ?? "";

$allowedDays = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room ID.", 400);
}

if (!in_array($day, $allowedDays, true)) {
    respond(false, "Invalid day selected.", 400);
}

$schedules = json_decode($schedulesJson, true);

if (!is_array($schedules) || count($schedules) !== 3) {
    respond(false, "Exactly three schedule sections are required.", 400);
}

$cleanSchedules = [];

foreach ($schedules as $schedule) {
    $start = $schedule["start_time"] ?? "";
    $end = $schedule["end_time"] ?? "";
    $status = $schedule["status"] ?? "";

    if (
        !is_string($start) ||
        !is_string($end) ||
        !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $start) ||
        !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $end)
    ) {
        respond(false, "Please enter valid start and end times.", 400);
    }

    if (!in_array($status, ["occupied", "available"], true)) {
        respond(false, "Invalid schedule status.", 400);
    }

    if (
        $start < "07:00" ||
        $end > "20:00" ||
        $start >= $end
    ) {
        respond(
            false,
            "Times must be between 7:00 AM and 8:00 PM, with the end after the start.",
            400
        );
    }

    $cleanSchedules[] = [
        "start_time" => $start . ":00",
        "end_time" => $end . ":00",
        "status" => $status
    ];
}

// Sort schedules by start time.
usort($cleanSchedules, function ($a, $b) {
    return strcmp($a["start_time"], $b["start_time"]);
});

// Check overlapping times.
for ($i = 1; $i < count($cleanSchedules); $i++) {
    if (
        $cleanSchedules[$i]["start_time"] <
        $cleanSchedules[$i - 1]["end_time"]
    ) {
        respond(false, "Schedule sections must not overlap.", 400);
    }
}

// Assign slot numbers after sorting.
foreach ($cleanSchedules as $index => &$schedule) {
    $schedule["slot_number"] = $index + 1;
}
unset($schedule);

try {
    $pdo->beginTransaction();

    // Make sure the room still exists.
    $checkRoom = $pdo->prepare(
        "SELECT id FROM rooms WHERE id = ?"
    );

    $checkRoom->execute([$roomId]);

    if (!$checkRoom->fetch()) {
        $pdo->rollBack();
        respond(false, "Room not found. Please refresh the room list.", 404);
    }

    // Replace this day's three schedule records.
    $delete = $pdo->prepare("
        DELETE FROM room_schedules
        WHERE room_id = ? AND day_of_week = ?
    ");

    $delete->execute([$roomId, $day]);

    $insert = $pdo->prepare("
        INSERT INTO room_schedules
            (room_id, day_of_week, slot_number,
             start_time, end_time, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($cleanSchedules as $schedule) {
        $insert->execute([
            $roomId,
            $day,
            $schedule["slot_number"],
            $schedule["start_time"],
            $schedule["end_time"],
            $schedule["status"]
        ]);
    }

    $pdo->commit();

    respond(true, $day . "'s schedule was saved successfully.");

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Schedule save error: " . $e->getMessage());

    respond(
        false,
        "Unable to save the schedule. Please try again.",
        500
    );
}