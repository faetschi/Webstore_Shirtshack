<?php
include("dbaccess.php");

// Annahme: $currentUsername enthält den Benutzernamen des eingeloggten Benutzers

// Verbindung zur Datenbank herstellen (Annahme: dbaccess.php ist vorhanden)
$conn = connectToDatabase();

// Benutzerdaten abrufen
$sql = "SELECT * FROM users WHERE username = '$currentUsername'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Benutzerdaten gefunden, diese anzeigen
    $row = $result->fetch_assoc();

    // Daten als JSON zurückgeben
    header('Content-Type: application/json');
    echo json_encode($row);
} else {
    // Benutzerdaten nicht gefunden
    $data = array(
        "status" => "error",
        "message" => "User data not found"
    );

    // Daten als JSON zurückgeben
    header('Content-Type: application/json');
    echo json_encode($data);
}

// Datenbankverbindung schließen
$conn->close();
?>
