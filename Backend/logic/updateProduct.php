<?php
include('../config/dbaccess.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$category = $data['category'];

if ($id && $name && $description && $price && $category) {
    $stmt = $conn->prepare("UPDATE products SET name = ?, description = ?, price = ?, category_id = (SELECT id FROM categories WHERE name = ?) WHERE id = ?");
    $stmt->bind_param("ssdsi", $name, $description, $price, $category, $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update product']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
}

$conn->close();

