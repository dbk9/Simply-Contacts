<?php

    $inData = getRequestInfo();

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", "", $connection->connect_error);
    }
    else
    {
        $stmt_prep = "SELECT id,firstName,lastName FROM Users WHERE username=? AND BINARY password=?";
        $statement = $connection->prepare($stmt_prep);

        $types = "ss";
        $param1 = $inData["username"];
        $param2 = $inData["password"];

        $statement->bind_param($types, $param1, $param2);
        $statement->execute();
        $result = $statement->get_result();

        if ($row = $result->fetch_assoc())
        {
            $id = $row['id'];
            $firstName = $row['firstName'];
            $lastName = $row['lastName'];
            
            $statement->close();

            // Now that we are logged in, let's update the dateLastLoggedIn
            $stmt_prep = "UPDATE Users SET dateLastLoggedIn=NOW() where id=?";
            $statement = $connection->prepare($stmt_prep);

            $types = "i";
    
            $statement->bind_param($types, $id);
            $result = $statement->execute();
            
            if ($result = 0) // If last statement failed
            {
                returnWithMessage($id, $firstName, $lastName, "Successfully logged in, failed to update timestamp");
            }
            else
            {
                returnWithMessage($id, $firstName, $lastName, "Successfully logged in");
            }
        }
        else
        {
            returnWithMessage("", "", "", "No records found");
        }

        $statement->close();
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
        $retValue = '{
            "id": "' . $id . '",
            "firstName": "' . $firstName . '",
            "lastName": "' . $lastName . '",
            "message": "' . $message . '"
        }';

        sendResultInfoAsJson($retValue);
    }

?>
