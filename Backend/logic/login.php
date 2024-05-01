<?php
// Include your database connection file here
include("dbaccess.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username = isset($json_obj["username"]) ? $json_obj["username"] : null;
    $password = isset($json_obj["password"]) ? $json_obj["password"] : null;
    $remember = isset($json_obj["remember"]) ? $json_obj["remember"] : false;

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