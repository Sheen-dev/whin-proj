<?php
date_default_timezone_set("Asia/Manila");

require_once __DIR__ . "/../admin/db.php";

try {
    $stmt = $pdo->prepare("
        SELECT room_id, start_time, end_time
        FROM bookings
        WHERE booking_date = ?
    ");
    $stmt->execute([date("Y-m-d")]);

    echo json_encode([
        "success" => true,
        "bookings" => $stmt->fetchAll()
    ]);

} catch (Throwable $error) {
    error_log("Load bookings error: " . $error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load bookings."
    ]);
}