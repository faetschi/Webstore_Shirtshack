<?php
// server side check if user is admin
session_start();

header('Content-Type: application/json');

if (isset($_SESSION["isAdmin"]) && $_SESSION["isAdmin"]) {
    echo json_encode(['isAdmin' => true]);
} else {
    echo json_encode(['isAdmin' => false]);
}
?>