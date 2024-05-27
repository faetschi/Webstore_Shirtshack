<?php
include('../config/dbaccess.php');
include('../config/dataHandler_Cart.php');

session_start();
$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
$sessionId = session_id();

$dataHandler = new DataHandler_Cart($conn);

$productData = json_decode(file_get_contents("php://input"), true);

$cartId = $dataHandler->getOrCreateCart($customerId, $sessionId);
$productId = $productData['productId'];
$quantity = $productData['quantity'];
$price = $productData['price'];

$result = $dataHandler->addOrUpdateItem($cartId, $productId, $quantity, $price);

header('Content-Type: application/json');
if ($result) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Unable to update cart']);
}

