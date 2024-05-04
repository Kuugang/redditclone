<?php

class PostController
{
    private PDO $conn;
    public function __construct($database)
    {
        $this->conn = $database->getConnection();
    }

    public function processRequest(string $method, ?array $parts): void
    {
        $route = '/' . implode("/", array_slice($parts, 2));
        switch ($route) {
            case "/":
                checkHTTPMethod(["GET", "POST", "DELETE", "PUT"]);
                switch ($_SERVER['REQUEST_METHOD']) {
                    case "POST":
                        $this->createPost();
                        break;
                    case "GET":
                        $this->getPosts();
                        break;
                    case "DELETE";
                        $this->deletePost();
                        break;
                    case "PUT":
                        $this->updatePost();
                        break;
                }
                break;
            case "/votes":
                checkHTTPMethod(["GET", "POST", "DELETE", "PUT"]);
                switch ($_SERVER['REQUEST_METHOD']) {
                    case "GET":
                        $this->getVotes();
                        break;
                    case "POST":
                        $this->vote();
                        break;
                    case "DELETE":
                        $this->deleteVote();
                        break;

                }
        }
    }
    public function createPost(): void
    {
        $user = getUser();
        $requiredInputs = ["title", "content", "communityId"];
        validateRequiredJSONInput($requiredInputs);

        $title = getJSONInputValue("title");
        $content = getJSONInputValue("content");
        $communityId = getJSONInputValue("communityId");

        try {
            $query = "SELECT * FROM tblCommunity WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $communityId);
            $stmt->execute();
            $community = $stmt->fetch(PDO::FETCH_ASSOC);


            if ($community['visibility'] == "private") {
                $query = "SELECT * FROM tblCommunityMember WHERE userId = :userId AND communityId = :communityId";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":userId", $user->id);
                $stmt->bindParam(":communityId", $communityId);
                $stmt->execute();

                if (count($stmt->fetchAll(PDO::FETCH_ASSOC)) == 0)
                    sendResponse(false, "This community is private", 400);
            }

            $query = 'INSERT INTO tblPost (authorId, communityId, title, content) VALUES (:authorId, :communityId, :title, :content) RETURNING *';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':authorId', $user->id);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':communityId', $communityId);

            if ($stmt->execute()) {
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);
                $insertedRow['community'] = $community;
                $query = "SELECT * FROM tblUserProfile WHERE id = :authorId";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':authorId', $user->id);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $insertedRow['author'] = $result;
                unset($result['authorid']);
                $insertedRow['votes'] = array();
                sendResponse("success", "Post created successfully", 200, array("data" => array("post" => $insertedRow)));
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public function getPosts()
    {
        try {

            $query = "SELECT p.*, 
                json_build_object(
                    'id', u.id,
                    'username', up.username,
                    'firstName', up.firstname,
                    'lastName', up.lastname,
                    'gender', up.gender,
                    'birthdate', up.birthdate,
                    'createdat', up.createdAt,
                    'updatedat', up.updatedAt
                ) AS author,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'visibility', c.visibility,
                    'ownerid', c.ownerid,
                    'about', c.about,
                    'communityimage', c.communityimage,
                    'communitybanner', c.communitybanner,
                    'createdat', c.createdat,
                    'updatedat', c.updatedat
                ) AS community,

                (
                    SELECT json_agg(
                        json_build_object(
                            'id', v.id,
                            'userid', v.userid,
                            'vote', v.vote
                        )
                    )
                    FROM tblVote v
                    WHERE v.postid = p.id
                ) AS votes
            FROM tblPost p
            LEFT JOIN tblUserAccount u ON p.authorid = u.id
            LEFT JOIN tblUserProfile up ON p.authorid = up.id
            LEFT JOIN tblCommunity c ON p.communityid = c.id 
            ORDER BY p.createdAt DESC ";

            if (isset($_GET['page'])) {
                $page = $_GET["page"];
                $pageSize = 5;
                $offset = ($page - 1) * $pageSize;
                $query .= " LIMIT :pageSize OFFSET :offset";
            }

            $stmt = $this->conn->prepare($query);

            if (isset($_GET['page'])) {
                $stmt->bindParam(":pageSize", $pageSize);
                $stmt->bindParam(":offset", $offset);
            }

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($results as &$post) {
                $post['author'] = json_decode($post['author'], true);
                $post['community'] = json_decode($post['community'], true);

                if ($post['votes']) {
                    $post['votes'] = json_decode($post['votes'], true);
                } else {
                    $post['votes'] = array();
                }

                unset($post['authorid']);
                unset($post['communityid']);
            }
            sendResponse(true, "Successfully fetched posts", 200, array("data" => array("posts" => $results)));

        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function deletePost()
    {

        $user = getUser();

        validateRequiredJSONInput(['postId']);
        $postId = getJSONInputValue("postId");

        try {
            $query = "DELETE FROM tblPost WHERE id = :id AND authorid = :authorid";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":authorid", $user->id);
            $stmt->bindParam(":id", $postId);
            $stmt->execute();
            $rows = $stmt->rowCount();

            if ($rows > 0) {
                sendResponse(true, "Successfully deleted post", 200);
            } else {
                sendResponse(true, "Post not found", 200);
            }
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }


    public function updatePost()
    {

        $user = getUser();
        validateRequiredJSONInput(["postId"]);
        $postId = getJSONInputValue("postId");
        $title = getJSONInputValue("title");
        $content = getJSONInputValue("content");

        try {
            $query = "UPDATE tblPost SET ";
            $params = array();

            $setClauses = array();
            if ($title !== null) {
                $setClauses[] = "title = :title";
                $params[':title'] = $title;
            }

            if ($content !== null) {
                $setClauses[] = "content = :content";
                $params[':content'] = $content;
            }

            if (!empty($setClauses)) {
                $query .= implode(", ", $setClauses);
                $query .= " , updatedat = NOW() WHERE id = :id AND authorid = :authorid";
                $params[':id'] = $postId;
                $params[':authorid'] = $user->id;

                $stmt = $this->conn->prepare($query);
                $stmt->execute($params);

                if ($stmt->rowCount() > 0) {
                    sendResponse(true, "Post updated successfully", 200);
                } else {
                    sendResponse(false, "No changes were made to the post", 400);
                }
            } else {
                sendResponse(false, "No fields provided for update", 400);
            }
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }


    public function getVotes()
    {
        validateRequiredJSONInput(['postId']);
        $postId = getJSONInputValue("postId");

        try {
            $query = "SELECT id, vote FROM tblVote WHERE postid = :postid";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":postid", $postId);
            $stmt->execute();
            $votes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, "Successfully fetched votes", 200, array("data" => array("votes" => $votes)));
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function vote()
    {
        $user = getUser();
        $requiredInputs = ["postId", "vote"];
        validateRequiredJSONInput($requiredInputs);

        $postId = getJSONInputValue("postId");
        $vote = getJSONInputValue("vote");

        try {
            $query = "SELECT * FROM tblVote WHERE postId = :postId AND userId = :userId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":postId", $postId);
            $stmt->bindParam(":userId", $user->id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result == null) {
                $query = "INSERT INTO tblVote (postId, userId, vote) VALUES (:postId, :userId, :vote) RETURNING id, userid, vote";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":userId", $user->id);
                $stmt->bindParam(":vote", $vote);
                $stmt->execute();
                $vote = $stmt->fetch(PDO::FETCH_ASSOC);
                sendResponse(true, $vote == "upvote" ? "Upvoted post" : "Downvoted post", 200, array("data" => array("vote" => $vote)));
            } else {
                $query = "UPDATE tblVote SET vote = :vote WHERE postId = :postId AND userId = :userId RETURNING id, userid, vote";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":vote", $vote);
                $stmt->bindParam(":postId", $postId);
                $stmt->bindParam(":userId", $user->id);
                $stmt->execute();
                $vote = $stmt->fetch(PDO::FETCH_ASSOC);
                sendResponse(true, $vote == "upvote" ? "Upvoted post" : "Downvoted post", 200, array("data" => array("vote" => $vote)));
            }
        } catch (PDOException $e) {
            sendResponse("failed", $e->getMessage(), 500);
        }
    }

    public function deleteVote()
    {
        $user = getUser();
        validateRequiredJSONInput(["postId"]);
        $postId = getJSONInputValue("postId");
        try {
            $query = "DELETE FROM tblVote WHERE postid = :postid AND userid = :userid";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":postid", $postId);
            $stmt->bindParam(":userid", $user->id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                sendResponse(true, "Successfully deleted vote", 200);
            } else {
                sendResponse(false, "Vote not found", 404);
            }
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }
}
