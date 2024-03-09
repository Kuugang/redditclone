<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

require_once("../../core/initialize.php");

echo json_encode(array("message" => $_SESSION['username']));

// $user = new Player($db);

// if (isset($_GET['user'])) {
//     $accountname = $_GET['user'];

//     $account = $user->getUser($accountname);

//     if ($account) {
//         echo json_encode($account);
//     } else {
//         http_response_code(404);
//         echo json_encode(array("error" => "Account not found"));
//     }
// } else {
//     echo json_encode($user->getAllUsers());
// }
?>