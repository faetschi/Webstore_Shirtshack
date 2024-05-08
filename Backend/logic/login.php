<?php
// Include your database connection file here
include("dbaccess.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username = isset($json_obj["username"]) ? $json_obj["username"] : null;
    $password = isset($json_obj["password"]) ? $json_obj["password"] : null;
    $remember = isset($json_obj["remember"]) ? $json_obj["remember"] : false;

// TODO DATABASE VALIDATION
    // validate user credential w db here (when login valid, do the rest)

    // login valid? start a session
    session_start();
    // check if user is admin
    if ($username == "admin" && $password == "admin") {
        $_SESSION["isAdmin"] = true;
    } else {
        $_SESSION["isAdmin"] = false;
    }
    $_SESSION["loggedIn"] = true;
    $_SESSION["username"] = $username;
    

    // TODO: Store the token in your database, associated with the user
        // in combination with autoLogin for remember me button
    $token = bin2hex(random_bytes(24));

    // if checkbox is checked, set a cookie
    if ($remember) {
        setcookie("remember", $token, time() + (86400 * 30), "/"); // 86400 = 1 day
    }

    // data prep
    $data = array(
        "status" => "LoggedIn",
        "username" => $username,
        "remember" => $remember,
        "isAdmin" => $_SESSION["isAdmin"]
    );

    $json_data = json_encode($data);

    // send data to frontend
    header('Content-Type: application/json');
    echo $json_data;
}
?>