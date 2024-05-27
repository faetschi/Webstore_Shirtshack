<?php
include_once("../config/dataHandler_Customer.php");
class EnableCustomer {
    private $dh;

    public function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($param) {
        $customerId = $param['id'];
        $result = $this->dh->enableCustomer($customerId);
        
        if ($result) {
            return array(
                'status' => 'success',
                'message' => 'Customer enabled successfully'
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Error enabling customer'
            );
        }
    }
}
?>