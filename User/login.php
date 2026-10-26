<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../admin/db.php";

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$userId = trim($data["user_id"] ?? "");
$password = $data["password"] ?? "";

if ($userId === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Please enter your ID and password."
    ]);
    exit;
}

try {
    // Look for a student first.
    $stmt = $pdo->prepare("
        SELECT
            student_id AS user_id,
            full_name,
            role,
            course,
            age,
            year_level,
            password
        FROM students
        WHERE student_id = ?
        LIMIT 1
    ");

    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // If no student is found, look for a professor.
    if (!$user) {
        $stmt = $pdo->prepare("
            SELECT
                professor_id AS user_id,
                full_name,
                role,
                department,
                age,
                designation,
                password
            FROM professors
            WHERE professor_id = ?
            LIMIT 1
        ");

        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$user || !password_verify($password, $user["password"])) {
        echo json_encode([
            "success" => false,
            "message" => "Wrong user ID or password."
        ]);
        exit;
    }

    unset($user["password"]);

    session_regenerate_id(true);
    $_SESSION["user"] = $user;

    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "user" => $user
    ]);

} catch (Throwable $error) {
    error_log($error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Something went wrong. Please try again."
    ]);
}