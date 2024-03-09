<?php

class User
{
    public $id;
    public $username;
    public function __construct($id, $username)
    {
        $this->id = $id;
        $this->username = $username;
    }

    public function createPost()
    {
        if (!isset($_POST['title']) || !isset($_POST['body']))
            sendResponse("failed", "Please provide all inputs", 400);

        $title = $_POST['title'];
        $body = $_POST['body'];

        global $db;

        try {
            $query = 'INSERT INTO tblPost (author, title, body) VALUES (:author, :title, :body)';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':author', $this->id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':body', $body);

            if ($stmt->execute()) {
                sendResponse("success", "Post created successfully", 200);
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public static function getPost()
    {
        if (!isset($_GET['id']))
            sendResponse("failed", "Please provide post id", 400);

        global $db;
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
            $query = 'DELETE FROM tblPost WHERE id = :id AND author = :author';
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':author', $this->id);

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
}

?>