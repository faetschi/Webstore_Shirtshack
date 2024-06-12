<?php
include_once("../config/dataHandler_Customer.php");

class CustomerManager {
    private $dh;

    public function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function enableCustomer($param) {
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

    public function disableCustomer($param) {
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

    public function updateCustomer($data) {
        // Fetch the customer using the username
        if (!isset($data['username'])) {
            return array("status" => "error", "message" => "Username not provided");
        }

        $customer = $this->dh->queryCustomerByUsername($data['username']);
        if ($customer === null) {
            return array("status" => "error", "message" => "User not found");
        }

        // Check the current password
        if (!password_verify($data['currentPassword'], $customer['password'])) {
            return array("status" => "error", "message" => "Please enter your current password to save changes");
        }

        // Update the password if a new one is provided and validated
        if (!empty($data['newPassword'])) {
            $newHashedPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);
            $updatePasswordResult = $this->dh->updateCustomerPassword($customer['id'], $newHashedPassword);
            if (!$updatePasswordResult) {
                return array("status" => "error", "message" => "Failed to update password");
            }
            $customer['password'] = $newHashedPassword; // Update the local variable for subsequent updates
        }

        // Check if the email is already in use by another user
        if ($this->dh->isEmailInUseByAnotherUser($data['email'], $customer['id'])) {
            return array("status" => "error", "message" => "Email already in use by another user.");
        }

        // Update other customer details
        $result = $this->dh->updateCustomer(new Customer(
            $customer['id'],
            $data['salutations'],
            $data['firstname'],
            $data['lastname'],
            $data['username'],
            $customer['password'], // Could be new or old password
            $data['email'],
            $data['street'],
            $data['city'],
            $data['zip'],
            $data['payment_option'],
            isset($data['active']) ? $data['active'] : 1 // Assume active if not specified
        ));

        if ($result['status'] === 'success') {
            return array("status" => "success", "message" => "User updated successfully");
        } else {
            return array("status" => "error", "message" => $result['message']);
        }
    }

    public function createCustomer($data) {
        $currentCustomer = new Customer(
            null, // db will auto-increment this value
            $data['salutations'],
            $data['firstname'],
            $data['lastname'],
            $data['username'],
            $data['password'],
            $data['email'],
            $data['street'],
            $data['city'],
            $data['zip'],
            $data['payment'],
            1 // set active to 1 by default
        );

        // try to insert the user data
        $result = $this->dh->createCustomer($currentCustomer);
        if ($result['status'] === 'success') {
            return array("status" => "success", "message" => "User registered successfully");
        } elseif ($result['status'] === 'email_exists') {
            return array("status" => "email_exists", "message" => "A customer with this email already exists.");
        } elseif ($result['status'] === 'username_exists') {
            return array("status" => "username_exists", "message" => "A customer with this username already exists.");
        } else {
            return array("status" => "error", "message" => $result['message']);
        }
    }

    public function getAllCustomers() {
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

    public function getCustomer($param) {
        $credentials = $param['credentials'];
        $result = $this->dh->queryCustomerByCredentials($credentials);
        
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

    public function getUsername() {
        session_start();

        if(isset($_SESSION['username'])) {
            return array('username' => $_SESSION['username']);
        } else {
            return array('error' => 'No user is currently logged in.');
        }
    }


}
?>