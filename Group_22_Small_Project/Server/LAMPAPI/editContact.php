<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", "", "", $connection->connect_error);
    } 
    else
    {
        // Check if contact exists
        $stmt_prep = ("SELECT * FROM Contacts WHERE id = ? AND userId = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("ii", $id, $userId);
        $statement->execute();
        $result = $statement->get_result();
        $count = count($result->fetch_all());
        $statement->close();

        if ($count != 0) // If contact exists
        {  
            // Check if the user already has this name in their list
            $stmt_prep = ("SELECT * FROM Contacts WHERE userId = ? AND firstName = ? AND lastName = ? AND phoneNumber = ? AND email = ?");
            $statement = $connection->prepare($stmt_prep);
            $statement->bind_param("issis", $userId, $firstName, $lastName, $phoneNumber, $email);
            $statement->execute();
            $result = $statement->get_result();
            $count = count($result->fetch_all());
            $statement->close();

            if ($count == 0)
            {
                // Insert contacts info into the database
                $stmt_prep = "UPDATE Contacts SET firstName = ?, lastName = ?, phoneNumber = ?, email = ? WHERE id = ? AND userId = ?";
                $statement = $connection->prepare($stmt_prep);
        
                $statement->bind_param("ssisii", $firstName, $lastName, $phoneNumber, $email, $id, $userId);        
                $statement->execute();
                $affectedContacts = $connection->affected_rows;
                $statement->close();
        
                if ($affectedContacts == 0)
                {
                    returnWithMessage($id, $userId, $firstName, $lastName, "Failed to modify contact");
                }
                else
                {
                    returnWithMessage($id, $userId, $firstName, $lastName, "Contact modified");
                }
            }
            else
            {
                returnWithMessage($id, $userId, $firstName, $lastName, "No changes were made");
            }
            
        }
        else
        {
            returnWithMessage("", $userId, $firstName, $lastName, "Error: contact doesn't exist");
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

    function returnWithMessage($id, $userId, $firstName, $lastName, $message)
    {
        $retValue = '{"id":"' . $id . '",
            "userId":"' . $userId . '",
            "firstName":"' . $firstName . '",
            "lastName":"' . $lastName . '",
            "message":"' . $message . '"
        }';

        sendResultInfoAsJson($retValue);
    }
?>
