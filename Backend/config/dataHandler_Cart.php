<?php
include('dbaccess.php');

class DataHandler_Cart {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create or get cart ID
    public function getOrCreateCart($customerId, $sessionId) {
        // Check if cart exists
        $query = "SELECT id FROM carts WHERE customer_id = ? OR session_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $customerId, $sessionId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Return existing cart ID
            $row = $result->fetch_assoc();
            return $row['id'];
        } else {
            // Create a new cart
            $insert = "INSERT INTO carts (customer_id, session_id) VALUES (?, ?)";
            $stmt = $this->conn->prepare($insert);
            $stmt->bind_param("is", $customerId, $sessionId);
            $stmt->execute();
            return $stmt->insert_id; // Return new cart ID
        }
    }

    // Add item to cart
    public function addItem($cartId, $productId, $quantity, $price) {
        $insert = "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($insert);
        $stmt->bind_param("iiid", $cartId, $productId, $quantity, $price);
        $stmt->execute();
        return $stmt->affected_rows;
    }

    // Update item quantity in the cart
    public function updateItemQuantity($cartId, $productId, $quantity) {
        $update = "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
        $stmt = $this->conn->prepare($update);
        $stmt->bind_param("iii", $quantity, $cartId, $productId);
        $stmt->execute();
        return $stmt->affected_rows;
    }

    // Remove item from cart
    public function removeItem($cartId, $productId) {
        $delete = "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
        $stmt = $this->conn->prepare($delete);
        $stmt->bind_param("ii", $cartId, $productId);
        $stmt->execute();
        return $stmt->affected_rows;
    }

    // Retrieve all items in a cart
    public function getCartItems($cartId) {
        $query = "SELECT ci.product_id, p.name, ci.quantity, ci.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $cartId);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        return $items;
    }

    public function addOrUpdateItem($cartId, $productId, $quantity, $price) {
        // Check if the product already exists in the cart
        $check = "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?";
        $stmt = $this->conn->prepare($check);
        $stmt->bind_param("ii", $cartId, $productId);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($row = $result->fetch_assoc()) {
            // Product exists, update the quantity
            $newQuantity = $row['quantity'] + $quantity;
            $update = "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
            $updateStmt = $this->conn->prepare($update);
            $updateStmt->bind_param("iii", $newQuantity, $cartId, $productId);
            $updateStmt->execute();
            return $updateStmt->affected_rows;
        } else {
            // Product does not exist, add new entry
            $insert = "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
            $insertStmt = $this->conn->prepare($insert);
            $insertStmt->bind_param("iiid", $cartId, $productId, $quantity, $price);
            $insertStmt->execute();
            return $insertStmt->insert_id;
        }
    }

    public function getCartItemCount($cartId) {
        $query = "SELECT SUM(quantity) AS total_quantity FROM cart_items WHERE cart_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $cartId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            return $row['total_quantity'];
        }
        return 0;
    }
    
    
}
