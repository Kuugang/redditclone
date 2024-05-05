<?php

class CommunityController
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
                        $this->createCommunity();
                        break;
                    case "GET":
                        $this->getCommunities();
                        break;
                    case "DELETE";
                        $this->deleteCommunity();
                        break;
                }
                break;
            // NOT CONVENTION
            // SHOULD USE PUT REQUEST, SADLY PUT REQUEST CAN'T PROCESS FORM DATA SO IT'S HECTIC TO HANDLE IMAGE UPLOAD
            case "/update":
                $this->updateCommunity();
                break;

        }
    }
    public function createCommunity(): void
    {
        $user = getUser();
        $requiredInputs = ['name', 'visibility'];
        validateRequiredFields($requiredInputs);

        $name = $_POST['name'];
        $visibility = $_POST['visibility'];

        $about = isset($_POST['about']) ? $_POST['about'] : null;

        $communityImageURL = isset($_FILES['communityImage']['tmp_name']) ? uploadImage("communityImage", "community-image") : null;
        $communityBannerURL = isset($_FILES['communityBanner']['tmp_name']) ? uploadImage("communityBanner", "community-banner") : null;

        try {
            $query = "INSERT INTO tblCommunity (name, visibility, ownerId, about, communityImage, communityBanner) VALUES (:name, :visibility, :ownerId, :about, :communityImageURL, :communityBannerURL) RETURNING *";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":visibility", $visibility);
            $stmt->bindParam(":ownerId", $user['id']);
            $stmt->bindParam(":about", $about);
            $stmt->bindParam(":communityImageURL", $communityImageURL);
            $stmt->bindParam(":communityBannerURL", $communityBannerURL);

            if ($stmt->execute()) {
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);
                $query = 'INSERT INTO tblCommunityMember(userId, communityId, privilege) VALUES (:userId, :communityId, :privilege)';
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":userId", $user['id']);
                $stmt->bindParam(":communityId", $insertedRow['id']);
                $privilege = "administrator";
                $stmt->bindParam(":privilege", $privilege);
                $stmt->execute();
                sendResponse(true, "Created community successfully", 200, array('data' => array('community' => $insertedRow)));
            } else {
                sendResponse(false, "Failed to create community", 200);
            }
        } catch (PDOException $e) {
            $code = $e->getCode();
            if ($code == 23505)
                sendResponse(false, "Community already exists", 500);
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function getCommunities()
    {
        try {
            $query = "SELECT * FROM tblCommunity";
            if (isset($_GET['name'])) {
                $query .= " WHERE name = :name";
            }
            $stmt = $this->conn->prepare($query);
            if (isset($_GET['name'])) {
                $stmt->bindParam(":name", $_GET['name']);
            }
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            sendResponse(true, "Successfully fetched communities", 200, array("data" => array("communities" => $result)));
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function deleteCommunity()
    {
        $user = getUser();

        $requiredInputs = ['communityId'];
        validateRequiredFields($requiredInputs);

        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        $communityId = $data['communityId'];

        try {
            $query = "DELETE FROM tblCommunity WHERE id = :id AND ownerid = :ownerid;";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $communityId);
            $stmt->bindParam(":ownerid", $user['id']);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                sendResponse(true, "Successfully deleted community", 200);
            } else {
                sendResponse(false, "Community not found/ You don't have the privilege to do this action", 400);
            }
        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function updateCommunity()
    {
        $user = getUser();

        $communityId = $_POST['communityId'];
        $name = $_POST['name'];
        $visibility = $_POST['visibility'];
        $about = $_POST['about'];

        $communityImageURL = isset($_FILES['communityImage']['tmp_name']) ? uploadImage("communityImage", "community-image") : null;
        $communityBannerURL = isset($_FILES['communityBanner']['tmp_name']) ? uploadImage("communityBanner", "community-banner") : null;

        $query = "UPDATE tblCommunity SET ";
        $params = array();

        $setClauses = array();
        if ($name !== null) {
            $setClauses[] = "name = :name";
            $params[':name'] = $name;
        }

        if ($visibility !== null) {
            $setClauses[] = "visibility = :visibility";
            $params[':visibility'] = $visibility;
        }

        if ($about !== null) {
            $setClauses[] = "about = :about";
            $params[':about'] = $about;
        }

        if ($communityImageURL !== null) {
            $setClauses[] = "communityImage = :communityImage";
            $params[':communityImage'] = $communityImageURL;
        }

        if ($communityBannerURL !== null) {
            $setClauses[] = "communityBanner = :communityBanner";
            $params[':communityBanner'] = $communityBannerURL;
        }

        if (!empty($setClauses)) {
            $query .= implode(", ", $setClauses);
            $query .= " , updatedat = NOW() WHERE id = :communityId AND ownerid = :ownerid";
            $params[':communityId'] = $communityId;
            $params[':ownerid'] = $user['id'];

            try {
                $stmt = $this->conn->prepare($query);
                $stmt->execute($params);

                if ($stmt->rowCount() > 0) {
                    sendResponse(true, "Community updated successfully", 200);
                } else {
                    sendResponse(false, "No changes were made to the community", 400);
                }
            } catch (PDOException $e) {
                sendResponse(false, $e->getMessage(), 500);
            }
        } else {
            sendResponse(false, "No fields provided for update", 400);
        }
    }
}