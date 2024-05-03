<?php
session_start();

$username = $_SESSION["username"];
session_destroy();
setcookie("username", "", time() - 3600, "/"); // cookie to expire in the past

// data prep
$data = array(
    "status" => "LoggedOut",
);

$json_data = json_encode($data);

// send data to frontend
header('Content-Type: application/json');
echo $json_data;
?>