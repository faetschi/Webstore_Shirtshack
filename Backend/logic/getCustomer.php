<?php
include_once("../config/dataHandler_Customer.php");

class GetCustomer {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($param) {
        $username = $param['username'];
        $result = $this->dh->queryCustomerByUsername($username);
        
        if ($result) {
            return array(
                'status' => 'success',
                'message' => 'Customer data retrieved successfully',
                'data' => $result
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Error retrieving customer data'
            );
        }
    }
}