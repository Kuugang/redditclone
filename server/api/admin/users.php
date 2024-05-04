<?php
require_once "../../core/initialize.php";
// require "../../core/protected.php";

header('Access-Control-Allow-Methods: GET');

// $user = unserialize(serialize($_SESSION["user"]));
User::adminGetUsers();
?>