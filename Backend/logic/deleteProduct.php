<?php
include('../config/dbaccess.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];

if ($id) {
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Execute failed: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
}

$conn->close();

