<?php
$servername = "localhost";  // if you are using XAMPP or MAMPP, this should be localhost
$username = "root";         // change for your XAMPP/MAMPP configuration
$password = "";             // change for your XAMPP/MAMPP configuration
$dbname = "ShirtShack";     // change to your db name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
