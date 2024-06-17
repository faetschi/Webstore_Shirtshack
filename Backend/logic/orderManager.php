<?php
include_once("../config/dataHandler_Orders.php");

class OrderManager {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Orders();
    }

    public function getOrderByCustomerId($param) {
        $customerId = $param['customerId'];

        $orderDetails = $this->dh->fetchUserOrders($customerId);
    
        // Check if fetchUserOrders returned an array and if it's empty
        if (is_array($orderDetails) && empty($orderDetails)) {
            return array(
                'status' => 'notfound',
                'message' => 'No orders found for this customer',
                'data' => []
            );
        } elseif ($orderDetails) {
            return array(
                'status' => 'success',
                'message' => 'Order data retrieved successfully',
                'data' => $orderDetails
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Error retrieving order data'
            );
        }
    }

    function deleteOrderById($param) {
        $orderId = $param['orderId'];
    
        $result = $this->dh->deleteOrder($orderId);
    
        if ($result) {
            return array(
                'status' => 'success',
                'message' => 'Order deleted successfully'
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Failed to delete order'
            );
        }
    }


}