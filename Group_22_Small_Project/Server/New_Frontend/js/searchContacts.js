
import { cookie } from "./cookieManager.js";

export class searchContacts
{
    urlBase = 'http://COP4331.xyz/LAMPAPI';
    extension = '.php';

    // Search Bar
    searchInput;

    userId = 0;
    firstName = "";
    lastName = "";
    searchKey = "";

    fullContactsList = [];
    contactsList;

    constructor()
    {
        // Init Var
        this.searchInput = document.getElementById("searchInput");

        // allows access to elements inside event listener
        let that = this;

        // Init active search bar
        this.searchInput.addEventListener("input", function () {
            //console.log("Searching " + that.searchInput.value.toString());
            that.searchContacts();
        });

        let Cookie = new cookie();
        Cookie.readCookie(this);

        this.searchContacts();
    }

    searchContacts(maxNumContacts=10, offset=0, fullList=0)
    {

        //! Setting offset to a variable causes only 1 result to be returned
        let that = this;
        let jsonPayLoad = JSON.stringify(
            {
                id:that.userId,
                string:that.searchInput.value.toString(),
                maxNumContacts:20,
                offset:offset,
                returnAllContacts:fullList
            });
        
        let url = this.urlBase + "/searchContacts" + this.extension;
        let method = "POST";

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
                    let txt = xhr.responseText;
                    let jsonObject = JSON.parse(txt);

                    that.contactsList = jsonObject.contactsList;

                    that.createContactTable();
                }
            };

            xhr.send(jsonPayLoad);
        }
        catch(err)
        {
            console.log(err.message);
        }

    }

    createContactTable()
    {    
        let newTable = document.createElement("tbody");
        newTable.setAttribute("id", "currentTableValues");

        let len = 0;

        this.contactsList.forEach(jsonObject => {        
            len = newTable.rows.length - 1;

            if (jsonObject.phoneNumber == 0)
            {
                jsonObject.phoneNumber = "";
            }
            else
            {
                let str = "" + jsonObject.phoneNumber;

                str = str.charAt(0) + str.charAt(1) + str.charAt(2) + "-" + str.charAt(3) + str.charAt(4) + str.charAt(5) + "-" + str.charAt(6) + str.charAt(7) + str.charAt(8) + str.charAt(9); 

                jsonObject.phoneNumber = str;
            }

            newTable.insertRow(len).outerHTML = this.addRow(jsonObject.firstName, jsonObject.lastName, jsonObject.phoneNumber, jsonObject.email, 1, jsonObject.id, 0);
        });
        
        len = newTable.rows.length;

        if(len==0)
        {
            newTable.insertRow(len).outerHTML = this.addRow("No Matching Contacts", "", "", "", 2, 0, 0);
            len = newTable.rows.length;
        }

        newTable.insertRow(len).outerHTML = this.addRow("", "", "", "", 3, 0, 0);
        len = newTable.rows.length;
        newTable.insertRow(len).outerHTML = this.addRow("", "", "", "", 4, 0, 0);

        document.getElementById("currentTableValues").replaceWith(newTable);
    }

    addRow(firstName, lastName, phoneNumber, email, type, id, pages)
    {
        if(type==1)
        {
            return "<tr id=\"contactRow\"><td id=\"firstName\">" + firstName + "</td><td id=\"lastName\">" + lastName + "</td><td id=\"phoneNumber\">" + phoneNumber + "</td><td id=\"email\">" + email + "</td><td><button name=\""+ id +"\" id=\"editContactButton\" class=\"buttons yellow\">Edit</button></td><td><button id=\"deleteContactButton\" class=\"buttons red\">Delete</button></td></td></tr>"
        }
        else if (type==2)
        {
            return "<tr id=\"noMatches\"><td id=\"name\">" + firstName + "</td></tr>";
        }
        else if (type==3)
        {
            return "<tr id=\"contactButtonRow\"><td><button name=\""+ this.userId +"\" id=\"addContactButton\" class=\"buttons green\">Add Contact</button></td></tr>"
        }
        else if (type == 4)
        {
            return "<tr id=\"addResultRow\"><td id=\"addContactResult\"></td></tr>";

            return retStr;
        }
    }
}