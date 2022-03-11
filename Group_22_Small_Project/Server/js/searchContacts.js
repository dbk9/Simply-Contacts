const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

// Search Bar
const searchInput = document.getElementById("searchInput");

let userId = 0;
let firstName = "";
let lastName = "";
let searchKey = "";
let noSearch = false;

let fullContactsList = [];
let contactsList = [];

// Returns a list of contacts
export function searchContacts(maxNumContacts=10, offset=0, fullList=0) {

    searchKey = document.getElementById("searchInput").value.toString();

    if (searchKey=="") {noSearch=true;}

    readCookie();

    //! Setting offset to a variable causes only 1 result to be returned
    let jsonPayLoad = JSON.stringify(
        {
            id:userId,
            string:searchKey,
            maxNumContacts:10,
            offset:offset,
            returnAllContacts:fullList
        });

    let url = urlBase + "/searchContacts" + extension;
    let method = "POST";

    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let txt = xhr.responseText;
                let jsonObject = JSON.parse(txt);

                let contactsList = jsonObject.contactsList;

                createContactTable(contactsList);

            }
        };

        xhr.send(jsonPayLoad);
    }
    catch(err)
    {
        console.log(err.message);
    }

}

function createContactTable(contactsList)
{    
    let newTable = document.createElement("tbody");
    newTable.setAttribute("id", "currentTableValues");

    let len = 0;

    contactsList.forEach(jsonObject => {        
        len = newTable.rows.length - 1;

        newTable.insertRow(len).outerHTML = addRow(jsonObject.name, 1, jsonObject.id, 0);
    });

    len = newTable.rows.length;

    if(len==0)
    {
        newTable.insertRow(len).outerHTML = addRow("No Matching Contacts", 2, 0, 0);
        len = newTable.rows.length;
    }

    newTable.insertRow(len).outerHTML = addRow("", 3, 0, 0);
    document.getElementById("currentTableValues").replaceWith(newTable);
}

function addRow(name, type, id, pages)
{
    if(type==1)
    {
        return "<tr><td id=\"name\">" + name + "</td><td><button name=\""+ id +"\" id=\"editContactButton\" class=\"buttons orange\">Edit</button></td><td><button id=\"deleteContactButton\" class=\"buttons red\">Delete</button></td></td></tr>"
    }
    else if (type==2)
    {
        return "<tr><td id=\"name\">" + name + "</td></tr>";
    }
    else if (type==3)
    {
        return "<tr><td><button name=\""+ userId +"\" id=\"addContactButton\" class=\"buttons green\">Add Contact</button></td></tr>"
    }
    else if (type == 4)
    {
        retStr="";

        return retStr;
    }
}

function readCookie()
{
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
}