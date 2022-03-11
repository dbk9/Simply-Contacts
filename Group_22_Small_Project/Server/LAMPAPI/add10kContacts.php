<?php
    $inData = getRequestInfo();

    $userId = $inData["userId"];

    $connection = new mysqli(hostname:"localhost", username:"TheBeast", password:"WeLoveCOP4331", database:"COP4331"); 	

    if ($connection->connect_error)
    {
        returnWithMessage("", "", $connection->connect_error);
    } 
    else
    {
        for ($i = 0; $i < 10000; $i++)
        {
            // Insert contacts info into the database
            $stmt_prep = "INSERT into Contacts (name, userId) VALUES(NOW(),?)";
            $statement = $connection->prepare($stmt_prep);
    
            $statement->bind_param("i", $userId);        
            $statement->execute();
        }

        $statement->close();
        
        returnWithMessage($userId, "Added 10,000 contacts");

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

    function returnWithMessage($userId, $message)
    {
        $retValue = '{"userId":"' . $userId . '",
            "message":"' . $message . '"
        }';

        sendResultInfoAsJson($retValue);
    }
?>
