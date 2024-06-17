<?php
class Logout {
    public function handleRequest() {
        session_start();
        unset($_SESSION["isAdmin"]);
        unset($_SESSION["customer_id"]);
        unset($_SESSION["loggedIn"]);
        unset($_SESSION["username"]);

        if (isset($_COOKIE["remember"])) {
            setcookie("remember", "", time() - 3600, "/");
        }

        $data = array(
            "status" => "LoggedOut"
        );

        return $data;
    }
}
?>