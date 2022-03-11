<?php

    $inData = getRequestInfo();

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", "\"\"", $connection->connect_error);
    }
    else
    {
        $param1 = $inData["id"];
        
        // Check if invalid user ID
        $stmt_prep = ("SELECT * FROM Users WHERE id = ?");
        $statement = $connection->prepare($stmt_prep);
        $statement->bind_param("i", $param1);
        $statement->execute();
        $result = $statement->get_result();
        $count = count($result->fetch_all());
        $statement->close();

        if ($count != 0) // If user exists
        {
            $param2 = '%' . $inData["string"] . '%';
        
            // If returnAllContacts == 1, we will return all contacts (this can be slow; generally not a good idea)
            if ($inData["returnAllContacts"] == 1)
            {
                $stmt_prep = "SELECT * FROM Contacts WHERE userId=? AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phoneNumber LIKE ?)";   
                $statement = $connection->prepare($stmt_prep);
                $types = "issss";
                $statement->bind_param($types, $param1, $param2, $param2, $param2, $param2); 
            }
            else
            {
                $stmt_prep = "SELECT * FROM Contacts WHERE userId=? AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phoneNumber LIKE ?) LIMIT ? OFFSET ?";
                $statement = $connection->prepare($stmt_prep);
                $types = "issssii";
                $param3 = $inData["maxNumContacts"];
                $param4 = $inData["offset"];
                $statement->bind_param($types, $param1, $param2, $param2, $param2, $param2, $param3, $param4);
            }
    
            $statement->execute();
            $result = $statement->get_result();
    
            $arrayContacts = array();
            while($row = $result->fetch_assoc())
            {
                $arrayContacts[] = $row;
            }
    
            $count = count($arrayContacts);
    
            $jsonFormatted = json_encode($arrayContacts);
            
            if ($inData["returnAllContacts"] == 1)
            {
                returnWithMessage($param1, $count, $jsonFormatted, "maxNumContacts overridden since returnAllContacts = 1");
            }
            else
            {
                returnWithMessage($param1, $count, $jsonFormatted, "Success");
            }

    
            $statement->close();
        }
        else
        {
            returnWithMessage("", "", "\"\"", "Error: user doesn't exist");
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

    function returnWithMessage($param1, $numContacts, $contactsList, $message)
    {
        $retValue = '{"id":"' . $param1 . '",
            "numContacts":"' . $numContacts . '",
            "contactsList":' . $contactsList . ',
            "message":"' . $message . '"
        }';

        sendResultInfoAsJson($retValue);
    }
?>
