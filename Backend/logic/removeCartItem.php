<?php
include('../config/dataHandler_Cart.php');

session_start();
$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
$sessionId = session_id();

$dataHandler = new DataHandler_Cart($conn);

$productId = isset($_POST['productId']) ? intval($_POST['productId']) : null;

header('Content-Type: application/json');

error_log("Product ID received: " . var_export($productId, true));
if ($productId === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID server']);
    exit;
}

if ($productId === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID server']);
    exit;
}

$cartId = $dataHandler->getOrCreateCart($customerId, $sessionId);
$result = $dataHandler->removeItem($cartId, $productId);

if ($result > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Item removed']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to remove item']);
}
