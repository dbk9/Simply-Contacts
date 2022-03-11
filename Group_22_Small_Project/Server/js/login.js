const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";

export function doLogin(usernameElement = "username", passwordElement="password")
{
    //* Values from html page
    let username = document.getElementById(usernameElement).value;
    let password = document.getElementById(passwordElement).value;
    //let hash = md5( password );
    //console.log(hash);

    //? Not sure what this line is?
    document.getElementById("loginResult").innerHTML = "";
    
    //* Variables for the http request to login with the login api
    let jsonPayLoad = JSON.stringify( {username:username, password:password} );
    //let jsonPayLoad = JSON.stringify( {username:username, password:hash} );

    let url = urlBase + "/login" + extension;
    let method = "POST";

    //* Opening the connection to the login api file with the login & password typed in
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if(userId < 1) {
                    document.getElementById("loginResult").innerHTML = "Username or Password are incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contactsPage.html";
            }
        };

        xhr.send(jsonPayLoad);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie()
{
    let minutes = 20;
    let date = new Date();

    date.setTime(date.getTime() + (minutes*60*1000)) //* counted in milliseconds

    document.cookie = "Login Cookie=" + "firstName=" + firstName + ", lastName=" + lastName + ", userId=" + userId + "; expires=" + date.toGMTString();
}