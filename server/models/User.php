<?php

class User
{
    public $id;
    public $username;
    private $tblUserAccount = "tblUserAccount";
    private $tblUserProfile = "tblUserProfile";
    private $tblComment = "tblComment";


    private $user;

    public function __construct($id, $username, $user)
    {
        global $db;
        $this->id = $id;
        $this->username = $username;
        $this->user = $user;
    }

    public static function register()
    {
        $requiredInputs = ["username", "password", "email", "firstName", "lastName", "gender", "birthDate"];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }
        $username = $_POST['username'];
        $password = $_POST['password'];
        $email = $_POST['email'];

        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $gender = $_POST['gender'];
        $birthDate = $_POST['birthDate'];
        global $db;

        try {
            $query = 'INSERT INTO tblUserAccount (username, password, email) VALUES (:username, :password, :email) RETURNING * ';
            $stmt = $db->prepare($query);
            $password = password_hash($password, PASSWORD_DEFAULT);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':email', $email);
            $insertedRow = null;

            try {
                $stmt->execute();
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                if ($e->getCode() == 23505) {
                    sendResponse("failed", "Username already taken", 409);
                }
                sendResponse("failed", "Failed to create account", 500);
            }
            $query = 'INSERT INTO tblUserProfile (id, firstName, lastName, gender, birthdate) VALUES (:id, :firstName, :lastName, :gender, :birthdate)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $insertedRow['id']);
            $stmt->bindParam(':firstName', $firstName);
            $stmt->bindParam(':lastName', $lastName);
            $stmt->bindParam(':gender', $gender);
            $stmt->bindParam(':birthdate', $birthDate);

            if ($stmt->execute())
                sendResponse("success", "Registered successfully", 200);
        } catch (PDOException $e) {
            $code = $e->getCode();
            if ($code == 23505) {
                sendResponse("error", $e->getMessage(), 409);
            }
            sendResponse("error", $e->getMessage(), 500);
        }
    }

    public static function login()
    {
        $requiredInputs = ["username", "password"];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }

        $username = $_POST['username'];
        $password = $_POST['password'];
        global $db;

        try {
            $query = "SELECT * FROM tblUserAccount WHERE username = :username";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                sendResponse("error", "Incorrect username or password", 400);
            }

            if (password_verify($password, $user['password'])) {
                session_set_cookie_params([
                    'lifetime' => 3600,
                ]);
                session_start();
                $_SESSION['user'] = new User($user['id'], $username, $user);
                sendResponse("success", "Logged in successfuly", 200, array("sessionID" => session_id()));
            } else {
                sendResponse("error", "Incorrect username or password", 400);
            }
        } catch (PDOException $e) {
            sendResponse("error", $e->getMessage(), 500);
        }
    }

    public function createPost()
    {
        //for image inside content like markdown handle image uploading in client side
        $requiredInputs = ["title", "content", "communityId"];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }

        $inputs = array();

        foreach ($_POST as $key => $value) {
            $inputs[$key] = $value;
        }

        // $title = $_POST['title'];
        // $content = $_POST['content'];
        // $community = $_POST['community'];
        global $db;

        try {
            $query = 'INSERT INTO tblPost (authorId, communityId, title, content) VALUES (:authorId, :communityId, :title, :content) RETURNING *';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':authorId', $this->id);
            $stmt->bindParam(':communityId', $inputs['communityId']);
            $stmt->bindParam(':title', $inputs['title']);
            $stmt->bindParam(':content', $inputs['content']);

            if ($stmt->execute()) {
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT * FROM tblCommunity WHERE id = :communityId";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':communityId', $inputs['communityId']);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $insertedRow['community'] = $result;
                sendResponse("success", "Post created successfully", 200, array("newPost" => $insertedRow));
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public static function getPost()
    {
        global $db;

        if (isset($_GET['id'])) {
            $id = $_GET["id"];
            try {
                $query = "SELECT p.*, 
                         COUNT(CASE WHEN v.vote = 'upvote' THEN 1 END) AS upvote_count,
                         COUNT(CASE WHEN v.vote = 'downvote' THEN 1 END) AS downvote_count,
                         u.username AS authorusername,
                         c.name AS communityname
                    FROM tblPost p
                    LEFT JOIN tblVote v ON p.id = v.postid
                    LEFT JOIN tblUserAccount u ON p.authorid = u.id
                    LEFT JOIN tblCommunity c ON p.communityid = c.id
                   WHERE p.id = :id
                GROUP BY p.id, p.title, p.content, p.authorid, u.username, c.name";

                $stmt = $db->prepare($query);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $result['author'] = array('id' => $result['authorid'], 'username' => $result['authorusername']);
                unset($result['authorid'], $result['authorusername']);
                $result['community'] = array('id' => $result['communityid'], 'name' => $result['communityname']);
                unset($result['communityid'], $result['communityname']);

                $query = "SELECT comment.*, 
                    u.username as commentauthorusername 
                FROM tblComment comment 
                LEFT JOIN tblUserAccount u ON u.id = comment.userid 
                WHERE postid = :postid";


                $stmt = $db->prepare($query);
                $stmt->bindParam(":postid", $id);
                $stmt->execute();
                $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);


                foreach ($comments as &$comment) {
                    $comment['parent'] = $comment['parentcomment'];
                    $comment['author'] = array('id' => $comment['userid'], 'username' => $comment['commentauthorusername']);

                    unset($comment['userid'], $comment['postid'], $comment['parentcomment'], $comment['commentauthorusername']);
                }

                $result['comments'] = $comments;

                if ($result) {
                    sendResponse("success", "Post retrieved successfully", 200, array("post" => $result));
                } else {
                    sendResponse("failed", "Post not found", 404);
                }

            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        }

        if (isset($_GET['page'])) {
            $page = $_GET["page"];
            $pageSize = 5;
            $offset = ($page - 1) * $pageSize;

            try {
                $query = "SELECT p.*, 
                 (SELECT COUNT(*) FROM tblVote v WHERE v.postid = p.id AND v.vote = 'upvote') as upvote_count, 
                 (SELECT COUNT(*) FROM tblVote v WHERE v.postid = p.id AND v.vote = 'downvote') as downvote_count, 
                 (SELECT COUNT(*) FROM tblComment cm WHERE cm.postid = p.id) as comment_count, 

                 u.username as authorusername, 
                 c.name as communityname
    
                FROM tblPost p 
                LEFT JOIN tblUserAccount u ON p.authorid = u.id 
                LEFT JOIN tblCommunity c ON p.communityid = c.id 
                ORDER BY p.id DESC 
                LIMIT :pageSize OFFSET :offset";

                $stmt = $db->prepare($query);
                $stmt->bindParam(":pageSize", $pageSize, PDO::PARAM_INT);
                $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);
                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($results as &$result) {
                    $result['author'] = array(
                        'id' => $result['authorid'],
                        'username' => $result['authorusername']
                    );
                    $result['community'] = array(
                        'id' => $result['communityid'],
                        'name' => $result['communityname']
                    );
                    unset($result['authorid'], $result['authorusername'], $result['communityname'], $result['communityid']);
                }

                if ($results) {
                    sendResponse("success", "Posts retrieved successfully", 200, array("posts" => $results));
                } else {
                    sendResponse("failed", "Page not found", 404);
                }
            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        }

        if (isset($_GET['filter'])) {
            $filter = '%' . $_GET['filter'] . '%';

            try {
                $query = "SELECT p.*, 
                       COALESCE(upvotes.upvote_count, 0) as upvote_count,
                       COALESCE(downvotes.downvote_count, 0) as downvote_count,
                       COALESCE(comments.comment_count, 0) as comment_count,
                       u.username as authorusername, 
                       c.name as communityname
                FROM tblPost p 
                LEFT JOIN tblUserAccount u ON p.authorid = u.id 
                LEFT JOIN tblCommunity c ON p.communityid = c.id 
                LEFT JOIN (
                    SELECT postid, COUNT(*) as upvote_count 
                    FROM tblVote 
                    WHERE vote = 'upvote' 
                    GROUP BY postid
                ) as upvotes ON upvotes.postid = p.id
                LEFT JOIN (
                    SELECT postid, COUNT(*) as downvote_count 
                    FROM tblVote 
                    WHERE vote = 'downvote' 
                    GROUP BY postid
                ) as downvotes ON downvotes.postid = p.id
                LEFT JOIN (
                    SELECT postid, COUNT(*) as comment_count 
                    FROM tblComment 
                    GROUP BY postid
                ) as comments ON comments.postid = p.id
                WHERE p.content LIKE :contentFilter OR p.title LIKE :titleFilter
                ORDER BY p.id DESC";

                $stmt = $db->prepare($query);
                $stmt->bindParam(":contentFilter", $filter, PDO::PARAM_STR);
                $stmt->bindParam(":titleFilter", $filter, PDO::PARAM_STR);
                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($results as &$result) {
                    $result['author'] = array(
                        'id' => $result['authorid'],
                        'username' => $result['authorusername'],
                    );
                    $result['community'] = array(
                        'id' => $result['communityid'],
                        'name' => $result['communityname']
                    );

                    unset($result['authorid'], $result['authorusername'], $result['communityid'], $result['communityname']);
                }


                if ($results) {
                    sendResponse("success", "Posts retrieved successfully", 200, array("posts" => $results));
                } else {
                    sendResponse("failed", "No posts found", 404);
                }
            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        }
    }

    public function updatePost()
    {
        if (!isset($_GET['id']))
            sendResponse("failed", "Please provide the post's id to update", 200);

        global $db;
        $id = $_GET['id'];
        $title = isset($_POST['title']) ? $_POST['title'] : null;
        $body = isset($_POST['body']) ? $_POST['body'] : null;

        try {
            $query = 'UPDATE tblPost SET ';
            $params = array();

            if ($title !== null) {
                $query .= 'title = :title';
                $params[':title'] = $title;
            }

            if ($body !== null) {
                if ($title !== null) {
                    $query .= ', ';
                }
                $query .= 'body = :body';
                $params[':body'] = $body;
            }

            $query .= ' WHERE id = :id AND author = :author';

            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':author', $this->id);
            foreach ($params as $param => $value) {
                $stmt->bindParam($param, $value);
            }

            $stmt->execute();
            $result = $stmt->rowCount();

            if ($result == 0) {
                sendResponse("error", "Post not found or unauthorized", 400);
            }
            sendResponse("success", "Post updated sucessfully", 200);
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public function deletePost()
    {
        if (!isset($_GET['id']))
            sendResponse("failed", "Please provide the post's id to delete", 400);

        global $db;
        $id = $_GET["id"];

        try {
            $query = 'DELETE FROM tblPost WHERE id = :id AND authorId = :authorId';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':authorId', $this->id);

            if ($stmt->execute()) {
                $affectedRows = $stmt->rowCount();
                if ($affectedRows > 0) {
                    sendResponse("success", "Post deleted succesfully", 200);
                } else {
                    sendResponse("error", "Post not found or unauthorized", 400);
                }
            } else {
                sendResponse("error", "Faled to delete post", 500);
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }


    public function vote()
    {
        $requiredInputs = ["postId", "vote"];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }

        global $db;
        $postId = $_POST['postId'];
        $vote = $_POST['vote'];

        try {
            $query = "SELECT * FROM tblVote WHERE postId = :postId AND userId = :userId";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":postId", $postId);
            $stmt->bindParam(":userId", $this->id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);


            if ($result == null) {
                $query = "INSERT INTO tblVote (postId, userId, vote) VALUES (:postId, :userId, :vote)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":userId", $this->id);
                $stmt->bindParam(":vote", $vote);
                $stmt->execute();
            } else {
                $query = "UPDATE tblVote SET vote = :vote WHERE postId = :postId AND userId = :userId";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":vote", $vote);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":userId", $this->id);
                $stmt->execute();
                $result = $stmt->rowCount();

                if ($result == 0) {
                    sendResponse("error", "Failed to vote post", 500);
                }
            }

            if ($vote == "upvote") {
                sendResponse("success", "Upvoted post", 200);
            } else {
                sendResponse("success", "Downvoted post", 200);
            }

        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public function deleteVote()
    {
        $query_params = [];
        if ($_SERVER['QUERY_STRING']) {
            parse_str($_SERVER['QUERY_STRING'], $query_params);
        }

        if (!isset($query_params['postId']))
            sendResponse("error", "Post ID is missing", 400);

        global $db;
        try {
            $query = "DELETE FROM tblVote WHERE userId = :userId AND postId = :postId";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":userId", $this->id);
            $stmt->bindParam(":postId", $query_params['postId']);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                sendResponse('success', 'Vote deleted', 200);
            } else {
                sendResponse('failed', 'Failed to delete vote', 500);
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public function createComment()
    {
        $requiredInputs = ["postId", "content"];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }
        $inputs = array();

        foreach ($_POST as $key => $value) {
            $inputs[$key] = $value;
        }

        global $db;

        if (!isset($_POST['parentComment'])) {
            try {
                $query = "INSERT INTO tblComment (userId, postId, content) VALUES (:userId, :postId, :content)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":userId", $this->id);
                $stmt->bindParam(":postId", $inputs['postId']);
                $stmt->bindParam(":content", $inputs['content']);

                if ($stmt->execute()) {
                    sendResponse("success", "Comment created successfully", 200);
                } else {
                    sendResponse("failed", "failed to create comment", 200);
                }
            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        } else {
            try {
                $query = "INSERT INTO tblComment (userId, postId, parentComment, content) VALUES (:userId, :postId, :parentComment, :content)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":userId", $this->id);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":parentComment", $inputs['parentComment']);
                $stmt->bindParam(":content", $content);
                if ($stmt->execute()) {
                    sendResponse("success", "Comment created successfully", 200);
                } else {
                    sendResponse("failed", "failed to create comment", 200);
                }
            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }


        }
    }

    public function deleteComment()
    {
        $query_params = [];
        if ($_SERVER['QUERY_STRING']) {
            parse_str($_SERVER['QUERY_STRING'], $query_params);
        }

        if (!isset($query_params['commentId']))
            sendResponse("error", "Comment ID is missing", 400);

        $commentId = $query_params['commentId'];
        global $db;

        try {
            $query = 'DELETE FROM ' . $this->tblComment . ' WHERE userId = :userId AND id = :id';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $commentId);
            $stmt->bindParam(':userId', $this->id);
            if ($stmt->execute()) {
                $affectedRows = $stmt->rowCount();
                if ($affectedRows > 0) {
                    sendResponse('success', 'Comment deleted successfully', 200);
                } else {
                    sendResponse('failed', 'Comment not found', 404);
                }
            } else {
                sendResponse('failed', 'Failed to delete comment', 500);
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }
    public function createCommunity()
    {
        $requiredInputs = ['name', 'visibility'];

        foreach ($requiredInputs as $input) {
            if (!isset($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }
        $name = $_POST['name'];
        $visibility = $_POST['visibility'];

        global $db;
        try {
            $query = "INSERT INTO tblCommunity (name, visibility, ownerId) VALUES (:name, :visibility, :ownerId) RETURNING *";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":visibility", $visibility);
            $stmt->bindParam(":ownerId", $this->id);

            if ($stmt->execute()) {
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);
                $query = 'INSERT INTO tblCommunityMember(userId, communityId, privilege) VALUES (:userId, :communityId, :privilege)';
                $stmt = $db->prepare($query);
                $stmt->bindParam(":userId", $this->id);
                $stmt->bindParam(":communityId", $insertedRow['id']);
                $privilege = "administrator";
                $stmt->bindParam(":privilege", $privilege);
                $stmt->execute();
                sendResponse(true, "Created community succesfully", 200 , array('data'=>array('newCommunity'=>$insertedRow)));
            } else {
                sendResponse(false, "Failed to create community", 200);
            }

        } catch (PDOException $e) {
            $code = $e->getCode();
            if($code == 23505)
                sendResponse(false, "Community already exists", 500);


            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function readCommunity()
    {
        // $requiredInputs = ["name", "visibility"];
        // foreach ($requiredInputs as $input) {
        //     if (!isset ($_POST[$input])) {
        //         sendResponse("error", ucfirst($input) . " is missing", 400);
        //     }
        // }
        // $name = $_POST['name'];
        // $visibility = $_POST['visibility'];

        global $db;
        try {
            $query = "SELECT * FROM tblCommunity";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            sendResponse("success", "Successfully fetched communities", 200, array("data" => array("communities" => $result)));
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }
}