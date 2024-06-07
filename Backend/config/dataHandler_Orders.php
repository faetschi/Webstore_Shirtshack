<?php
include("dbaccess.php");  // Assumed to have database connection setup

class DataHandler_Orders {
    private $conn;

    public function __construct() {
        $this->conn = $GLOBALS['conn'];
    }

    public function createOrder($userId, $totalPrice, $paymentOption, $items) {
        // Begin transaction
        $this->conn->begin_transaction();

        try {
            // Insert order
            $stmt = $this->conn->prepare("INSERT INTO orders (user_id, total_price, payment_option) VALUES (?, ?, ?)");
            $stmt->bind_param("ids", $userId, $totalPrice, $paymentOption);
            $stmt->execute();
            $orderId = $this->conn->insert_id;

            // Insert each item
            $stmt = $this->conn->prepare("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
            foreach ($items as $item) {
                $stmt->bind_param("isid", $orderId, $item['name'], $item['quantity'], $item['price']);
                $stmt->execute();
            }

            // Commit transaction
            $this->conn->commit();
            return array("status" => "success", "message" => "Order placed successfully.");
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollback();
            return array("status" => "error", "message" => "Failed to place order: " . $e->getMessage());
        }
    }
    public function fetchUserOrders($userId) {
        $sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        return $orders;
    }

    public function fetchOrderItems($orderId) {
        $sql = "SELECT product_name, quantity, price FROM order_items WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        return $items;
    }

    public function fetchOrderDetails($orderId) {
        // Fetch order details
        $sql = "SELECT o.order_id, o.total_price, o.order_date, o.payment_option, u.firstname, u.lastname, u.street, u.city, u.zip 
                FROM orders o 
                JOIN customers u ON o.user_id = u.id 
                WHERE o.order_id = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error preparing statement: " . $this->conn->error);
        }
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();
        
        // Fetch order items
        $sql = "SELECT product_name, quantity, price FROM order_items WHERE order_id = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error preparing statement: " . $this->conn->error);
        }
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
        $order['items'] = $items;
        return $order;
    }
    
    
    
    
}
