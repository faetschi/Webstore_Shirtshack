<?php
include_once("../config/dataHandler_Customer.php");

class GetPaymentOption {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($param) {
        if (isset($param['id'])) {
            $userId = $param['id'];
            $result = $this->dh->queryCustomerByspecificId($userId);

            if ($result) {
                return array(
                    'status' => 'success',
                    'message' => 'Payment option retrieved successfully',
                    'payment_option' => $result['payment_option']  // Assuming 'payment_option' is the column name in your database
                );
            } else {
                return array(
                    'status' => 'error',
                    'message' => 'Error retrieving payment option'
                );
            }
        } else {
            return array(
                'status' => 'error',
                'message' => 'User ID not provided'
            );
        }
    }
}
