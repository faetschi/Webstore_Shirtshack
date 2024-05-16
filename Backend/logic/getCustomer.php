<?php
include_once("../config/dataHandler_Customer.php");

class GetCustomer {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($username) {
        return $this->dh->queryCustomerByUsername($username);
    }
}