<?php
require "db.php";

try {
    $sql = "
        SELECT
            rooms.id,
            rooms.room_number,
            buildings.building_code,
            buildings.building_name
        FROM rooms
        INNER JOIN buildings
            ON rooms.building_id = buildings.id
        ORDER BY buildings.building_code, rooms.room_number
    ";

    $stmt = $pdo->query($sql);

    echo json_encode([
        "success" => true,
        "rooms" => $stmt->fetchAll()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load rooms."
    ]);
}