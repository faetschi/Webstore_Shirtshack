<?php
include('../config/dataHandler_Cart.php');

session_start();
$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
$sessionId = session_id();

$dataHandler = new DataHandler_Cart($conn);

$productId = isset($_POST['productId']) ? intval($_POST['productId']) : null;
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : null;

header('Content-Type: application/json');

if ($productId === null || $quantity === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID or quantity']);
    exit;
}

$cartId = $dataHandler->getOrCreateCart($customerId, $sessionId);
$result = $dataHandler->updateItemQuantity($cartId, $productId, $quantity);

if ($result > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Quantity updated']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update quantity']);
}
