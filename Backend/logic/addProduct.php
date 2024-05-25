<?php
include('../config/dbaccess.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$category_id = $data['category_id'];

if ($name && $description && $price && $category_id) {
    $stmt = $conn->prepare("INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssdi", $name, $description, $price, $category_id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product added successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add product']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
}

$conn->close();

