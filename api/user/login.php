<?php
require_once("../../core/initialize.php");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header('Access-Control-Allow-Methods: POST');


$userHandler = new UserHandler($db);
$userHandler->login();
?>