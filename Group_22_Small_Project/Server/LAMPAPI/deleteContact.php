<?php
    $inData = getRequestInfo();

    $id = $inData["id"];

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage($id, "", "", $connection->connect_error);
    } 
    else
    {
        // Check if contact exists before deleting
        $stmt_prep = ("SELECT firstName, lastName FROM Contacts WHERE id = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("i", $id);
        $statement->execute();
        $result = $statement->get_result();

        $arrayName = array();
        while($row = $result->fetch_assoc())
        {
            $arrayName[] = $row;
        }

        $count = count($arrayName);

        $firstName = $arrayName[0]['firstName'];
        $lastName = $arrayName[0]['lastName'];

        $statement->close();
        
        if ($count != 0)
        {
            // Delete contacts info from the database
            $stmt_prep = "DELETE FROM Contacts WHERE id=?";
            $statement = $connection->prepare($stmt_prep);
    
            $statement->bind_param("i", $id);        
            $statement->execute();
            
            $affectedContacts = $connection->affected_rows;
            
            if ($affectedContacts != 0)
            {
                returnWithMessage($id, $firstName, $lastName, "Contact deleted");
            }
            else
            {
                returnWithMessage($id, $firstName, $lastName, "Failed to delete contact");
            }
    
            $statement->close();
        }
        else
        {
            returnWithMessage("", "", "", "Error: contact doesn't exist");
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

    function returnWithMessage($id, $firstName, $lastName, $message)
    {
        $retValue = '{"id":"' . $id . '",
            "firstName":"' . $firstName . '",
            "lastName":"' . $lastName . '",
            "message":"' . $message . '"
        }';

        sendResultInfoAsJson( $retValue);
    }