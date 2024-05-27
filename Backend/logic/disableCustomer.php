<?php
include_once("../config/dataHandler_Customer.php");

class DisableCustomer {
    private $dh;

    public function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($param) {
        $customerId = $param['id'];
        $result = $this->dh->disableCustomer($customerId);
        
        if ($result) {
            return array(
                'status' => 'success',
                'message' => 'Customer disabled successfully'
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Error disabling customer'
            );
        }
    }
}
?>