<?php
include("../config/dbaccess.php");

$conn = connectToDatabase();

// usser data abrufen
$sql = "SELECT * FROM users WHERE username = '$currentUsername'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $row = $result->fetch_assoc();


    header('Content-Type: application/json');
    echo json_encode($row);
} else {

    $data = array(
        "status" => "error",
        "message" => "User data not found"
    );

    // user daten als json zurückgeben
    header('Content-Type: application/json');
    echo json_encode($data);
}


$conn->close();
?>
