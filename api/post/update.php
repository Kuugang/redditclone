<?php
require("../../core/protected.php");
require_once("../../core/initialize.php");

header('Access-Control-Allow-Methods: POST');

//should not be able to update other's post

$user = unserialize(serialize($_SESSION["user"]));
$user->updatePost();
?>