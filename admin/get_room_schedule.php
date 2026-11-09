<?php
require_once __DIR__ . "/db.php";

date_default_timezone_set("Asia/Manila");
header("Content-Type: application/json; charset=UTF-8");

function respond($success, $message, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $data));
    exit;
}

function scheduleTimeToMinutes($time) {
    $parts = explode(":", (string) $time);
    return ((int) ($parts[0] ?? 0) * 60) + (int) ($parts[1] ?? 0);
}

$roomId = filter_input(INPUT_GET, "room_id", FILTER_VALIDATE_INT);
$requestedDay = trim($_GET["day"] ?? "");
$allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room ID.", [], 400);
}

if ($requestedDay !== "" && !in_array($requestedDay, $allowedDays, true)) {
    respond(false, "Invalid day selected.", [], 400);
}

try {
    $stmt = $pdo->prepare("
        SELECT
            rooms.id,
            rooms.room_number,
            buildings.building_code,
            buildings.building_name
        FROM rooms
        JOIN buildings ON buildings.id = rooms.building_id
        WHERE rooms.id = ?
        LIMIT 1
    ");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch();

    if (!$room) {
        respond(false, "Room not found.", [], 404);
    }

    $today = date("Y-m-d");
    $todayDay = date("l");

    // Load current-day bookings once. They are used to recalculate the
    // saved room_schedules.status values for the requested room/day(s).
    $bookingStmt = $pdo->prepare("
        SELECT start_time, end_time
        FROM bookings
        WHERE room_id = ?
          AND booking_date = ?
        ORDER BY start_time ASC, end_time ASC
    ");
    $bookingStmt->execute([$roomId, $today]);
    $todayBookings = $bookingStmt->fetchAll();

    $scheduleSql = "
        SELECT id, day_of_week, slot_number, start_time, end_time, status
        FROM room_schedules
        WHERE room_id = ?
    ";
    $scheduleParams = [$roomId];

    if ($requestedDay !== "") {
        $scheduleSql .= " AND day_of_week = ?";
        $scheduleParams[] = $requestedDay;
    }

    $scheduleSql .= " ORDER BY FIELD(day_of_week,
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        start_time, slot_number";

    $stmt = $pdo->prepare($scheduleSql);
    $stmt->execute($scheduleParams);
    $schedules = $stmt->fetchAll();

    $updateStatus = $pdo->prepare("UPDATE room_schedules SET status = ? WHERE id = ?");

    foreach ($schedules as &$schedule) {
        $occupied = false;

        // The schedule is weekly, so only bookings dated TODAY affect
        // today's weekday. A past booking never blocks next week's slot.
        if ($schedule["day_of_week"] === $todayDay) {
            $slotStart = scheduleTimeToMinutes($schedule["start_time"]);
            $slotEnd = scheduleTimeToMinutes($schedule["end_time"]);

            // If ANY booking touches this time slot, the whole slot is occupied.
            foreach ($todayBookings as $booking) {
                $bookingStart = scheduleTimeToMinutes($booking["start_time"]);
                $bookingEnd = scheduleTimeToMinutes($booking["end_time"]);

                if ($bookingStart < $slotEnd && $bookingEnd > $slotStart) {
                    $occupied = true;
                    break;
                }
            }
        }

        $schedule["status"] = $occupied ? "occupied" : "available";
        $updateStatus->execute([$schedule["status"], $schedule["id"]]);
    }
    unset($schedule);

    respond(true, "Schedule loaded.", [
        "room" => $room,
        "schedules" => $schedules
    ]);

} catch (Throwable $error) {
    error_log("Schedule loading error: " . $error->getMessage());
    respond(false, "Unable to load this room's schedule.", [], 500);
}