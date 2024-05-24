<?php
// redirects logic components to the front end ajax call
// handles all requests: POST and GET
$param = "";
$method = "";
$logicComponent = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // every front end request must have a logic component, method and param
    $logicComponent = $data['logicComponent'];
    $method = $data['method'];
    $param = $data['param'];
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $logicComponent = $_GET['logicComponent'];
    $method = $_GET['method'];
    $param = $_GET['param'];
} else {
    response("POST", 400, array("status" => "error", "message" => "Invalid request method"));
    exit();
}

$logicFile = "../logic/" . $logicComponent . ".php";
if (file_exists($logicFile)) {
    include($logicFile);
    $logic = new $logicComponent();
} else {
    response("POST", 400, array("status" => "error", "message" => "Invalid logic component"));
    exit();
}

$result = $logic->$method($param);
if ($result) {
    response($_SERVER['REQUEST_METHOD'], 200, $result);
} else {
    response($_SERVER['REQUEST_METHOD'], 400, array("status" => "error", "message" => "Error processing request"));
}

function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($method) {
        case "POST":
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}