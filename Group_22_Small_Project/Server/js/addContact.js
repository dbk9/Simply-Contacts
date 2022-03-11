import { searchContacts } from "./searchContacts.js";

const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

let originalRow;
let row;
let newRow;
let userId = 0;
let clickConfirm=false;

export function changeRowAdd(button)
{
    row = button.closest("tr");
    originalRow = row;

    console.log(button.name); userId=button.name;

    newRow = document.createElement("tr");
    newRow.setAttribute("id", "newNameRow");

    let input = document.createElement("input");
    input.setAttribute("id", "newNameInput");
    input.setAttribute("type","text");
    input.setAttribute("placeholder", "New Contact Name");

    let td1 = document.createElement("td");
    td1.append(input);

    let confirmButton = document.createElement("button");
    confirmButton.setAttribute("id", "confirmButton");
    confirmButton.setAttribute("class", "buttons");
    confirmButton.innerHTML = "Confirm";

    confirmButton.addEventListener("mousedown", function() {
       addContact();
    });

    let td2 = document.createElement("td");
    td2.append(confirmButton)

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancelButton");
    cancelButton.setAttribute("class", "buttons");
    cancelButton.innerHTML = "Cancel";

    let td3 = document.createElement("td");
    td3.append(cancelButton)

    newRow.append(td1); newRow.append(td2); newRow.append(td3);

    row.replaceWith(newRow);

    input.focus();
    input.select();

    input.addEventListener("focusout", () => {
        
        if (clickConfirm == false)
        {
            cancelAddContact();
        }
        else
        {
            clickConfirm=false;
        }
    });
}

export function addContact()
{

    if(document.getElementById("newNameInput").value == "") {console.log("Blank"); return;}

    readCookie();

    let jsonPayLoad = JSON.stringify
    (
        {
            userId:userId,
            name:document.getElementById("newNameInput").value
        }
    );

    let url = urlBase + "/addContact" + extension;
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
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.message != "Contact added") {console.log(jsonObject.message); clickConfirm=true; return;}//! Failed to modify Alert
                else {searchContacts(); clickConfirm=true;}
            }
        }

        xhr.send(jsonPayLoad);
    }
    catch(err)
    {
        console.log(err.message);
    }
}

function cancelAddContact()
{
    let row = document.getElementById("newNameRow");
    row.replaceWith(originalRow);
}

function readCookie()
{
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
	
		if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
}