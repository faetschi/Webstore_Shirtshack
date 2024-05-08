<?php
session_start();

function isAdmin() {
    return isset($_SESSION["loggedIn"]) && $_SESSION["loggedIn"] === true && isset($_SESSION["isAdmin"]) && $_SESSION["isAdmin"] === true;
}

// Example usage:
if (isAdmin()) {
    // Allow access to admin-specific features
    echo "You have admin privileges.";
} else {
    // Deny access
    echo "You do not have permission to access this feature.";
}
?>