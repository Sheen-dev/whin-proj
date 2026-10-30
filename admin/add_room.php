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

$roomNumber = trim($_POST["room_number"] ?? "");
$buildingCode = strtoupper(trim($_POST["building_code"] ?? ""));

if ($roomNumber === "" || strlen($roomNumber) > 20) {
    respond(false, "Please enter a valid room number.", 400);
}

if (!in_array($buildingCode, ["A", "B", "C"], true)) {
    respond(false, "Please select a valid building.", 400);
}

try {
    $buildingQuery = $pdo->prepare(
        "SELECT id FROM buildings WHERE building_code = ? LIMIT 1"
    );
    $buildingQuery->execute([$buildingCode]);

    $building = $buildingQuery->fetch();

    if (!$building) {
        respond(false, "The selected building was not found.", 404);
    }

    $roomQuery = $pdo->prepare(
        "INSERT INTO rooms (building_id, room_number)
         VALUES (?, ?)"
    );

    $roomQuery->execute([
        $building["id"],
        $roomNumber
    ]);

    respond(true, "Room added successfully.");

} catch (PDOException $e) {
    error_log("WHIM add room error: " . $e->getMessage());

    $mysqlError = $e->errorInfo[1] ?? null;

    if ((int) $mysqlError === 1062) {
        respond(
            false,
            "That room number already exists in this building.",
            409
        );
    }

    respond(false, "Unable to add the room. Please try again.", 500);

} catch (Throwable $e) {
    error_log("WHIM add room error: " . $e->getMessage());

    respond(false, "An unexpected error occurred.", 500);
}