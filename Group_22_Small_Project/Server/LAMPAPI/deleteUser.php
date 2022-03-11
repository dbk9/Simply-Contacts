<?php

    $inData = getRequestInfo();

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", "", "", $connection->connect_error);
    }
    else
    {
        // Check if user exists
        $stmt_prep = "SELECT username FROM Users WHERE id=?";
        $statement = $connection->prepare($stmt_prep);
        $types = "i";
        $param1 = $inData["id"];
        $statement->bind_param($types, $param1);
        $statement->execute();
        $result = $statement->get_result();

        if($row = $result->fetch_assoc()) // If user is found
        {
            // Store username and then close the statement
            $username = $row['username'];
            $statement->close();

            // Delete user
            $stmt_prep = "DELETE FROM Users WHERE id=?";
            $statement = $connection->prepare($stmt_prep);
            $types = "i";
            $param1 = $inData["id"];
            $statement->bind_param($types, $param1);
            $statement->execute(); // Returns success even if it doesn't delete anything so we need to use affected_rows
            $affectedUsers = $connection->affected_rows;

            if ($affectedUsers != 0) // Check if actually deleted
            {
                // Now let's close the previous statement and delete the contacts
                $statement->close();

                // Delete contacts
                $stmt_prep = "DELETE FROM Contacts WHERE userId=?";
                $statement = $connection->prepare($stmt_prep);

                $types = "i";
                $param1 = $inData["id"];
                
                $statement->bind_param($types, $param1);

                $result = $statement->execute();

                // In this case, affected_rows is not effective at determining if there is an error or not, since it's ok if 0 contacts are deleted
                // Therefore, we use the boolean result from execute()
                if ($result = 0)
                    returnWithMessage($param1, $username, "", "Successfully deleted user, failed to delete contacts");
                else
                {
                    $affectedContacts = $connection->affected_rows;
                    returnWithMessage($param1, $username, $affectedContacts, "Successfully deleted user and contacts");
                }

            }
            else // If delete command failed
            {
                returnWithMessage($param1, $username, "", "Failed to delete user and contacts");
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

    function returnWithMessage($param1, $username, $affectedRows, $result)
    {
        $retValue = '{"id":"' . $param1 . '",
            "username":"' . $username . '",
            "numDeletedContacts":"' . $affectedRows . '",
            "message":"' . $result . '"
        }';

        sendResultInfoAsJson($retValue);
    }
?>
