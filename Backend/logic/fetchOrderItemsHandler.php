<?php
include_once("dataHandler_Orders.php");

class FetchOrderItemsHandler {
    private $dh;

    public function __construct() {
        $this->dh = new DataHandler_Orders();
    }

    public function handleRequest($param) {
        if (!isset($param['orderId'])) {
            return json_encode(['status' => 'error', 'message' => 'Order ID is required']);
        }

        $orderId = $param['orderId'];
        $items = $this->dh->fetchOrderItems($orderId);
        if ($items) {
            return json_encode(['status' => 'success', 'items' => $items]);
        } else {
            return json_encode(['status' => 'error', 'message' => 'No items found for this order']);
        }
    }
}
?>