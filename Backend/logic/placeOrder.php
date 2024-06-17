<?php
include_once("../config/DataHandler_Orders.php");

class PlaceOrder {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Orders();
    }

    public function handleRequest($param) {
        $userId = $param['userId'];
        $totalPrice = $param['total'];
        $paymentOption = $param['paymentMethod'];
        $items = $param['items'];

        return $this->dh->createOrder($userId, $totalPrice, $paymentOption, $items);
    }
}
