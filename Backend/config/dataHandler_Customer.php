<?php
include_once("../models/customer.php");
include("dbaccess.php");

class DataHandler_Customer {
    private $conn;

    function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    public function queryCustomers() {
        $res = array();
        $sql = "SELECT * FROM customers";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                array_push($res, new Customer($row["id"], $row["username"], $row["password"], $row["email"], $row["street"], $row["city"], $row["zip"], $row["payment_option"]));
            }
        }

        return $res;
    }

    public function queryCustomerById($id) {
        foreach ($this->queryCustomers() as $val) {
            if ($val->id == $id) {
                return $val;
            }
        }

        return null;
    }

    public function queryCustomerByUsername($username) {
        foreach ($this->queryCustomers() as $val) {
            if ($val->username == $username) {
                return $val;
            }
        }

        return null;
    }

    public function queryCustomerByEmail($email) {
        foreach ($this->queryCustomers() as $val) {
            if ($val->email == $email) {
                return $val;
            }
        }
    
        return null;
    }

    public function createCustomer($customer) {
        // Check if a customer with the same email already exists
        if ($this->queryCustomerByEmail($customer->email) !== null) {
            return array("status" => "email_exists");
        }
        // prepared statements = SQL injection safe
        $sql = "INSERT INTO customers (username, password, email, street, city, zip, payment_option) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssss", $customer->username, $customer->password, $customer->email, $customer->street, $customer->city, $customer->zip, $customer->payment_option);
        
        if ($stmt->execute()) {
            return array("status" => "success");
        } else {
            return array("status" => "error");
        }
    }
    
    public function updateCustomer($customer) {
        // prepared statements = SQL injection safe
        $sql = "UPDATE customers SET password = ?, email = ?, street = ?, city = ?, zip = ?, payment_option = ? WHERE username = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssss", $customer->password, $customer->email, $customer->street, $customer->city, $customer->zip, $customer->payment_option, $customer->username);
        
        if ($stmt->execute()) {
            return true;
        } else {
            echo "Error: " . $sql . "<br>" . $this->conn->error;
            return false;
        }
    }
}