CREATE DATABASE IF NOT EXISTS ShirtShack;

USE ShirtShack;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    payment_option ENUM('Credit', 'Monthly') NOT NULL,
    is_Admin BOOLEAN DEFAULT FALSE
);