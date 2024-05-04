<?php
function sendResponse($status, $message, $httpCode, $extraData = array())
{
    $responseData = array_merge(array("status" => $status, "message" => $message), $extraData);
    header("HTTP/1.1 " . $httpCode);
    echo json_encode($responseData);
    exit();
}

function checkHTTPMethod(array $methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods)) {
        sendResponse(false, "Invalid HTTP Request Method", 400);
    }
}

function validateRequiredFields(array $inputs)
{
    switch ($_SERVER['REQUEST_METHOD']) {
        case "POST":
        case "GET":
            foreach ($inputs as $input) {
                if (!isset($_REQUEST[$input])) {
                    sendResponse(false, $input . " is missing", 400);
                }
            }
            break;
        case "DELETE":
            $request_body = file_get_contents('php://input');
            $data = json_decode($request_body, true);

            foreach ($inputs as $input) {
                if (!array_key_exists($input, $data)) {
                    sendResponse(false, $input . " is missing", 400);
                }
            }
            break;
    }
}

function validateRequiredJSONInput($inputs)
{
    try {
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        foreach ($inputs as $input) {
            if (!array_key_exists($input, $data)) {
                sendResponse(false, $input . " is missing", 400);
            }
        }
    } catch (Exception $e) {
        sendResponse(false, $e->getMessage(), 400);
    }
}

function getJSONInputValue($input)
{
    try {
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        return $data[$input];
    } catch (Exception $e) {
        return null;
    }
}

function uploadImage(string $image, string $bucket)
{
    if (isset($_FILES[$image])) {
        $image_type = $_FILES[$image]["type"];
        $image_tmp_name = $_FILES[$image]["tmp_name"];

        $apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZmhibHFyZ3Zqemx4aGlndmx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTYxMzI5NiwiZXhwIjoyMDI1MTg5Mjk2fQ.hdnYG3UDwEolp6-mspMJHC3TevtNy09lnTE9dUmhjJw';

        $upload_uid = uniqid();

        $bucketURL = "https://rafhblqrgvjzlxhigvlt.supabase.co/storage/v1/object/" . $bucket . "/";
        $publicBucketURL = "https://rafhblqrgvjzlxhigvlt.supabase.co/storage/v1/object/public/" . $bucket . "/";

        $supabaseUrl = $bucketURL . $upload_uid . '.' . explode("/", $image_type)[1];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $supabaseUrl);

        curl_setopt($ch, CURLOPT_POST, 1);

        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($image_tmp_name));

        $headers = [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: ' . $image_type,
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            echo 'Error: ' . curl_error($ch);
            curl_close($ch);
            sendResponse(false, "Failed to upload community image", 500);
        } else {
            $response_data = json_decode($response, true);
            $key_value = $response_data['Key'];
            curl_close($ch);
            return $publicBucketURL . explode("/", $key_value)[1];
        }
    } else {
        return null;
    }
}