<?php
include('../config/dbaccess.php');
class DataHandler_Product {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getProducts() {
        $query = "SELECT * FROM products";
        $result = $this->conn->query($query);

        if ($result->num_rows > 0) {
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            return $products;
        } else {
            return [];
        }
    }

    public function getProductsWithCategory() {
        $query = "
            SELECT products.*, categories.name as category_name 
            FROM products 
            JOIN categories ON products.category_id = categories.id
        ";
        $result = $this->conn->query($query);

        if ($result->num_rows > 0) {
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            return $products;
        } else {
            return [];
        }
    }
}

