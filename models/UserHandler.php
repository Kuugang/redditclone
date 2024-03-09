<?php
//todo can make this static in user class
class UserHandler
{
    private $db;
    private $tblUserAccount = "tblUserAccount";
    private $tblUserProfile = "tblUserProfile";
    public function __construct($db)
    {
        $this->db = $db;
    }

    public function register()
    {
        if (
            !isset($_POST["username"]) || 
            !isset($_POST['password']) || 
            !isset($_POST['emailAddress'])||
            !isset($_POST['firstName'])||
            !isset($_POST['lastName'])||
            !isset($_POST['gender'])||
            !isset($_POST['birthDate'])
        ){
            sendResponse("error", "Please provide all inputs", 400);
        };

        $username = $_POST['username'];
        $password = $_POST['password'];
        $emailAddress= $_POST['emailAddress'];

        $firstName= $_POST['firstName'];
        $lastName= $_POST['lastName'];
        $gender= $_POST['gender'];
        $birthDate= $_POST['birthDate'];

        try {
            //id SERIAL PRIMARY KEY,
            //emailAddress VARCHAR(50),
            //username VARCHAR(255) NOT NULL,
            //password VARCHAR(255) NOT NULL,

            $query = 'INSERT INTO ' . $this->tblUserAccount. ' (emailAddress, username, password) VALUES (:emailAddress, :username, :password)';
            $stmt = $this->db->prepare($query);
            $password = htmlspecialchars(strip_tags(password_hash($password, PASSWORD_DEFAULT)));
            $stmt->bindParam(':emailAddress', $emailAddress);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);

            try{
                $stmt->execute();
            }catch(PDOException $e){
                if($e->getCode() == 23505){
                    sendResponse("failed", "Username already taken", 500);
                }
            }

            // id SERIAL PRIMARY KEY,
            // firstName VARCHAR(50),
            // lastName VARCHAR(50),
            // gender VARCHAR(50),
            // birthdate DATE,

            $query = 'INSERT INTO ' . $this->tblUserProfile. ' (firstName, lastName, gender, birthdate) VALUES (:firstName, :lastName, :gender, :birthdate)';
            $stmt = $this->db->prepare($query);

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

    public function login()
    {

        if (!isset($_POST["username"]) || !isset($_POST['password']))
            sendResponse("error", "Please provide all inputs", 400);

        $username = $_POST['username'];
        $password = $_POST['password'];

        try {
            $query = "SELECT * FROM " . $this->tblUserAccount. " WHERE username = :username";
            $stmt = $this->db->prepare($query);
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
}

?>