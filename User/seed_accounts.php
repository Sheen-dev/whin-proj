<?php
require_once __DIR__ . "/../admin/db.php";

header("Content-Type: text/plain; charset=UTF-8");

$password = password_hash("Plmun@123", PASSWORD_DEFAULT);

$students = [
    ["24175832", "Miguel Santos", "BSIT", 20, "3rd Year"],
    ["24179316", "Angela Mae Reyes", "BSCS", 19, "2nd Year"],
    ["24174609", "Joshua Daniel Cruz", "BSA", 18, "1st Year"],
    ["24178245", "Sofia Isabelle Garcia", "BSA", 22, "4th Year"]
];

$professors = [
    ["TCH-8821", "Roberto Miguel Dela Cruz", "Information Technology", 38, "Instructor"],
    ["TCH-7354", "Maria Cristina Mendoza", "Computer Science", 42, "Assistant Professor"],
    ["TCH-6193", "Daniel Patrick Ramos", "Accountancy", 35, "Instructor"],
    ["TCH-9042", "Elizabeth Anne Flores", "Business Administration", 45, "Associate Professor"]
];

try {
    $pdo->beginTransaction();

    $studentSQL = "
        INSERT IGNORE INTO students
        (student_id, full_name, course, age, year_level, role, password)
        VALUES (?, ?, ?, ?, ?, 'STUDENT', ?)
    ";

    $studentStmt = $pdo->prepare($studentSQL);

    foreach ($students as $student) {
        $studentStmt->execute([
            $student[0],
            $student[1],
            $student[2],
            $student[3],
            $student[4],
            $password
        ]);
    }

    $professorSQL = "
        INSERT IGNORE INTO professors
        (professor_id, full_name, department, age, designation, role, password)
        VALUES (?, ?, ?, ?, ?, 'PROFESSOR', ?)
    ";

    $professorStmt = $pdo->prepare($professorSQL);

    foreach ($professors as $professor) {
        $professorStmt->execute([
            $professor[0],
            $professor[1],
            $professor[2],
            $professor[3],
            $professor[4],
            $password
        ]);
    }

    $pdo->commit();

    echo "Sample accounts inserted successfully!";
    echo "\nPassword for all accounts: Plmun@123";

} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo "Error: " . $error->getMessage();
}