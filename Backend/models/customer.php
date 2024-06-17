<?php
class Customer {
    public $id;
    public $salutations;
    public $firstname;
    public $lastname;
    public $username;
    public $password;
    public $email;
    public $street;
    public $city;
    public $zip;
    public $payment_option;
    public $active;

    function __construct($id, $salutations, $firstname, $lastname, $username, $password, $email, $street, $city, $zip, $payment_option, $active) { 
        $this->id = $id;
        $this->salutations = $salutations;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->username = $username;
        $this->password = $password;
        $this->email = $email;
        $this->street = $street;
        $this->city = $city;
        $this->zip = $zip;
        $this->payment_option = $payment_option;
        $this->active = $active;
    }
}