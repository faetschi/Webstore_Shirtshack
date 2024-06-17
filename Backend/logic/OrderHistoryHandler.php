<?php
include_once("dataHandler_Orders.php");

class OrderHistoryHandler {
    private $dh;

    public function __construct() {
        $this->dh = new DataHandler_Orders();
    }

    public function handleRequest($param) {
        if (!isset($param['userId'])) {
            return json_encode(['status' => 'error', 'message' => 'User ID is required']);
        }

        $userId = $param['userId'];
        $orders = $this->dh->fetchUserOrders($userId);
        if ($orders) {
            return json_encode(['status' => 'success', 'orders' => $orders]);
        } else {
            return json_encode(['status' => 'error', 'message' => 'No orders found']);
        }
    }
}
?>
