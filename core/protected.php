<?php
session_start();
if (!isset($_SESSION['user'])) {
    http_response_code(403);
    echo json_encode(array("status" => "failed", "message" => "You are not authenticated"));
    exit();
}
?>