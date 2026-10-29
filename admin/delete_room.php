<?php
require_once __DIR__ . "/db.php";

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

$roomId = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);

if (!$roomId || $roomId < 1) {
    respond(false, "Invalid room ID.", 400);
}

try {
    $pdo->beginTransaction();

    // Confirm that the room exists.
    $checkRoom = $pdo->prepare(
        "SELECT id FROM rooms WHERE id = ? FOR UPDATE"
    );
    $checkRoom->execute([$roomId]);

    if (!$checkRoom->fetch()) {
        $pdo->rollBack();
        respond(false, "This room no longer exists.", 404);
    }

    // Delete all schedules belonging to this room.
    $deleteSchedules = $pdo->prepare(
        "DELETE FROM room_schedules WHERE room_id = ?"
    );
    $deleteSchedules->execute([$roomId]);

    // Delete the room.
    $deleteRoom = $pdo->prepare(
        "DELETE FROM rooms WHERE id = ?"
    );
    $deleteRoom->execute([$roomId]);

    $pdo->commit();

    respond(true, "Room and its schedules deleted successfully.");

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("WHIM delete room error: " . $e->getMessage());

    respond(
        false,
        "Unable to delete this room. Please try again.",
        500
    );
}