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

// Three default schedules, all within 7 AM–8 PM.
$defaultSlots = [
    ["07:00:00", "10:00:00"],
    ["10:00:00", "13:00:00"],
    ["13:00:00", "16:00:00"]
];

$days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

try {
    $pdo->beginTransaction();

    // Find the selected building.
    $buildingQuery = $pdo->prepare(
        "SELECT id FROM buildings WHERE building_code = ? LIMIT 1"
    );
    $buildingQuery->execute([$buildingCode]);
    $building = $buildingQuery->fetch();

    if (!$building) {
        $pdo->rollBack();
        respond(false, "The selected building was not found.", 404);
    }

    // Create the room.
    $roomQuery = $pdo->prepare(
        "INSERT INTO rooms (building_id, room_number)
         VALUES (?, ?)"
    );
    $roomQuery->execute([
        $building["id"],
        $roomNumber
    ]);

    $roomId = (int) $pdo->lastInsertId();

    // Prepare all 18 schedule records for one bulk insert.
    $values = [];
    $parameters = [];

    foreach ($days as $day) {
        foreach ($defaultSlots as $index => $slot) {
            $values[] = "(?, ?, ?, ?, ?, ?)";

            $parameters[] = $roomId;
            $parameters[] = $day;
            $parameters[] = $index + 1;
            $parameters[] = $slot[0];
            $parameters[] = $slot[1];
            $parameters[] = "available";
        }
    }

    $scheduleSql = "
        INSERT INTO room_schedules
            (room_id, day_of_week, slot_number,
             start_time, end_time, status)
        VALUES " . implode(", ", $values);

    $scheduleQuery = $pdo->prepare($scheduleSql);
    $scheduleQuery->execute($parameters);

    $pdo->commit();

    respond(true, "Room added successfully.");

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("WHIM add room error: " . $e->getMessage());

    // MySQL error 1062 means a duplicate unique value.
    $mysqlError = $e->errorInfo[1] ?? null;

    if ((int) $mysqlError === 1062) {
        respond(
            false,
            "That room number already exists in this building.",
            409
        );
    }

    respond(
        false,
        "Unable to add the room. Please try again.",
        500
    );

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("WHIM add room error: " . $e->getMessage());

    respond(false, "An unexpected error occurred.", 500);
}