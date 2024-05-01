<?php
// Include your database connection file here
include("dbaccess.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $remember = isset($_POST["remember"]);

    // validate user credential w db here

    // login valid? start a session
    session_start();
    $_SESSION["username"] = $username;

    // if checkbox is checked, set a cookie
    if ($remember) {
        setcookie("username", $username, time() + (86400 * 30), "/"); // 86400 = 1 day
    }

    // data prep
    $data = array(
        "status" => "LoggedIn",
        "username" => $username,
        "remember" => $remember
    );

    $json_data = json_encode($data);

    // send data to frontend
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>