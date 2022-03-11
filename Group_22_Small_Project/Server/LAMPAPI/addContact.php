<?php
    $inData = getRequestInfo();

    //$name = $inData["name"];
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
   
    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", $connection->connect_error);
    } 
    else
    {
        // Check if userId exists in Users database - **NOT** THE CONTACTS DATABASE
        $stmt_prep = ("SELECT * FROM Users WHERE id = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("i", $userId);
        $statement->execute();
        $result = $statement->get_result();
        $count = count($result->fetch_all());
        $statement->close();

        if ($count != 0) // If userId exists
        {
            // Check if contact already exists
            $count = checkIfContactExists($firstName, $lastName, $userId, $phoneNumber, $email, $connection);
    
            if ($count == 0)
            {   
                // Insert contacts info into the database
                // INSERT INTO Contacts (firstName, lastName, userId, phoneNumber, email) VALUES ('test','test', 74, 321,'s@gmail.com');

                $stmt_prep = "INSERT INTO Contacts (firstName, lastName, userId, phoneNumber, email) VALUES(?,?,?,?,?)";
                $statement = $connection->prepare($stmt_prep);
        
                $statement->bind_param("ssiis", $firstName, $lastName, $userId, $phoneNumber, $email);        
                $statement->execute();
                $statement->close();
                
                // Check if contact was actually added to the database
                $count = checkIfContactExists($firstName, $lastName, $userId, $phoneNumber, $email, $connection);
        
                if ($count == 0)
                {
                    returnWithMessage($firstName, $lastName, $userId, "Failed to add contact");
                }
                else
                {
                    returnWithMessage($firstName, $lastName, $userId, "Contact added");
                }
            }
            else
            {
                returnWithMessage($firstName, $lastName, $userId, "Error: contact already exists");
            }
        }
        else
        {
            returnWithMessage($firstName, $lastName, $userId, "Error: no such user id");
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

    function checkIfContactExists($firstName, $lastName, $userId, $phoneNumber, $email, $connection)
    {
        $stmt_prep = ("SELECT * FROM Contacts WHERE userId = ? AND firstName = ? AND lastName = ? AND phoneNumber = ? AND email = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("issis", $userId, $firstName, $lastName, $phoneNumber, $email);
        $statement->execute();
        $result = $statement->get_result();
        $count = count($result->fetch_all());
        $statement->close();

        return $count;
    }

    function returnWithMessage($firstName, $lastName, $userId, $message)
    {
        $retValue = '{"firstName":"' . $firstName . '",
            "lastName":"' . $lastName . '",
            "userId":"' . $userId . '",
            "message":"' . $message . '"
        }';

        sendResultInfoAsJson($retValue);
    }
?>
