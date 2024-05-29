<?php
include('../config/dbaccess.php'); // Ensure database access is set up

session_start();

// Check for required parameters
if (!isset($_POST['orderId']) || !isset($_POST['status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing order ID or status']);
    exit;
}

$orderId = intval($_POST['orderId']);
$status = $_POST['status'];

// Validate the status
$validStatuses = ['Pending', 'Completed', 'Cancelled'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid status provided']);
    exit;
}

// Update the order status in the database
$updateQuery = "UPDATE orders SET status = ? WHERE order_id = ?";
$stmt = $conn->prepare($updateQuery);
$stmt->bind_param("si", $status, $orderId);
$success = $stmt->execute();

if ($success) {
    echo json_encode(['status' => 'success', 'message' => 'Order status updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update order status']);
}
