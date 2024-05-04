<?php

class Database
{
    public function __construct(
        private string $host,
        private string $dbname,
        private string $user,
        private string $password,
        private string $port,
    ) {
    }

    public function getConnection(): PDO
    {
        $dsn = "pgsql:host=$this->host;port=$this->port;dbname=$this->dbname";
        $options = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_EMULATE_PREPARES => false
        );

        $db = new PDO($dsn, $this->user, $this->password, $options);

        $createUserAccountTable = "CREATE TABLE IF NOT EXISTS tblUserAccount(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            password VARCHAR(255) NOT NULL,
            email VARCHAR(50) NOT NULL,
            createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMPTZ,
            CONSTRAINT unique_email UNIQUE (email),
            CONSTRAINT password_length CHECK (LENGTH(password) >= 4)
         )";

        $db->prepare($createUserAccountTable)->execute();

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
             username VARCHAR(50) NOT NULL,
             firstName VARCHAR(50) NOT NULL,
             lastName VARCHAR(50) NOT NULL,
             gender gender NOT NULL,
             birthdate DATE NOT NULL,
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
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(20) NOT NULL,
            visibility visibility_type NOT NULL,
            ownerId UUID,
            about varchar(255),
            communityImage VARCHAR(255),
            communityBanner VARCHAR(255),
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
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            userId UUID NOT NULL,
            communityId UUID NOT NULL,
            privilege community_user_privilege NOT NULL,
            createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMPTZ,
            FOREIGN KEY (communityId) REFERENCES tblCommunity(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES tblUserProfile(id)ON DELETE CASCADE
         )";
        $db->prepare($createCommunityMemberTable)->execute();

        $createPostTable = "CREATE TABLE IF NOT EXISTS tblPost(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            authorId UUID NOT NULL,
            communityId UUID NOT NULL,
            title VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMPTZ,
            FOREIGN KEY (authorId) REFERENCES tblUserProfile(id) ON DELETE CASCADE,
            FOREIGN KEY (communityId) REFERENCES tblCommunity(id) ON DELETE CASCADE
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
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            postId UUID NOT NULL,
            userId UUID NOT NULL,
            vote vote NOT NULL,
            createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMPTZ,
            CONSTRAINT unique_user_vote UNIQUE (postId, userId),
            FOREIGN KEY (postId) REFERENCES tblPost(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES tblUserProfile(id) ON DELETE CASCADE
        )";

        $db->prepare($createVoteTable)->execute();

        return $db;
    }
}