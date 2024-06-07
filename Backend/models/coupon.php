<?php

class Coupon {
    public $id;
    public $code;
    public $discountAmount;
    public $discountType;
    public $expirationDate;

    function __construct($id, $code, $discountAmount, $discountType, $expirationDate) {
        $this->id = $id;
        $this->code = $code;
        $this->discountAmount = $discountAmount;
        $this->discountType = $discountType;
        $this->expirationDate = $expirationDate;
    }
}