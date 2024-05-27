<?php
include('../config/dataHandler_Cart.php');

session_start();
$customerId = isset($_SESSION['customer_id']) ? $_SESSION['customer_id'] : null;
$sessionId = session_id();

$dataHandler = new DataHandler_Cart($conn);
$cartId = $dataHandler->getOrCreateCart($customerId, $sessionId);
$count = $dataHandler->getCartItemCount($cartId);

header('Content-Type: application/json');
echo json_encode(['count' => $count]);
