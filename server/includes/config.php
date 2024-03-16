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
        email VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_username UNIQUE (username),
        CONSTRAINT password_length CHECK (LENGTH(password) >= 4)
    )";

    $db->prepare($createUserAccountTable)->execute();

    //create enum type gender
    $db->prepare("
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
            CREATE TYPE gender AS ENUM ('male', 'female', 'others');
        END IF;
    END $$;
    ")->execute();

    $createUserProfileTable = "CREATE TABLE IF NOT EXISTS tblUserProfile(
        id SERIAL PRIMARY KEY,
        accountId int NOT NULL,
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        gender gender,
        birthdate DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        CONSTRAINT unique_accountId UNIQUE (accountId),
        FOREIGN KEY (accountId) REFERENCES tblUserAccount(id) ON DELETE CASCADE
    )";

    $db->prepare($createUserProfileTable)->execute();

    $createPostTable = "CREATE TABLE IF NOT EXISTS tblPost(
        id SERIAL PRIMARY KEY,
        authorId INT,
        title VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES tblUserProfile(accountid) ON DELETE CASCADE
    )";

    $db->prepare($createPostTable)->execute();

    //create enum type vote
    $db->prepare("
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote') THEN
            CREATE TYPE vote AS ENUM ('upvote', 'downvote');
        END IF;
    END $$;
    ")->execute();

    $createVoteTable = "CREATE TABLE IF NOT EXISTS tblVote(
        id SERIAL PRIMARY KEY,
        postId INT,
        userId INT,
        vote vote,
        CONSTRAINT unique_user_vote UNIQUE (postId, userId),
        FOREIGN KEY (postId) REFERENCES tblPost(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES tblUserProfile(accountId) ON DELETE CASCADE
    )";

    $db->prepare($createVoteTable)->execute();

    $createCommentTable = "CREATE TABLE IF NOT EXISTS tblComment(
        id SERIAL PRIMARY KEY,
        userId INT,
        postId INT,
        parentComment INT, 
        content VARCHAR(512),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES tblUserProfile(id) ON DELETE CASCADE,
        FOREIGN KEY (postId) REFERENCES tblPost(id) ON DELETE CASCADE,
        FOREIGN KEY (parentcomment) references tblcomment(id) on delete cascade
    )";

    $db->prepare($createCommentTable)->execute();

    $createMessageTable = "CREATE TABLE IF NOT EXISTS tblMessage(
        id SERIAL PRIMARY KEY,
        senderId INT,
        receiverId INT,
        message TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES tblUserProfile(id),
        FOREIGN KEY (senderId) REFERENCES tblUserProfile(id)
    )";

    $db->prepare($createMessageTable)->execute();

    header("HTTP/1.1 200 OK");
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>