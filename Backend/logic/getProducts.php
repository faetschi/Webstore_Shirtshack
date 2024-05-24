<?php
include('../config/dataHandler_Product.php');

header('Content-Type: application/json');

try {
    $dataHandler = new DataHandler_Product($conn);
    $products = $dataHandler->getProductsWithCategory();

    echo json_encode(['status' => 'success', 'data' => $products]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

