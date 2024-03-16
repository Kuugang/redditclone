<?php
function sendResponse($status, $message, $httpCode, $extraData = array())
{
    $responseData = array_merge(array("status" => $status, "message" => $message), $extraData);
    header("HTTP/1.1 " . $httpCode);
    echo json_encode($responseData);
    exit();
}
