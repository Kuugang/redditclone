<?php
defined('DS') ? null : define("DS", DIRECTORY_SEPARATOR);
defined("SITE_ROOT") ? null : define("SITE_ROOT", realpath(dirname(__FILE__)) . DS . "..");
defined("INC_PATH") ? null : define("INC_PATH", SITE_ROOT . DS . 'includes');
defined("CORE_PATH") ? null : define("CORE_PATH", SITE_ROOT . DS . 'core');
defined("MODELS_PATH") ? null : define("MODELS_PATH", SITE_ROOT . DS . 'models');
defined("FRONTEND_URL") ? null : define("FRONTEND_URL", "http://localhost:3000");

require_once(INC_PATH . DS . "config.php");
require_once(INC_PATH . DS . "utils.php");

$models = glob(MODELS_PATH . DS . "*.php");

foreach ($models as $model) {
    require_once $model;
}

header("Access-Control-Allow-Origin: " . FRONTEND_URL);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");