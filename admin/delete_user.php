<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json; charset=UTF-8");

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

$role = strtoupper(trim($_POST["user_role"] ?? ""));
$userId = trim($_POST["user_id"] ?? "");

if (!in_array($role, ["STUDENT", "PROFESSOR"], true) || $userId === "") {
    respond(false, "Invalid user selected.", 400);
}

try {
    if ($role === "STUDENT") {
        $delete = $pdo->prepare("DELETE FROM students WHERE student_id = ? LIMIT 1");
    } else {
        $delete = $pdo->prepare("DELETE FROM professors WHERE professor_id = ? LIMIT 1");
    }

    $delete->execute([$userId]);

    if ($delete->rowCount() === 0) {
        respond(false, "The selected user was not found.", 404);
    }

    respond(true, "User account deleted successfully. Existing booking records are kept.");
} catch (Throwable $error) {
    error_log("Delete user error: " . $error->getMessage());
    respond(false, "Unable to delete this user. Check whether the account is linked to other records.", 500);
}
