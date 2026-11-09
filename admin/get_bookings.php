<?php
require_once __DIR__ . "/db.php";

header("Content-Type: application/json; charset=UTF-8");

try {
    // Load bookings with room and building information.
    // The weekday is included in the displayed booking date.
    $stmt = $pdo->query("
        SELECT
            b.room_id,
            b.user_id,
            b.user_role,
            DATE_FORMAT(b.booking_date, '%W, %M %e, %Y') AS booking_date,
            b.start_time,
            b.end_time,
            r.room_number,
            bu.building_code
        FROM bookings b
        LEFT JOIN rooms r ON r.id = b.room_id
        LEFT JOIN buildings bu ON bu.id = r.building_id
        ORDER BY b.booking_date DESC, b.start_time DESC, b.id DESC
    ");

    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $studentLookup = $pdo->prepare("
        SELECT
            full_name,
            course AS program,
            year_level AS level_or_designation
        FROM students
        WHERE student_id = ?
        LIMIT 1
    ");

    $professorLookup = $pdo->prepare("
        SELECT
            full_name,
            department AS program,
            designation AS level_or_designation
        FROM professors
        WHERE professor_id = ?
        LIMIT 1
    ");

    foreach ($bookings as &$booking) {
        $role = strtoupper(trim((string) $booking["user_role"]));

        $lookup = $role === "STUDENT"
            ? $studentLookup
            : ($role === "PROFESSOR" ? $professorLookup : null);

        $person = null;

        if ($lookup) {
            $lookup->execute([$booking["user_id"]]);
            $person = $lookup->fetch(PDO::FETCH_ASSOC);
        }

        $booking["full_name"] = $person["full_name"]
            ?? ("Deleted User (" . $booking["user_id"] . ")");

        $booking["program"] = $person["program"] ?? "—";

        $booking["level_or_designation"] =
            $person["level_or_designation"] ?? "—";
    }

    unset($booking);

    echo json_encode([
        "success" => true,
        "bookings" => $bookings
    ]);

} catch (Throwable $error) {
    error_log("Load admin bookings error: " . $error->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load booking history. Check the server error log for details."
    ]);
}