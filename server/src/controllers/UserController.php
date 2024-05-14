<?php

class UserController
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
                checkHTTPMethod(["GET"]);
                $this->getUsers();
                break;
            case "/register":
                checkHTTPMethod(["POST"]);
                $this->register();
                break;
            case "/login":
                $this->login();
                break;
            case "/communities":
                $this->getCommunities();
                break;
            case "/validate":
                $this->validateSession();
                break;
        }
    }

    public function getUsers()
    {
        $query = "
            SELECT u.*,
                ua.email AS email
            FROM tblUserProfile u
            LEFT JOIN tblUserAccount ua ON ua.id = u.id
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendResponse(true, "Successfully fetched users", 200, array("data" => array("users" => $result)));
    }

    public function register(): void
    {

        $requiredInputs = ["username", "password", "email", "firstName", "lastName", "gender", "birthDate"];
        validateRequiredFields($requiredInputs);

        $username = $_POST['username'];
        $password = $_POST['password'];
        $email = $_POST['email'];

        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $gender = $_POST['gender'];
        $birthDate = $_POST['birthDate'];

        try {
            $query = 'INSERT INTO tblUserAccount (password, email) VALUES (:password, :email) RETURNING * ';
            $stmt = $this->conn->prepare($query);
            $password = password_hash($password, PASSWORD_DEFAULT);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':email', $email);
            $insertedRow = null;

            try {
                $stmt->execute();
                $insertedRow = $stmt->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                if ($e->getCode() == 23505) {
                    sendResponse(false, "Email is already registered to an account", 409);
                }
                sendResponse(false, $e->getMessage(), 500);
            }
            $query = 'INSERT INTO tblUserProfile (id, username, firstName, lastName, gender, birthdate) VALUES (:id, :username, :firstName, :lastName, :gender, :birthdate)';

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $insertedRow['id']);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':firstName', $firstName);
            $stmt->bindParam(':lastName', $lastName);
            $stmt->bindParam(':gender', $gender);
            $stmt->bindParam(':birthdate', $birthDate);

            if ($stmt->execute())
                sendResponse(true, "Registered successfully", 200);
        } catch (PDOException $e) {
            $code = $e->getCode();
            if ($code == 23505) {
                sendResponse(false, $e->getMessage(), 409);
            }
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function login(): void
    {
        header('Access-Control-Allow-Methods: POST OPTIONS');
        $requiredInputs = ["email", "password"];
        validateRequiredJSONInput($requiredInputs);

        $email = getJSONInputValue("email");
        $password = getJSONInputValue("password");

        try {
            $query = "SELECT * FROM tblUserAccount WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                sendResponse("error", "Incorrect username or password", 400);
            }

            if (password_verify($password, $user['password'])) {
                unset($user['password']);
                $query = "SELECT * FROM tblUserProfile WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':id', $user['id']);
                $stmt->execute();
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
                $user['profile'] = $profile;

                session_set_cookie_params([
                    'lifetime' => 3600,
                ]);
                session_start();

                // $_SESSION['user'] = new User(
                //     $user['id'],
                //     $email,
                //     $profile['username'],
                //     $profile['firstname'],
                //     $profile['lastname'],
                //     $profile['birthdate'],
                //     $profile['createdat'],
                //     $profile['updatedat']
                // );

                $_SESSION['user'] = $user;

                sendResponse("success", "Logged in successfuly", 200, array("data" => array("sessionId" => session_id(), "user" => $user)));

            } else {
                sendResponse("error", "Incorrect username or password", 400);
            }
        } catch (PDOException $e) {
            sendResponse("error", $e->getMessage(), 500);
        }
    }

    public function getCommunities()
    {
        $user = getUser();
        try {
            // $query = "SELECT c.*
            //     FROM tblCommunity c
            //     LEFT JOIN tblCommunityMember cm ON cm.communityid = c.id AND cm.id = :userid; 
            // ";

            $query = "SELECT c.*
                FROM tblCommunity c
                LEFT JOIN tblCommunityMember cm ON cm.communityid = c.id
                WHERE cm.userid = :userid;
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":userid", $user['id']);
            $stmt->execute();
            $communities = $stmt->fetchAll(PDO::FETCH_ASSOC);

            sendResponse(true, "Successfully fetchd user communities", 200, array("data" => array("communities" => $communities)));

        } catch (PDOException $e) {
            sendResponse(false, $e->getMessage(), 500);
        }
    }

    public function validateSession()
    {
        $user = getUser();
        if ($user) {
            sendResponse(true, "Session ID is valid", 200, array("data" => array("user" => $user)));
        } else {
            sendResponse(false, "Session ID is not valid", 403);
        }
    }
}