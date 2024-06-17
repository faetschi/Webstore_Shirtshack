<?php
include_once("../models/product.php");
include("dbaccess.php");

class DataHandler_Product {
    private $conn;

    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    public function getProducts() {
        $products = [];
        $sql = "SELECT * FROM products";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }

    public function getProductsWithCategory() {
        $products = [];
        $sql = "
            SELECT products.*, categories.name as category_name 
            FROM products 
            JOIN categories ON products.category_id = categories.id
        ";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }

    private function getCategoryID($category_name) {
        $sql = "SELECT id FROM categories WHERE name = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return false; // Prepare failed
        }
        $stmt->bind_param("s", $category_name);
        $stmt->execute();
        $stmt->bind_result($category_id);
        if ($stmt->fetch()) {
            return $category_id; // Return the category ID
        }
        return false; // No category found
    }

    public function updateProduct($id, $name, $description, $price, $category_name, $image) {
        $category_id = $this->getCategoryID($category_name);
        if (!$category_id) {
            return array("status" => "noExist", "message" => "Category name does not exist.");
        }

        $sql = "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return array("status" => "error", "message" => "Prepare failed: " . $this->conn->error);
        }
        $stmt->bind_param("ssdssi", $name, $description, $price, $category_id, $image, $id);

        if ($stmt->execute()) {
            $stmt->close();
            return array("status" => "success", "message" => "Product updated successfully.");
        } else {
            return array("status" => "error", "message" => "Failed to update product: " . $stmt->error);
        }
    }

    public function deleteProduct($id) {
        $stmt = $this->conn->prepare("DELETE FROM products WHERE id = ?");
        if ($stmt === false) {
            return ['status' => 'error', 'message' => 'Prepare failed: ' . $this->conn->error];
        }
    
        $stmt->bind_param("i", $id);
    
        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                return ['status' => 'error', 'message' => 'No product found with provided ID'];
            }
            $stmt->close();
            return ['status' => 'success', 'message' => 'Product deleted successfully'];
        } else {
            $stmt->close();
            return ['status' => 'error', 'message' => 'Execute failed: ' . $stmt->error];
        }
    }



    /*
    public function addProduct($name, $description, $price, $category_id, $imageFile) {
        $target_dir = "../media/";
        $image = basename($imageFile["name"]);
        $target_file = $target_dir . $image;

        if (!move_uploaded_file($imageFile["tmp_name"], $target_file)) {
            throw new Exception('File upload failed with error code: ' . $imageFile["error"]);
        }

        $query = "INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $this->conn->error);
        }
        $stmt->bind_param("ssdss", $name, $description, $price, $category_id, $image);

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        $stmt->close();
        return array("status" => "success", "message" => "Product added successfully");
    }*/

    /*public function addProduct($name, $description, $price, $category_id, $imageFile) {
        $imageBase64 = null;
        if (isset($imageFile) && $imageFile['tmp_name']) {
            $imageData = file_get_contents($imageFile['tmp_name']);
            $imageBase64 = base64_encode($imageData);
        }
    
        $query = "INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $this->conn->error);
        }
        $stmt->bind_param("ssdss", $name, $description, $price, $category_id, $imageBase64);
    
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
    
        $stmt->close();
        return array("status" => "success", "message" => "Product added successfully");
    }*/

    public function addProduct($name, $description, $price, $category_id, $imageBase64) {
        $query = "INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $this->conn->error);
        }
        $stmt->bind_param("ssdss", $name, $description, $price, $category_id, $imageBase64);
    
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
    
        $stmt->close();
        return array("status" => "success", "message" => "Product added successfully");
    }
    
    



    


    public function getCategories() {
        $sql = "SELECT id, name FROM categories";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
    
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    
        return $categories;
    }
    
    
    /*public function getImagePathByProductId($productId) {
        // Prepare the SQL query to select the image column
        $sql = "SELECT image FROM products WHERE id = ?";
        
        try {
            // Prepare the statement
            $stmt = $this->conn->prepare($sql); // Ensure you use the correct database connection property
            
            // Bind the product ID to the query
            $stmt->bind_param("i", $productId);
            
            // Execute the query
            $stmt->execute();
            
            // Bind the result to a variable
            $stmt->bind_result($imagePath);
            
            // Fetch the result
            if ($stmt->fetch()) {
                return $imagePath; // Return the image path if found
            } else {
                return null; // Return null if no image path is found
            }
        } catch (Exception $e) {
            // Handle any exceptions, such as database connection errors
            error_log("An error occurred: " . $e->getMessage());
            return null;
        } finally {
            // Close the statement
            $stmt->close();
        }
    }*/
    public function getImagePathByProductId($productId) {
        $sql = "SELECT image FROM products WHERE id = ?";
        
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $productId);
            $stmt->execute();
            $stmt->bind_result($imagePath);
            if ($stmt->fetch()) {
                return $imagePath;
            } else {
                return null;
            }
        } catch (Exception $e) {
            error_log("An error occurred: " . $e->getMessage());
            return null;
        } finally {
            $stmt->close();
        }
    }
    

}