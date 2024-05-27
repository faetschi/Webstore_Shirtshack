<?php
include('../config/dbaccess.php');
include('../config/dataHandler_Cart.php');


session_start();

$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
$sessionId = session_id();

header('Content-Type: application/json');

$dataHandler = new DataHandler_Cart($conn);

try {
    $cartId = $dataHandler->getOrCreateCart($customerId, $sessionId);

    $cartItems = $dataHandler->getCartItems($cartId);

    echo json_encode([
        'status' => 'success',
        'data' => [
            'cartId' => $cartId,
            'items' => $cartItems
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
