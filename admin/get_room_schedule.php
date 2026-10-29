<?php
require "db.php";

function respond($success, $message, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $data));
    exit;
}

$roomId = filter_input(INPUT_GET, "room_id", FILTER_VALIDATE_INT);

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room ID.", [], 400);
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
    ");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch();

    if (!$room) {
        respond(false, "Room not found.", [], 404);
    }

    $stmt = $pdo->prepare("
        SELECT
            day_of_week,
            slot_number,
            start_time,
            end_time,
            status
        FROM room_schedules
        WHERE room_id = ?
        ORDER BY
            FIELD(
                day_of_week,
                'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday'
            ),
            start_time,
            slot_number
    ");
    $stmt->execute([$roomId]);

    respond(true, "Schedule loaded.", [
        "room" => $room,
        "schedules" => $stmt->fetchAll()
    ]);

} catch (PDOException $e) {
    error_log("Schedule loading error: " . $e->getMessage());
    respond(false, "Unable to load this room's schedule.", [], 500);
}