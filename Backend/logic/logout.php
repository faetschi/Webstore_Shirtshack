<?php
class Logout {
    public function handleRequest() {
        session_start();
        session_destroy();
        session_unset();

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