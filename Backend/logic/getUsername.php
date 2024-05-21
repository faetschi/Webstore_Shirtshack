<?php
class GetUsername {
    public function handleRequest() {
        session_start();

        if(isset($_SESSION['username'])) {
            return array('username' => $_SESSION['username']);
        } else {
            return array('error' => 'No user is currently logged in.');
        }
    }
}
?>