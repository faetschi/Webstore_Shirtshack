<?php
include("dbaccess.php");


$conn = connectToDatabase();

$data = json_decode(file_get_contents("php://input"), true);

$sql = "UPDATE users SET 
        salutations = '{$data['salutations']}', 
        firstname = '{$data['firstname']}', 
        lastname = '{$data['lastname']}', 
        email = '{$data['email']}', 
        street = '{$data['street']}', 
        city = '{$data['city']}', 
        zip = '{$data['zip']}', 
        payment = '{$data['payment']}' 
        WHERE username = '$currentUsername'";

if ($conn->query($sql) === TRUE) {
    $response = array(
        "status" => "success"
    );
} else {
    $response = array(
        "status" => "error",
        "message" => "Error updating user data: " . $conn->error
    );
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
