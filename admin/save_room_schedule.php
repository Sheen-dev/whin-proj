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

// Only allow POST requests.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(false, "Invalid request method.", 405);
}

// Get submitted values.
$roomId = filter_input(INPUT_POST, "room_id", FILTER_VALIDATE_INT);
$day = trim($_POST["day"] ?? "");
$schedulesJson = $_POST["schedules"] ?? "";

// Allowed days.
$allowedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// Validate room ID.
if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room ID.", 400);
}

// Validate selected day.
if (!in_array($day, $allowedDays, true)) {
    respond(false, "Invalid day selected.", 400);
}

// Decode schedules JSON.
$schedules = json_decode($schedulesJson, true);

// Allow between 1 and 255 slots.
if (
    !is_array($schedules) ||
    count($schedules) < 1 ||
    count($schedules) > 255
) {
    respond(
        false,
        "You must have between 1 and 255 schedule slots.",
        400
    );
}

$cleanSchedules = [];

// Validate every submitted slot.
foreach ($schedules as $schedule) {

    if (!is_array($schedule)) {
        respond(false, "Invalid schedule data.", 400);
    }

    $start = $schedule["start_time"] ?? "";
    $end = $schedule["end_time"] ?? "";

    // Validate time format.
    if (
        !is_string($start) ||
        !is_string($end) ||
        !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $start) ||
        !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $end)
    ) {
        respond(
            false,
            "Please enter valid start and end times.",
            400
        );
    }

    // Only allow schedules between 7:00 AM and 8:00 PM.
    // Convert times into minutes for accurate validation.
[$startHour, $startMinute] = array_map('intval', explode(':', $start));
[$endHour, $endMinute] = array_map('intval', explode(':', $end));

$startMinutes = ($startHour * 60) + $startMinute;
$endMinutes = ($endHour * 60) + $endMinute;

// Reject empty default values.
if ($start === "00:00" && $end === "00:00") {
    respond(
        false,
        "Please set a valid start time and end time before saving.",
        400
    );
}

// Operating hours: 7:00 AM to 8:00 PM.
if (
    $startMinutes < 420 ||
    $endMinutes > 1200 ||
    $startMinutes >= $endMinutes
) {
    respond(
        false,
        "Schedules must be between 7:00 AM and 8:00 PM. The end time must be after the start time.",
        400
    );
}

    // Always force the status to available.
    $cleanSchedules[] = [
        "start_time" => $start . ":00",
        "end_time" => $end . ":00",
        "status" => "available"
    ];
}

// Sort schedules by starting time.
usort($cleanSchedules, function ($a, $b) {
    return strcmp($a["start_time"], $b["start_time"]);
});

// Check for overlapping schedules.
for ($i = 1; $i < count($cleanSchedules); $i++) {

    if (
        $cleanSchedules[$i]["start_time"] <
        $cleanSchedules[$i - 1]["end_time"]
    ) {
        respond(
            false,
            "Schedule slots must not overlap.",
            400
        );
    }
}

try {

    // Check whether the room exists.
    $checkRoom = $pdo->prepare(
        "SELECT id FROM rooms WHERE id = ?"
    );

    $checkRoom->execute([$roomId]);

    if (!$checkRoom->fetch()) {
        respond(false, "Room not found.", 404);
    }

    // Start database transaction.
    $pdo->beginTransaction();

    // Remove the old schedules for this room and day.
    $delete = $pdo->prepare("
        DELETE FROM room_schedules
        WHERE room_id = ?
        AND day_of_week = ?
    ");

    $delete->execute([
        $roomId,
        $day
    ]);

    // Prepare the new schedule insertion.
    $insert = $pdo->prepare("
        INSERT INTO room_schedules
            (
                room_id,
                day_of_week,
                slot_number,
                start_time,
                end_time,
                status
            )
        VALUES (?, ?, ?, ?, ?, 'available')
    ");

    // Insert all schedules with sequential slot numbers.
    foreach ($cleanSchedules as $index => $schedule) {

        $insert->execute([
            $roomId,
            $day,
            $index + 1,
            $schedule["start_time"],
            $schedule["end_time"]
        ]);
    }

    // Save database changes.
    $pdo->commit();

    respond(
        true,
        $day . "'s schedule was saved successfully."
    );

} catch (Throwable $e) {

    // Undo changes if something goes wrong.
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