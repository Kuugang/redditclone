<?php
require_once("../../core/initialize.php");
header('Access-Control-Allow-Methods: GET');

//todo should not be protected route
// require("../../core/protected.php");

User::getPost();
?>