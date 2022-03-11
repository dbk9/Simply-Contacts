import { doLoginClass } from "./login.js";

export class AddUserClass
{


    urlBase = 'http://COP4331.xyz/LAMPAPI';
    extension = '.php';

    newFirstName = "";
    newLastName = "";
    newUsername = "";
    newPassword = "";

    constructor()
    {
        this.newFirstName = document.querySelector("#newFirstName").value;
        this.newLastName = document.querySelector("#newLastName").value;
        this.newUsername = document.querySelector("#newUsername").value;
        this.newPassword = md5( document.querySelector("#newPassword").value );
    }


    doRegister()
    {
        if (this.checkBlank() != true){return;}
        
        document.getElementById("addResult").innerHTML = "";

        let jsonPayLoad = JSON.stringify({
            newFirstName:this.newFirstName,
            newLastName:this.newLastName,
            newUsername:this.newUsername,
            newPassword:this.newPassword
        });

        let url = this.urlBase + "/addUser" + this.extension;
        let method = "POST";

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
            let that = this;
            xhr.onreadystatechange = function()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    //document.getElementById("addResult").innerHTML = "Added User";

                    let login = new doLoginClass("newUsername", "newPassword");
                    login.doLogin();
                }
            };

            xhr.send(jsonPayLoad);
        }
        catch(err)
        {
            document.getElementById("addResult").innerHTML = err.message
        }

    }

    returnWithError(msg)
    {
        document.getElementById("addResult").innerHTML = msg;
    }

    checkBlank()
    {
        let fn="";
        let ln="";
        let un="";
        let pw="";
        
        let errString="";

        if (this.newFirstName == "")
        {
            errString += "First Name:";
        }
        if (this.newLastName == "")
        {
            errString += "Last Name:";
        }
        if (this.newUsername == "")
        {
            errString += "Username:";
        }
        if (this.newPassword == "")
        {
            errString += "Password:";
        }

        let split = errString.split(":");

        console.log(split);

        if(split[0] == "")
        {
            return true;
        }
        else
        {
            errString = "Missing: ";

            for( let i = 0; i < split.length - 1; i++)
            {
                errString += split[i];

                if(split[i+1] != '' && split[i+1] != null){errString += ", ";}
            }

            return this.returnWithError(errString);
        }

    }
}