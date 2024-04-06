<?php
require_once "../../core/initialize.php";
require "../../core/protected.php";

header('Access-Control-Allow-Methods: POST');

$user = unserialize(serialize($_SESSION["user"]));
$user->readCommunity();