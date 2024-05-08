<?php
// Start the session
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Check if the remember cookie exists and if so, delete it
if (isset($_COOKIE["remember"])) {
    // Expire the cookie by setting its expiration time to a past value
    setcookie("remember", "", time() - 3600, "/");
}

// Prepare the response data
$data = array(
    "status" => "LoggedOut"
);

// Send the response data to the frontend
header('Content-Type: application/json');
echo json_encode($data);
?>