const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

export let userId = 0;
let firstName = "";
let lastName = "";

window.onload = function(){
    readCookie();
}


export function doDeleteUser(userId)
{
    console.log("User id is:" + userId);
    
    ////* Variables for the http request to login with the login api
    let jsonPayLoad = JSON.stringify( {id : userId} );
    let url = urlBase + "/deleteUser" + extension;
    let method = "POST";

    //* Opening the connection to the api file 
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayLoad);
		console.log("User deleted successfully");
        window.location.href = "index.html";
        return;

    }
    catch(err)
    {
        console.log("Error deleting.")
    }
}

export function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	//else
	//{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	//}
}
