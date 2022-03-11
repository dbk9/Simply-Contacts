<?php
    $inData = getRequestInfo();

    $username = "";
    $password = "";
    $firstName = "";
    $lastName = "";

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", $connection->connect_error);
    } 
    else
    {
        $username = $inData["newUsername"];
        $password = $inData["newPassword"];
        $firstName = $inData["newFirstName"];
        $lastName = $inData["newLastName"];

        // Check if username already exists
        $count = checkIfUserExists($username, $connection);

        if ($count == 0) // User not found
        {
            // Insert user info into the database
            $stmt_prep = ("INSERT into Users (username, password, firstName, lastName) VALUES(?,?,?,?)");
            $statement = $connection->prepare($stmt_prep);
            $statement->bind_param("ssss", $username, $password, $firstName, $lastName);        
            $statement->execute();
            $statement->close();

            // Check if user was actually added
            $count = checkIfUserExists($username, $connection);

            if ($count == 0)
            {
                returnWithMessage("", "", "Failed to add user");
            }
            else
            {
                returnWithMessage($firstName, $lastName, "User added");
            }
        }
        else
        {
            returnWithMessage("", "", "Error: username already exists");
        }

        $connection->close();
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function checkIfUserExists($username, $connection)
    {
        $stmt_prep = ("SELECT * FROM Users WHERE username = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("s", $username);
        $statement->execute();
        $result = $statement->get_result();
        $count = count($result->fetch_all());
        $statement->close();

        return $count;
    }

    function returnWithMessage($firstName, $lastName, $message)
    {
        $retValue = '{"firstName":"' . $firstName . '",
            "lastName":"' . $lastName . '",
            "message":"' . $message . '"
        }';

        // We do not return the id since the user needs to log in after they register, and when they log in, the login api returns the id

        sendResultInfoAsJson($retValue);
    }
?>
