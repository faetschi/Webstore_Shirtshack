<?php
class Customer {
    public $id;
    public $username;
    public $password;
    public $email;
    public $street;
    public $city;
    public $zip;
    public $payment_option;

    function __construct($id, $username, $password, $email, $street, $city, $zip, $payment_option) {
        $this->id = $id;
        $this->username = $username;
        $this->password = $password;
        $this->email = $email;
        $this->street = $street;
        $this->city = $city;
        $this->zip = $zip;
        $this->payment_option = $payment_option;
    }
}