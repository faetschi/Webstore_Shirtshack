<?php
include_once("../config/dataHandler_Customer.php");

class GetAllCustomers {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest() {
        $result = $this->dh->queryCustomers();
        
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