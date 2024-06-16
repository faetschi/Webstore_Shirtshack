CREATE DATABASE IF NOT EXISTS ShirtShack;
USE ShirtShack;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salutations VARCHAR(10) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    payment_option ENUM('Credit', 'Monthly') NOT NULL,
    is_Admin BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    image TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO customers 
(salutations, firstname, lastname, username, password, email, street, city, zip, payment_option, is_Admin, active) 
VALUES
('Mr.', 'John', 'Doe', 'admin', '$2y$10$o3ZMZMCN0N8JnxKgz.I6AuUahBOK7zLDVF3gK/UTt9jhf5wJkcvOu', 'admin@admin.com', '123 Admin St', 'Admin City', '12345', 'Credit', 1, 1);


INSERT INTO categories (name) VALUES
('Basic T-Shirts'),
('Graphic T-Shirts'),
('Long Sleeve Shirts'),
('Hoodies');

INSERT INTO products (name, description, price, category_id) VALUES
('Plain White T-Shirt', 'A plain white t-shirt available in multiple sizes.', 9.99, 1),
('Graphic Dragon T-Shirt', 'A t-shirt with a cool dragon graphic.', 14.99, 2),
('Long Sleeve Blue Shirt', 'A comfortable long sleeve shirt in blue.', 19.99, 3),
('Cozy Hoodie', 'A warm and cozy hoodie.', 29.99, 4);

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    discountAmount DECIMAL(10, 2) NOT NULL,
    discountType ENUM('Percentage', 'Fixed') NOT NULL,
    expirationDate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_option ENUM('credit_card', 'invoice') NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
