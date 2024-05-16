<?php
include_once("getCustomer.php");

class login {
    public function handleRequest($param) {
        $username = isset($param["username"]) ? $param["username"] : null;
        $password = isset($param["password"]) ? $param["password"] : null;
        $remember = isset($param["remember"]) ? $param["remember"] : false;

        // get customer from db
        $getCustomer = new GetCustomer();
        $customer = $getCustomer->handleRequest($username);

        // validate
        if ($customer && password_verify($password, $customer['password'])) {
            // !!The username and password are valid!!

            session_start();
            // check if user is admin
            $_SESSION["isAdmin"] = $customer['is_Admin']; // 1 = admin, 0 = user

            $_SESSION["loggedIn"] = true;
            $_SESSION["username"] = $username;

            // TODO: store the token in database, associated with the user
            // in combination with autoLogin for remember me button

            // TODO: remember button not working yet
            // if checkbox is checked, set a cookie
            if ($remember) {
                setcookie("remember", time() + (86400 * 30), "/"); // 86400 = 1 day
            }

            // data prep
            $data = array(
                "status" => "success",
                "username" => $username,
                "remember" => $remember,
                "isAdmin" => $_SESSION["isAdmin"]
            );

            return $data;
        } else {
            return array(
                "status" => "error",
                "message" => "Invalid username or password"
            );
        }
    }
}