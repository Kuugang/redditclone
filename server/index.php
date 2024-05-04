<?php

declare(strict_types=1);

spl_autoload_register(function ($class) {
    require __DIR__ . "/src/$class.php";
});

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

header("Content-type: application/json; charset=UTF-8");

defined('DS') ? null : define("DS", DIRECTORY_SEPARATOR);
defined("SITE_ROOT") ? null : define("SITE_ROOT", realpath(dirname(__FILE__)) . DS . "./src");
defined("CONTROLLERS_PATH") ? null : define("CONTROLLERS_PATH", SITE_ROOT . DS . 'controllers');
defined("MIDDLEWARES_PATH") ? null : define("MIDDLEWARES_PATH", SITE_ROOT . DS . 'middlewares');
$controllers = glob(CONTROLLERS_PATH . DS . "*.php");
$middlewares = glob(MIDDLEWARES_PATH . DS . "*.php");

foreach ($controllers as $c) {
    require_once $c;
}
foreach ($middlewares as $m) {
    require_once $m;
}

require_once ("./src/utils.php");


$parts = explode("/", $_SERVER["REQUEST_URI"]);


$host = "aws-0-ap-southeast-1.pooler.supabase.com";
$port = "5432";
$dbname = "postgres";
$user = "postgres.rafhblqrgvjzlxhigvlt";
$password = "owgzvI0A9cLb4XDL";

$database = new Database("$host", "$dbname", $user, $password, $port);

if (str_contains($parts[1], '?')) {
    $parts[1] = explode("?", $parts[1])[0];
}


switch ($parts[1]) {
    case "users":
        $controller = new UserController($database);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $parts);
        break;
    case "communities":
        $controller = new CommunityController($database);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $parts);
        break;
    case "posts":
        $controller = new PostController($database);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $parts);
        break;
    default:
        http_response_code(404);
        exit;
}

// if ($parts[1] == "products") {
//     $gateway = new ProductGateway($database);
//     $controller = new ProductController($gateway);
//     $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
// }