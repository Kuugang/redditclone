<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

require_once("../../core/initialize.php");

echo json_encode(array("message" => $_SESSION['username']));
?>