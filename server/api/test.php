<?php
require_once("../core/initialize.php");
$supabaseUrl = 'https://rafhblqrgvjzlxhigvlt.supabase.co/storage/v1/object/post-images/test.jpg';
$filePath = SITE_ROOT . DS . 'cato.jpg';
$apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZmhibHFyZ3Zqemx4aGlndmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MTMyOTYsImV4cCI6MjAyNTE4OTI5Nn0.PPsQS0BFAVjYnk9WejQBnXAoAWAROX4fTX8GbY7sg5g';
$bearerToken = 'DF/9o9MigzgIuYT0S1h8gKtE2zzp/t6NjeBpV/IpfkGkq9pBBUYECmPxUMQ3ceXNiptAQx+BaGT2VHYJImW5qA==';

$ch = curl_init();

// Set URL
curl_setopt($ch, CURLOPT_URL, $supabaseUrl);

// Set method to POST
curl_setopt($ch, CURLOPT_POST, 1);

// Set data to be sent as binary
curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($filePath));

// Set headers
$headers = [
    // 'apikey: ' . $apiKey,
    'Authorization: Bearer ' . $bearerToken,
    'Content-Type: application/octet-stream', // Assuming binary data
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Return response as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    echo 'Response: ' . $response;
}

// Close cURL resource
curl_close($ch);
?>