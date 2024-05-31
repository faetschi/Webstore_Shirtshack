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
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO customers 
(salutations, firstname, lastname, username, password, email, street, city, zip, payment_option, is_Admin, active) 
VALUES
('Mr.', 'John', 'Doe', 'admin', 'admin', 'admin@admin.com', '123 Admin St', 'Admin City', '12345', 'Credit', 1, 1);


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

-- Create a cart table
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL, -- Nullable if you want to support non-logged in users
    session_id VARCHAR(255) NULL, -- For tracking carts of non-logged users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create a cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2), -- Stores the price at the time of addition to cart
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexes to improve performance on frequently accessed columns
CREATE INDEX idx_cart on cart_items(cart_id);
CREATE INDEX idx_product on cart_items(product_id);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_option ENUM('Credit', 'Monthly') NOT NULL DEFAULT 'Credit',
    status ENUM('Pending', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_order ON order_items(order_id);
CREATE INDEX idx_product_order ON order_items(product_id);