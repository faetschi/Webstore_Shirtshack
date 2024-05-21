<?php
include_once("getCustomer.php");

class login {
    public function handleRequest($param) {
        $username = isset($param["username"]) ? $param["username"] : null;
        $password = isset($param["password"]) ? $param["password"] : null;
        $remember = isset($param["remember"]) ? $param["remember"] : false;
    
        // get customer from db
        $getCustomer = new GetCustomer();
        $response = $getCustomer->handleRequest(array('username' => $username));
    
        // validate
        if ($response['status'] == 'success' && password_verify($password, $response['data']['password'])) {
            // !!The username and password are valid!!
    
            session_start();
            // check if user is admin
            $_SESSION["isAdmin"] = $response['data']['is_Admin']; // 1 = admin, 0 = user
    
            $_SESSION["loggedIn"] = true;
            $_SESSION["username"] = $username;
    
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