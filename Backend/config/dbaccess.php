<?php
// MySQL database
$servername = "localhost";
$username = "root"; // default username: change in XAMPP if necessary
$password = ""; // default pw: change in XAMPP if necessary
$dbname = "ShirtShack";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>