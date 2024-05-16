<?php
include("../models/customer.php");
include_once("../config/dataHandler_Customer.php");

class createCustomer
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($data)
    {
        $currentCustomer = new Customer(
            null, // db will auto-increment this value
            $data['username'],
            $data['password'],
            $data['email'],
            $data['street'],
            $data['city'],
            $data['zip'],
            $data['payment']
        );

        // try to insert the user data
        $result = $this->dh->createCustomer($currentCustomer);
        if ($result['status'] === 'success') {
            return array("status" => "success", "message" => "User registered successfully");
        } elseif ($result['status'] === 'email_exists') {
            return array("status" => "email_exists", "message" => "A customer with this email already exists.");
        } else {
            return array("status" => "error", "message" => "Error registering user");
        }
    }
}