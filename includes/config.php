<?php

$host = "aws-0-ap-southeast-1.pooler.supabase.com";
$port = "5432";
$dbname = "postgres";
$user = "postgres.rafhblqrgvjzlxhigvlt";
$password = "owgzvI0A9cLb4XDL";
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password";
    $db = new PDO($dsn);

    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $createUserAccountTable = "CREATE TABLE IF NOT EXISTS tblUserAccount(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        emailAddress VARCHAR(50),
        CONSTRAINT unique_username UNIQUE (username),
        CONSTRAINT password_length CHECK (LENGTH(password) >= 4)
    )";

    $db->prepare($createUserAccountTable)->execute();

//     $db->prepare("IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
// CREATE TYPE my_type AS
// (
//     'male',
//     'female',
//     'others'
// );")->execute();
    //
    
    $createUserProfileTable = "CREATE TABLE IF NOT EXISTS tblUserProfile(
        id SERIAL PRIMARY KEY,
        accountId int,
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        gender VARCHAR(50),
        birthdate DATE,
        FOREIGN KEY (accountId) REFERENCES tblUserAccount(id) ON DELETE CASCADE
    )";

    $db->prepare($createUserProfileTable)->execute();

    // $createPostTable = "CREATE TABLE IF NOT EXISTS tblPost(
    //     id SERIAL PRIMARY KEY,
    //     author INT,
    //     title VARCHAR(50) NOT NULL,
    //     body TEXT NOT NULL,
    //     FOREIGN KEY (author) REFERENCES tblUserProfile(id) ON DELETE CASCADE
    // )";

    // $db->prepare($createPostTable)->execute();
    header("HTTP/1.1 200 OK");
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>