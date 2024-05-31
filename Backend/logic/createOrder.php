<?php
include('../config/dbaccess.php');
include('../config/dataHandler_Order.php');
include('../config/dataHandler_Cart.php');

session_start();
$customerId = $_SESSION['customer_id'] ?? null;
$cartId = $_SESSION['cart_id'] ?? null;

if (!$customerId || !$cartId) {
    echo json_encode(['status' => 'error', 'message' => 'Customer or Cart information missing.']);
    exit();
}

$orderHandler = new DataHandler_Order($conn);
$cartHandler = new DataHandler_Cart($conn);

$totalPrice = 0;
$cartItems = $cartHandler->getCartItems($cartId);
foreach ($cartItems as $item) {
    $totalPrice += $item['price'] * $item['quantity'];
}

$orderId = $orderHandler->createOrder($customerId, $totalPrice);
$orderHandler->transferCartItemsToOrder($cartId, $orderId);
$orderHandler->clearCart($cartId);

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'order_id' => $orderId]);
?>
