<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json; charset=UTF-8");

try {
    $students = $pdo->query("
        SELECT
            student_id AS user_id,
            full_name,
            course,
            age,
            year_level,
            role
        FROM students
        ORDER BY full_name ASC
    ")->fetchAll(PDO::FETCH_ASSOC);

    $professors = $pdo->query("
        SELECT
            professor_id AS user_id,
            full_name,
            department,
            age,
            designation,
            role
        FROM professors
        ORDER BY full_name ASC
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "students" => $students,
        "professors" => $professors
    ]);
} catch (Throwable $error) {
    error_log("Load users error: " . $error->getMessage());
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load user accounts."
    ]);
}
