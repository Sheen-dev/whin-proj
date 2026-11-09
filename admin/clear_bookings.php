<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

function respond($success, $message, $statusCode = 200, $extra = []) {
    http_response_code($statusCode);

    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(false, "Invalid request method.", 405);
}

$confirmation = trim($_POST["confirmation"] ?? "");

if ($confirmation !== "CLEAR") {
    respond(false, "Confirmation is required.", 400);
}

try {
    $pdo->beginTransaction();

    // Delete booking history ONLY.
    // Do not modify room_schedules.
    $deleteBookings = $pdo->prepare("DELETE FROM bookings");
    $deleteBookings->execute();

    $deletedCount = $deleteBookings->rowCount();

    $pdo->commit();

    respond(
        true,
        "Booking history cleared successfully. Room schedules and user accounts were not changed.",
        200,
        [
            "deleted_count" => $deletedCount
        ]
    );

} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Clear booking history error: " . $error->getMessage());

    respond(
        false,
        "Unable to clear booking history. No changes were committed.",
        500
    );
}