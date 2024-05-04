<?php

// session_start();

// if (!isset ($_SESSION['user'])) {
//     sendResponse("faield", "You are not authenticated", 403);
//     exit();
// }

// var_dump(session_status());
// if (session_status() === PHP_SESSION_NONE) {
//     sendResponse("UTIN", "UTIN", 200);
//     // session_start();
// }

if (isset($_COOKIE['PHPSESSID'])) {
    $sessionID = $_COOKIE['PHPSESSID'];
    session_start();
    if ($sessionID !== session_id())
        sendResponse("failed", "You are not authenticated", 403);
} else {
    sendResponse("failed", "session id not found", 403);
}
