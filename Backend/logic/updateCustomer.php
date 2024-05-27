<?php
include_once("../config/dataHandler_Customer.php");
class updateCustomer
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($data)
        {

            // If the id is not set in the data, get it using the username
            if (!isset($data['id'])) {
                if (!isset($data['username'])) {
                    return array("status" => "error", "message" => "Username not provided");
                }
                $customer = $this->dh->queryCustomerByUsername($data['username']);
                    if ($customer === null || !is_array($customer)) {
                        return array("status" => "error", "message" => "User not found");
                    }
                $data['id'] = $customer['id'];
            }

             // Get the old password from the database
            $oldCustomer = $this->dh->queryCustomerById($data['id']);
            if ($oldCustomer === null) {
                return array("status" => "error", "message" => "User not found");
            }
            $password = $oldCustomer->password;

            $currentCustomer = new Customer(
                $data['id'],
                $data['salutations'],
                $data['firstname'],
                $data['lastname'],
                $data['username'],
                $password,
                $data['email'],
                $data['street'],
                $data['city'],
                $data['zip'],
                $data['payment_option']
            );

            // try to update the user data
            $result = $this->dh->updateCustomer($currentCustomer);
            if ($result['status'] === 'success') {
                return array("status" => "success", "message" => "User updated successfully");
            } else {
                return array("status" => "error", "message" => $result['message']);
            }
        }
}