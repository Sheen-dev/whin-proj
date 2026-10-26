<?php
session_start();
date_default_timezone_set("Asia/Manila");

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

// The user must be logged in.
if (!isset($_SESSION["user"])) {
    respond(false, "Please log in first.", 401);
}

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$roomId = filter_var($data["room_id"] ?? null, FILTER_VALIDATE_INT);
$start = $data["start_time"] ?? "";
$end = $data["end_time"] ?? "";

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room.", 400);
}

$timePattern = '/^(?:[01]\d|2[0-3]):[0-5]\d$/';

if (
    !is_string($start) || !is_string($end) ||
    !preg_match($timePattern, $start) ||
    !preg_match($timePattern, $end)
) {
    respond(false, "Please enter a valid Time In and Time Out.", 400);
}

[$startHour, $startMinute] = array_map("intval", explode(":", $start));
[$endHour, $endMinute] = array_map("intval", explode(":", $end));

$startMinutes = $startHour * 60 + $startMinute;
$endMinutes = $endHour * 60 + $endMinute;

if ($endMinutes <= $startMinutes) {
    respond(false, "Time Out must be later than Time In.", 400);
}

$today = date("Y-m-d");
$dayName = date("l");
$nowMinutes = (int) date("G") * 60 + (int) date("i");

if ($endMinutes <= $nowMinutes) {
    respond(false, "That time has already passed.", 400);
}

$startSql = $start . ":00";
$endSql = $end . ":00";

$userId = $_SESSION["user"]["user_id"];
$userRole = $_SESSION["user"]["role"];

try {
    $pdo->beginTransaction();

    // Lock the room so two people cannot book at the same moment.
    $roomQuery = $pdo->prepare("SELECT id FROM rooms WHERE id = ? FOR UPDATE");
    $roomQuery->execute([$roomId]);

    if (!$roomQuery->fetch()) {
        $pdo->rollBack();
        respond(false, "Room not found.", 404);
    }

    // The booking must fit inside an available schedule slot today.
    $slotQuery = $pdo->prepare("
        SELECT id
        FROM room_schedules
        WHERE room_id = ?
          AND day_of_week = ?
          AND status = 'available'
          AND start_time <= ?
          AND end_time >= ?
        LIMIT 1
    ");
    $slotQuery->execute([$roomId, $dayName, $startSql, $endSql]);

    if (!$slotQuery->fetch()) {
        $pdo->rollBack();
        respond(false, "This room is not available at that time today.", 409);
    }

    // The booking must not overlap another booking.
    $overlapQuery = $pdo->prepare("
        SELECT id
        FROM bookings
        WHERE room_id = ?
          AND booking_date = ?
          AND start_time < ?
          AND end_time > ?
        LIMIT 1
    ");
    $overlapQuery->execute([$roomId, $today, $endSql, $startSql]);

    if ($overlapQuery->fetch()) {
        $pdo->rollBack();
        respond(false, "Sorry, that time is already booked.", 409);
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