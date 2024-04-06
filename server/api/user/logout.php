<?php
require_once ("../../core/initialize.php");
header('Access-Control-Allow-Methods: POST');

session_start();
session_destroy();

sendResponse("success", "Logged out successfully", 200);
exit();