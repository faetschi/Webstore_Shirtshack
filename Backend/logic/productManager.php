<?php
include_once("../config/DataHandler_Product.php");
include_once("../config/dbaccess.php");

class ProductManager {
    private $dh;

    function __construct() {
        $this->dh = new DataHandler_Product();
    }

    public function updateProduct($param) {
        // Extract parameters
        $id = $param['id'];
        $name = $param['name'];
        $description = $param['description'];
        $price = $param['price'];
        $category = $param['category'];
        $image = $param['image'];

        // Validate parameters (not shown for brevity)
            // image = rückgängig convert -> fertigesBild
            // fertigesBild abspeichern in den media folder
            // pfad zum mediafolder in die db (../media/fertigesBild.jpg)

        // Update the product
        return $this->dh->updateProduct($id, $name, $description, $price, $category, $image);
        
      
    }


    public function deleteProduct($param) {
        $id = $param['id'];

        if (!$id) {
            return ['status' => 'error', 'message' => 'Invalid input'];
        }

        $result = $this->dh->deleteProduct($id);

        return $result;
    }



    public function getProducts($param) {
        try {
            $products = $this->dh->getProductsWithCategory();
            return array(
                'status' => 'success',
                'data' => $products
            );
        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => $e->getMessage()
            );
        }
    }



    public function getProductsWithCategory() {
        try {
            $products = $this->dh->getProductsWithCategory();
            return array("status" => "success", "data" => $products);
        } catch (Exception $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }
    

    
    public function getCategories() {
        try {
            $categories = $this->dh->getCategories();
            return array("status" => "success", "data" => $categories);
        } catch (Exception $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }
    


    public function addProduct($param) {
        // Extract parameters
        $name = $param['name'];
        $description = $param['description'];
        $price = $param['price'];
        $category_id = $param['category_id'];
        $imageBase64 = $param['imageBase64'];

        // Validate parameters (not shown for brevity)

        // Add the product
        $result = $this->dh->addProduct($name, $description, $price, $category_id, $imageBase64);
        
        if ($result['status'] == 'success') {
            return array(
                'status' => 'success',
                'message' => 'Product added successfully'
            );
        } else {
            return array(
                'status' => 'error',
                'message' => 'Error adding product: ' . $result['message']
            );
        }
    }

    public function getImage($param) {
        $productId = $param['id'];
    
        // Validate the product ID (not shown for brevity)
    
        try {
            $imagePath = $this->dh->getImagePathByProductId($productId);
    
            if ($imagePath) {
                // Assuming the image path is valid and the image exists
                return array(
                    'status' => 'success',
                    'imagePath' => $imagePath
                );
            } else {
                // If the image path is not found
                return array(
                    'status' => 'error',
                    'message' => 'Image not found for the given product ID.'
                );
            }
        } catch (Exception $e) {
            // Handle any exceptions that occur during the process
            return array(
                'status' => 'error',
                'message' => 'Exception caught while retrieving image: ' . $e->getMessage()
            );
        }
    }



    



    
}