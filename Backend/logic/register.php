<?php
include("updateUserData.php");
include_once("../config/dataHandler_Customer.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $salutations = isset($json_obj["salutations"]) ? $json_obj["salutations"] : null;
    $firstname = isset($json_obj["firstname"]) ? $json_obj["firstname"] : null;
    $lastname = isset($json_obj["lastname"]) ? $json_obj["lastname"] : null;
    $email = isset($json_obj["email"]) ? $json_obj["email"] : null;
    $password = isset($json_obj["password"]) ? $json_obj["password"] : null;
    $username = isset($json_obj["username"]) ? $json_obj["username"] : null;
    $street = isset($json_obj["street"]) ? $json_obj["street"] : null;
    $city = isset($json_obj["city"]) ? $json_obj["city"] : null;
    $zip = isset($json_obj["zip"]) ? $json_obj["zip"] : null;
    $payment = isset($json_obj["payment"]) ? $json_obj["payment"] : null;

    $updateUserData = new createCustomer();

    // Prepare the data
    $data = array(
        "salutations" => $salutations,
        "firstname" => $firstname,
        "lastname" => $lastname,
        "email" => $email,
        "username" => $username,
        "password" => $password,
        "street" => $street,
        "city" => $city,
        "zip" => $zip,
        "payment" => $payment
    );

    // Call the handleRequest method with the user data
    $result = $updateUserData->handleRequest($data);

    // Send back the result to controller.js
    header('Content-Type: application/json');
    echo json_encode($result);
}
?>