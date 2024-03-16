<?php

class User
{
    public $id;
    public $username;
    private $tblUserAccount = "tblUserAccount";
    private $tblUserProfile = "tblUserProfile";
    private $tblComment = "tblComment";
    public function __construct($id, $username)
    {
        // global $db;
        // $this->db = $db;
        $this->id = $id;
        $this->username = $username;
    }

    public static function register()
    {
        $requiredInputs = ["username", "password", "email", "firstName", "lastName", "gender", "birthDate"];

        foreach ($requiredInputs as $input) {
            if (!isset ($_POST[$input])) {
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
            $query = 'INSERT INTO tblUserAccount (username, password, email) VALUES (:username, :password, :email)';
            $stmt = $db->prepare($query);
            $password = htmlspecialchars(strip_tags(password_hash($password, PASSWORD_DEFAULT)));
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':email', $email);
            $resultId = null;
            try {
                $stmt->execute();
                $resultId = $db->lastInsertId();
            } catch (PDOException $e) {
                if ($e->getCode() == 23505) {
                    sendResponse("failed", "Username already taken", 409);
                }
                sendResponse("failed", "Failed to create account", 500);
            }
            $query = 'INSERT INTO tblUserProfile (accountId, firstName, lastName, gender, birthdate) VALUES (:accountId, :firstName, :lastName, :gender, :birthdate)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':accountId', $resultId);
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

        if (!isset ($_POST["username"]) || !isset ($_POST['password']))
            sendResponse("error", "Please provide all inputs", 400);

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
                $_SESSION['user'] = new User($user['id'], $username);
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
        $requiredInputs = ["title", "content"];

        foreach ($requiredInputs as $input) {
            if (!isset ($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }

        $title = $_POST['title'];
        $content = $_POST['content'];
        global $db;
        try {
            $query = 'INSERT INTO tblPost (authorId, title, content) VALUES (:authorId, :title, :content)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':authorId', $this->id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);

            if ($stmt->execute()) {
                sendResponse("success", "Post created successfully", 200);
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public static function getPost()
    {
        global $db;

        if (isset ($_GET['id'])) {
            $id = $_GET["id"];
            try {
                $query = "SELECT * FROM tblPost WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    sendResponse("success", "Post retrieved successfully", 200, array("post" => $result));
                } else {
                    sendResponse("failed", "Post not found", 404);
                }

            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        }

        if (isset ($_GET['page'])) {
            $page = $_GET["page"];
            $pageSize = 5;
            $offset = ($page - 1) * $pageSize;

            try {
                $query = "SELECT * FROM tblPost ORDER BY id DESC LIMIT :pageSize OFFSET :offset";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":pageSize", $pageSize);
                $stmt->bindParam(":offset", $offset);
                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($results) {
                    sendResponse("success", "Post retrieved successfully", 200, array("posts" => $results));
                } else {
                    sendResponse("failed", "Page not found", 404);
                }

            } catch (PDOException $e) {
                sendResponse("failed", $e->getMessage(), 500);
            }
        }

        if (isset ($_GET['filter'])) {
            $filter = '%' . $_GET['filter'] . '%';

            try {
                $query = "SELECT * FROM tblPost WHERE content LIKE :contentFilter OR title LIKE :titleFilter";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":contentFilter", $filter);
                $stmt->bindParam(":titleFilter", $filter);

                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        if (!isset ($_GET['id']))
            sendResponse("failed", "Please provide the post's id to update", 200);

        global $db;
        $id = $_GET['id'];
        $title = isset ($_POST['title']) ? $_POST['title'] : null;
        $body = isset ($_POST['body']) ? $_POST['body'] : null;

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
        if (!isset ($_GET['id']))
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
            if (!isset ($_POST[$input])) {
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

        if (!isset ($query_params['postId']))
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
            if (!isset ($_POST[$input])) {
                sendResponse("error", ucfirst($input) . " is missing", 400);
            }
        }


        global $db;
        $content = $_POST['content'];
        $postId = $_POST['postId'];

        if (!isset ($_POST['parentComment'])) {
            try {
                $query = "INSERT INTO tblComment (userId, postId, content) VALUES (:userId, :postId, :content)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":userId", $this->id);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":content", $content);
                if ($stmt->execute()) {
                    sendResponse("success", "created comment successfully", 200);
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
                $stmt->bindParam(":parentComment", $_POST['parentComment']);
                $stmt->bindParam(":content", $content);
                if ($stmt->execute()) {
                    sendResponse("success", "created comment successfully", 200);
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

        if (!isset ($query_params['commentId']))
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
}
?>