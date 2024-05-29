<?php
include('../config/dbaccess.php'); // Database access

session_start();

// Validate input
$orderId = isset($_GET['orderId']) ? intval($_GET['orderId']) : null;
if (!$orderId) {
    echo json_encode(['status' => 'error', 'message' => 'No order ID provided']);
    exit;
}

// Fetch order items
$query = "SELECT oi.product_id, p.name, oi.quantity, oi.price
          FROM order_items oi
          JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $orderId);
$stmt->execute();
$result = $stmt->get_result();
$orderItems = [];
while ($row = $result->fetch_assoc()) {
    $orderItems[] = $row;
}

echo json_encode(['status' => 'success', 'orderItems' => $orderItems]);
