<?php
// TODO: In allen includes() einbinden, checkt ob remember me gesetzt ist, dann loggt er user ein
 
// Include your database connection file here
include("../config/dbaccess.php");

// Check if the remember cookie exists
if(isset($_COOKIE["remember"])) {
    $token = $_COOKIE["remember"];

    // Query the database to find the user with this token

    if($user) {
        // User found, start session and log in the user
        session_start();
        $_SESSION["loggedIn"] = true;
        $_SESSION["username"] = $user["username"];
        // You may set isAdmin here based on your logic
        
        // Redirect to the home page or any other page
        header("Location: ../sites/home.html");
        exit();
    }
}

// If no user is found or no remember token is present, redirect to login page
header("Location: ../sites/login.html");
exit();
?>
