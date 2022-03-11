import { cookie } from "./cookieManager.js";


export class doLoginClass {

    urlBase = 'http://COP4331.xyz/LAMPAPI';
    extension = '.php';

    userId = 0;
    firstName = "";
    lastName = "";

    username="";
    password="";

    constructor(usernameElement="username", passwordElement="password")
    {
        this.username = document.getElementById(usernameElement).value;
        this.password = md5( document.getElementById(passwordElement).value );
        this.userId = 0;
    }

    doLogin(usernameElement = "username", passwordElement="password")
    {
        let hash = md5( password );
        console.log(hash);

        if ( this.checkBlank() != true){return;}
        
        //* Variables for the http request to login with the login api
        let jsonPayLoad = JSON.stringify(
            {
                username:this.username,
                password:this.password
            });

        let url = this.urlBase + "/login" + this.extension;
        let method = "POST";

        //* Opening the connection to the login api file with the login & password typed in
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
            let that = this;
            xhr.onreadystatechange = function()
            {
                if(this.readyState == 4 && this.status == 200)
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    that.userId = jsonObject.id;

                    if(that.userId < 1)
                    {
                        document.getElementById("loginResult").innerHTML = "Username or Password are incorrect";
                        return;
                    }
                    else
                    {
                        //document.getElementById("loginResult").innerHTML = "Login Successful!";
                    }

                    that.firstName = jsonObject.firstName;
                    that.lastName = jsonObject.lastName;

                    let Cookie = new cookie(that.firstName, that.lastName, that.userId);
                    Cookie.saveCookie();

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

    returnWithError(msg)
    {
        document.getElementById("loginResult").innerHTML = msg;
        return false;
    }

    checkBlank()
    {
        let username="";
        let password="";
        
        if (this.username == "")
        {
            username="Username ";
        }
        if (this.password == "")
        {
            password="Password ";
        }

        return (username != "" && password != "") ? this.returnWithError("Missing " + username + "& " + password) : (username != "" || password != "") ? this.returnWithError("Missing " + username + password) : true;
    }
}