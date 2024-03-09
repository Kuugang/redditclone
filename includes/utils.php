<?php
function sendResponse($status, $message, $httpCode, $extraData = array())
{
    // Merge the extra data with the status and message
    $responseData = array_merge(array("status" => $status, "message" => $message), $extraData);

    // Send JSON response
    echo json_encode($responseData);

    // Set HTTP response code
    header("HTTP/1.1 " . $httpCode);

    // Exit script
    exit();
}

?>