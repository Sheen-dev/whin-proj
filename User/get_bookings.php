<?php
date_default_timezone_set("Asia/Manila");

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

// db.php lives in the admin folder, not in the User folder.
require_once __DIR__ . "/../admin/db.php";

try {
    // Only TODAY's bookings are needed. The room cards subtract
    // these times from today's available schedule.
    $stmt = $pdo->prepare("
        SELECT
            room_id,
            start_time,
            end_time
        FROM bookings
        WHERE booking_date = ?
        ORDER BY room_id, start_time
    ");

    $stmt->execute([date("Y-m-d")]);

    echo json_encode([
        "success" => true,
        "bookings" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (Throwable $error) {
    error_log("Load today's bookings error: " . $error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load bookings."
    ]);
}