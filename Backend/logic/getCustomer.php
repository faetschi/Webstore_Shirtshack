<?php
include_once("../config/dataHandler_Customer.php");

class GetCustomer {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($param) {
        $credentials = $param['credentials'];  // Changed from 'login' to 'credentials'
        $result = $this->dh->queryCustomerByCredentials($credentials);  // Function name also changed to match the new parameter
        
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
?>
