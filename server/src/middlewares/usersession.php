<?php

function getUser(): User
{
    if (isset($_COOKIE['PHPSESSID'])) {
        $session_id = $_COOKIE['PHPSESSID'];
        session_id($session_id);
        session_start();
        return $_SESSION['user'];
    } else {
        sendResponse(false, "Session ID not found", 403);
    }
}