<?php
require("../../core/protected.php");
require_once("../../core/initialize.php");

header('Access-Control-Allow-Methods: DELETE');

$user = unserialize(serialize($_SESSION["user"]));
$user->deletePost();
?>