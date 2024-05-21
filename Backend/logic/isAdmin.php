<?php
class isAdmin {
    public function handleRequest() {
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