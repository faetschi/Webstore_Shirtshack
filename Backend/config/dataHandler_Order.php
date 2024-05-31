<?php
include('dbaccess.php');

class DataHandler_Order {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new order
    public function createOrder($customerId, $totalPrice) {
        $query = "INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, 'Pending')";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("id", $customerId, $totalPrice);
        $stmt->execute();
        return $stmt->insert_id; // Return new order ID
    }

    // Transfer items from cart to order
    public function transferCartItemsToOrder($cartId, $orderId) {
        // Select items from cart
        $select = "SELECT product_id, quantity, price FROM cart_items WHERE cart_id = ?";
        $selectStmt = $this->conn->prepare($select);
        $selectStmt->bind_param("i", $cartId);
        $selectStmt->execute();
        $result = $selectStmt->get_result();

        // Insert items into order_items
        $insert = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $insertStmt = $this->conn->prepare($insert);

        while ($row = $result->fetch_assoc()) {
            $insertStmt->bind_param("iiid", $orderId, $row['product_id'], $row['quantity'], $row['price']);
            $insertStmt->execute();
        }
    }

    // Clear cart after transferring items to order
    public function clearCart($cartId) {
        $delete = "DELETE FROM cart_items WHERE cart_id = ?";
        $stmt = $this->conn->prepare($delete);
        $stmt->bind_param("i", $cartId);
        $stmt->execute();
        return $stmt->affected_rows;
    }

    // Get order summary for confirmation page
    public function getOrderSummary($orderId) {
        $query = "SELECT o.id, o.total_price, oi.product_id, p.name, oi.quantity, oi.price FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON p.id = oi.product_id WHERE o.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        return $items;
    }
}
