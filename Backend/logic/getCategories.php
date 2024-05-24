<?php
include('../config/dbaccess.php');

header('Content-Type: application/json');

try {
    $query = "SELECT * FROM categories";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $categories]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No categories found']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

