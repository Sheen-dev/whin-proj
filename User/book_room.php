<?php
session_start();

date_default_timezone_set("Asia/Manila");

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

require_once __DIR__ . "/../admin/db.php";

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

if (!isset($_SESSION["user"])) {
    respond(false, "Please log in first.", 401);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    respond(false, "Invalid booking data.", 400);
}

$roomId = filter_var($data["room_id"] ?? null, FILTER_VALIDATE_INT);
$start = $data["start_time"] ?? "";
$end = $data["end_time"] ?? "";

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room.", 400);
}

$timePattern = '/^(?:[01]\d|2[0-3]):[0-5]\d$/';

if (
    !is_string($start) ||
    !is_string($end) ||
    !preg_match($timePattern, $start) ||
    !preg_match($timePattern, $end)
) {
    respond(false, "Please enter a valid Time In and Time Out.", 400);
}

[$startHour, $startMinute] = array_map("intval", explode(":", $start));
[$endHour, $endMinute] = array_map("intval", explode(":", $end));

$startMinutes = ($startHour * 60) + $startMinute;
$endMinutes = ($endHour * 60) + $endMinute;

if ($endMinutes <= $startMinutes) {
    respond(false, "Time Out must be later than Time In.", 400);
}

$today = date("Y-m-d");
$dayName = date("l");
$nowMinutes = ((int) date("G") * 60) + (int) date("i");

if ($endMinutes <= $nowMinutes) {
    respond(false, "That time has already passed.", 400);
}

$startSql = $start . ":00";
$endSql = $end . ":00";

$userId = $_SESSION["user"]["user_id"] ?? null;
$userRole = $_SESSION["user"]["role"] ?? null;

if (!$userId || !$userRole) {
    respond(false, "Your login session is incomplete. Please log in again.", 401);
}

try {
    $pdo->beginTransaction();

    // Lock the room so two people cannot book at the same moment.
    $roomQuery = $pdo->prepare("SELECT id FROM rooms WHERE id = ? FOR UPDATE");
    $roomQuery->execute([$roomId]);

    if (!$roomQuery->fetch(PDO::FETCH_ASSOC)) {
        $pdo->rollBack();
        respond(false, "Room not found.", 404);
    }

    // The booking must be inside ONE available time set by the admin.
    // Any minute inside that time is allowed (for example 5:40 to 6:20).
    $slotQuery = $pdo->prepare("
        SELECT start_time, end_time
        FROM room_schedules
        WHERE room_id = ?
          AND day_of_week = ?
          AND status = 'available'
          AND start_time <= ?
          AND end_time >= ?
        ORDER BY start_time
        LIMIT 1
        FOR UPDATE
    ");
    $slotQuery->execute([$roomId, $dayName, $startSql, $endSql]);

    $slot = $slotQuery->fetch(PDO::FETCH_ASSOC);

    if (!$slot) {
        $pdo->rollBack();
        respond(false, "That time is not inside an available time of this room today.", 409);
    }

    // If anyone already booked ANY part of this available time,
    // the whole available time is taken.
    $takenQuery = $pdo->prepare("
        SELECT id
        FROM bookings
        WHERE room_id = ?
          AND booking_date = ?
          AND start_time < ?
          AND end_time > ?
        LIMIT 1
        FOR UPDATE
    ");
    $takenQuery->execute([
        $roomId,
        $today,
        $slot["end_time"],
        $slot["start_time"]
    ]);

    if ($takenQuery->fetch(PDO::FETCH_ASSOC)) {
        $pdo->rollBack();
        respond(false, "Sorry, that available time has already been booked.", 409);
    }

    $insert = $pdo->prepare("
        INSERT INTO bookings
            (room_id, user_id, user_role, booking_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $insert->execute([
        $roomId,
        $userId,
        $userRole,
        $today,
        $startSql,
        $endSql
    ]);

    $pdo->commit();

    respond(true, "Room booked successfully.");

} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Booking error: " . $error->getMessage());

    respond(false, "Unable to save the booking. Please try again.", 500);
}