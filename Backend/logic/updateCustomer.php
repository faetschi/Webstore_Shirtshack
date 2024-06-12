<?php
include_once("../config/dataHandler_Customer.php");

class UpdateCustomer {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Customer();
    }

    public function handleRequest($data) {
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
}
?>
