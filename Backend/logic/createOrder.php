<?php
include('../config/dbaccess.php'); // Ensuring the database access is included

session_start();

// Assuming customer_id is stored in session upon login
$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
if (!$customerId) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Fetch cart items for the user
include('../config/dataHandler_Cart.php');
$dataHandler = new DataHandler_Cart($conn);
$cartId = $dataHandler->getOrCreateCart($customerId, session_id());
$cartItems = $dataHandler->getCartItems($cartId);

if (count($cartItems) == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Cart is empty']);
    exit;
}

// Calculate total price
$total = 0;
foreach ($cartItems as $item) {
    $total += $item['price'] * $item['quantity'];
}

// Insert order into orders table
$insertOrder = $conn->prepare("INSERT INTO orders (customer_id, total) VALUES (?, ?)");
$insertOrder->bind_param("id", $customerId, $total);
$insertOrder->execute();
$orderId = $insertOrder->insert_id;

// Insert order items
foreach ($cartItems as $item) {
    $insertItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    $insertItem->bind_param("iiid", $orderId, $item['product_id'], $item['quantity'], $item['price']);
    $insertItem->execute();
}

// Clear the cart
foreach ($cartItems as $item) {
    $dataHandler->removeItem($cartId, $item['product_id']);
}

echo json_encode(['status' => 'success', 'orderId' => $orderId]);
