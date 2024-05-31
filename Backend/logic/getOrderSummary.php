<?php
include('../config/dbaccess.php');
include('../config/dataHandler_Order.php');

$orderHandler = new DataHandler_Order($conn);

$orderId = $_GET['order_id'] ?? null;

if (!$orderId) {
    echo json_encode(['status' => 'error', 'message' => 'Order ID missing.']);
    exit();
}

$orderSummary = $orderHandler->getOrderSummary($orderId);

if ($orderSummary) {
    $totalPrice = array_reduce($orderSummary, function($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);

    echo json_encode(['status' => 'success', 'data' => ['items' => $orderSummary, 'totalPrice' => $totalPrice]]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch order summary.']);
}
?>
