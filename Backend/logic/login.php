<?php
include_once("customerManager.php");

class login {
    public function login($param) {
        $credentials = isset($param["credentials"]) ? $param["credentials"] : null;
        $password = isset($param["password"]) ? $param["password"] : null;
        $remember = isset($param["remember"]) ? $param["remember"] : false;

        // get customer from db by username or email
        $getCustomer = new CustomerManager();
        $response = $getCustomer->getCustomer(array('credentials' => $credentials));

        // validate
        if ($response['status'] == 'success' && password_verify($password, $response['data']['password'])) {
            if ($response['data']['active'] == 1) {
                session_start();
                $_SESSION["isAdmin"] = $response['data']['is_Admin'];
                $_SESSION["customer_id"] = $response['data']['id'];
                $_SESSION["loggedIn"] = true;
                $_SESSION["username"] = $response['data']['username']; // Ensure username is used in session

                return array(
                    "status" => "success",
                    "username" => $response['data']['username'],
                    "remember" => $remember,
                    "isAdmin" => $_SESSION["isAdmin"],
                    "customer_id" => $_SESSION["customer_id"]
                );
            } else {
                return array(
                    "status" => "disabled",
                    "message" => "Your account is disabled."
                );
            }
        } else {
            return array(
                "status" => "error",
                "message" => "Invalid login credentials"
            );
        }
    }

    public function isAdmin() {
        session_start();

        if (isset($_SESSION["isAdmin"]) && $_SESSION["isAdmin"] == 1) {
            return array(
                "status" => "success",
                "isAdmin" => true
            );
        } else {
            return array(
                "status" => "error",
                "isAdmin" => false
            );
        }
    }
}

?>