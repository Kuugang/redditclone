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

    // $localTimezone = date_default_timezone_get();
    // $setTZQuery = "SET TIME ZONE '" . $localTimezone . "'";
    // $result = $db->prepare($setTZQuery)->execute();

    $createUserAccountTable = "CREATE TABLE IF NOT EXISTS tblUserAccount(
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(50) NOT NULL,
        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMPTZ,
        CONSTRAINT unique_username UNIQUE (username),
        CONSTRAINT unique_email UNIQUE (email),
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
        id UUID PRIMARY KEY,
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        gender gender,
        birthdate DATE,
        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMPTZ,
        FOREIGN KEY (id) REFERENCES tblUserAccount(id) ON DELETE CASCADE
    )";

    $db->prepare($createUserProfileTable)->execute();

    //create community visibility
    $db->prepare("
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visibility_type') THEN
            CREATE TYPE visibility_type AS ENUM ('public', 'restricted', 'private');
        END IF;
    END $$;
    ")->execute();

    $createCommunity = "CREATE TABLE IF NOT EXISTS tblCommunity(
       id SERIAL PRIMARY KEY,
       name VARCHAR(20) NOT NULL,
       visibility visibility_type NOT NULL,
       ownerId UUID,
       about varchar(255),
       createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMPTZ,
       CONSTRAINT unique_community_name UNIQUE (name),
       FOREIGN KEY (ownerId) REFERENCES tblUserProfile(id)
   )";
    $db->prepare($createCommunity)->execute();

    $db->prepare("
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'community_user_privilege') THEN
            CREATE TYPE community_user_privilege AS ENUM ('member', 'moderator', 'administrator');
        END IF;
    END $$;
    ")->execute();

    $createCommunityMemberTable = "CREATE TABLE IF NOT EXISTS tblCommunityMember(
       id SERIAL PRIMARY KEY,
       userId UUID,
       communityId int,
       privilege community_user_privilege NOT NULL,
       createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMPTZ,
       FOREIGN KEY (communityId) REFERENCES tblCommunity(id),
       FOREIGN KEY (userId) REFERENCES tblUserProfile(id)
    )";
    $db->prepare($createCommunityMemberTable)->execute();

    $createPostTable = "CREATE TABLE IF NOT EXISTS tblPost(
       id SERIAL PRIMARY KEY,
       authorId UUID,
       communityId int,
       title VARCHAR(50) NOT NULL,
       content TEXT NOT NULL,
       createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMPTZ,
       FOREIGN KEY (authorId) REFERENCES tblUserProfile(id) ON DELETE CASCADE,
       FOREIGN KEY (communityId) REFERENCES tblCommunity(id) ON DELETE CASCADE
   )";

    $db->prepare($createPostTable)->execute();
    //
//    //create enum type vote
//    $db->prepare("
//    DO $$
//    BEGIN
//        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote') THEN
//            CREATE TYPE vote AS ENUM ('upvote', 'downvote');
//        END IF;
//    END $$;
//    ")->execute();
//
//    $createVoteTable = "CREATE TABLE IF NOT EXISTS tblVote(
//        id SERIAL PRIMARY KEY,
//        postId INT,
//        userId INT,
//        vote vote,
//        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//        updatedAt TIMESTAMPTZ,
//        CONSTRAINT unique_user_vote UNIQUE (postId, userId),
//        FOREIGN KEY (postId) REFERENCES tblPost(id) ON DELETE CASCADE,
//        FOREIGN KEY (userId) REFERENCES tblUserProfile(accountId) ON DELETE CASCADE
//    )";
//
//    $db->prepare($createVoteTable)->execute();
//
//    $createCommentTable = "CREATE TABLE IF NOT EXISTS tblComment(
//        id SERIAL PRIMARY KEY,
//        userId INT,
//        postId INT,
//        parentComment INT,
//        content VARCHAR(512),
//        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//        updatedAt TIMESTAMPTZ,
//        FOREIGN KEY (userId) REFERENCES tblUserProfile(accountId) ON DELETE CASCADE,
//        FOREIGN KEY (postId) REFERENCES tblPost(id) ON DELETE CASCADE,
//        FOREIGN KEY (parentcomment) references tblcomment(id) on delete cascade
//    )";
//
//    $db->prepare($createCommentTable)->execute();
//
//    $createMessageTable = "CREATE TABLE IF NOT EXISTS tblMessage(
//        id SERIAL PRIMARY KEY,
//        senderId INT,
//        receiverId INT,
//        message TEXT,
//        createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//        updatedAt TIMESTAMPTZ,
//        FOREIGN KEY (senderId) REFERENCES tblUserProfile(id),
//        FOREIGN KEY (senderId) REFERENCES tblUserProfile(id)
//    )";
//
//    $db->prepare($createMessageTable)->execute();
    header("HTTP/1.1 200 OK");
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}