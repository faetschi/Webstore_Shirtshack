<?php
include_once("../models/coupon.php");
include("dbaccess.php");

class DataHandler_Coupons {
    private $conn;

    function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    public function queryAllCoupons() {
        $res = array();
        $sql = "SELECT * FROM coupons";
        $result = $this->conn->query($sql);
    
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                array_push($res, new Coupon(
                    $row["id"],
                    $row["code"],
                    $row["discountAmount"],
                    $row["discountType"],
                    $row["expirationDate"]
                ));
            }
        }
    
        return $res;
    }

    public function queryCouponById($couponId) {
        $sql = "SELECT * FROM coupons WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $couponId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc(); 
        } else {
            return null;
        }
    }

    public function createCoupon($coupon) {
        // Check if a coupon with the same code already exists
        $sql = "SELECT * FROM coupons WHERE code = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return array("status" => "error", "message" => "Failed to prepare statement.");
        }
        $stmt->bind_param("s", $coupon->code);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return array("status" => "code_exists");
        }
    
        // Insert the new coupon
        $sql = "INSERT INTO coupons (code, discountAmount, discountType, expirationDate) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return array("status" => "error", "message" => "Failed to prepare statement.");
        }
    
        // Ensure the data types match your column definitions
        $stmt->bind_param("sdss", $coupon->code, $coupon->discountAmount, $coupon->discountType, $coupon->expirationDate);
    
        if ($stmt->execute()) {
            // If your DB connection is not in autocommit mode, commit the transaction
            // $this->conn->commit();
            return array("status" => "success");
        } else {
            return array("status" => "error", "message" => $this->conn->error);
        }
    }
    
    public function updateCoupon($coupon) {
        $sql = "UPDATE coupons SET code = ?, discount = ?, expiry_date = ?, active = ? WHERE id = ?";
    
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return array("status" => "error", "message" => "Failed to prepare statement.");
        }
        $stmt->bind_param("sdsii", $coupon->code, $coupon->discount, $coupon->expiry_date, $coupon->active, $coupon->id);
    
        if($stmt->execute()) {
            return array("status" => "success", "message" => "Coupon updated successfully.");
        } else {
            return array("status" => "error", "message" => "Something went wrong. Please try again later.");
        }
    }
    
    public function queryCouponByCode($couponCode) {
        $sql = "SELECT * FROM coupons WHERE code = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return array("status" => "error", "message" => "Failed to prepare statement.");
        }
        $stmt->bind_param("s", $couponCode);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc(); 
        } else {
            return null;
        }
    }
}