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
                array_push($res, new Customer($row["id"], $row["salutations"], $row["firstname"], $row["lastname"], $row["username"], $row["password"], $row["email"], $row["street"], $row["city"], $row["zip"], $row["payment_option"]));
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

    public function queryCustomerByEmail($email) {
        foreach ($this->queryCustomers() as $val) {
            if ($val->email == $email) {
                return $val;
            }
        }
    
        return null;
    }

    public function queryCustomerByUsername($username) {
        $sql = "SELECT * FROM customers WHERE username = ?";
        $stmt = $this->conn->prepare($sql);
    
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $customer = $result->fetch_assoc();
    
        return $customer;
    }

    public function createCustomer($customer) {
        // check if a customer with the same username already exists
        if ($this->queryCustomerByUsername($customer->username) !== null) {
            return array("status" => "username_exists");
        }
        // check if a customer with the same email already exists
        if ($this->queryCustomerByEmail($customer->email) !== null) {
            return array("status" => "email_exists");
        }
        // hash the password
        $hashedPassword = password_hash($customer->password, PASSWORD_DEFAULT);
        // prep statements = SQL injection safe
        $sql = "INSERT INTO customers (salutations, firstname, lastname, username, password, email, street, city, zip, payment_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssssss", $customer->salutations, $customer->firstname, $customer->lastname, $customer->username, $hashedPassword, $customer->email, $customer->street, $customer->city, $customer->zip, $customer->payment_option);
        
        if ($stmt->execute()) {
            return array("status" => "success");
        } else {
            return array("status" => "error", "message" => $this->conn->error);
        }
    }
    
    public function updateCustomer($customer) {
        $sql = "UPDATE customers SET salutations = ?, firstname = ?, lastname = ?, username = ?, email = ?, street = ?, city = ?, zip = ?, payment_option = ? WHERE id = ?";
    
        if($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssssssssi", $customer->salutations, $customer->firstname, $customer->lastname, $customer->username, $customer->email, $customer->street, $customer->city, $customer->zip, $customer->payment_option, $customer->id);
    
            if($stmt->execute()) {
                return array("status" => "success", "message" => "Customer updated successfully.");
            } else{
                return array("status" => "error", "message" => "Something went wrong. Please try again later.");
            }
        }
    }
    
}