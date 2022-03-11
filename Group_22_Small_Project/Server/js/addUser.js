const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

let newFirstName = "";
let newLastName = "";
let newUsername = "";
let newPassword = "";

//import { md5 } from "./md5.js";

export function doRegister()
{
    // Define Variables from HTML
    newFirstName = document.getElementById("newFirstName").value;
    newLastName = document.getElementById("newLastName").value;
    newUsername = document.getElementById("newUsername").value;
    newPassword = document.getElementById("newPassword").value;

    //let hashPassword = md5( newPassword );
    //console.log(hashPassword);

    checkBlank(newFirstName, newLastName, newUsername, newPassword);
    
    document.getElementById("addResult").innerHTML = "";

    let jsonPayLoad = JSON.stringify({
        newFirstName:newFirstName,
        newLastName:newLastName,
        newUsername:newUsername,
        newPassword:newPassword
    });

    let url = urlBase + "/addUser" + extension;
    let method = "POST";

    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("addResult").innerHTML = "Added User";

                //window.location.href = "index.html";
            }
        };

        xhr.send(jsonPayLoad);
    }
    catch(err)
    {
        document.getElementById("addResult").innerHTML = err.message
    }

}

function returnWithError($msg)
{
    console.log($msg);
}

function checkBlank(newFirstName, newLastName, newUsername, newPassword)
{
    if (newFirstName == "")
    {
        returnWithError("Missing First Name");
    }
    else if (newLastName == "")
    {
        returnWithError("Missing Last Name");
    }
    else if (newUsername == "")
    {
        returnWithError("Missing Username");
    }
    else if (newPassword == "")
    {
        returnWithError("Missing Password");
    }
}