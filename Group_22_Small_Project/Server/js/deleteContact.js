import { searchContacts } from "./searchContacts.js";

const urlBase = 'http://COP4331.xyz/LAMPAPI';
const extension = '.php';

let originalRow;
let row;
let newRow;
let userId = 0;
let clickConfirm=false;

export function changeRowDelete(button)
{
    row = button.closest("tr");
    originalRow = row;

    console.log(button.name); userId=button.name;

    newRow = document.createElement("tr");
    newRow.setAttribute("id", "newNameRow");

    let td1 = document.createElement("td");
	td1.setAttribute("id", "name");
	td1.setAttribute("tabindex", "-1");
	td1.innerHTML = originalRow.querySelector("#name").innerHTML;

    let confirmButton = document.createElement("button");
    confirmButton.setAttribute("id", "confirmButton");
    confirmButton.setAttribute("class", "buttons");
    confirmButton.innerHTML = "Confirm";

    confirmButton.addEventListener("mousedown", function() {
		doDeleteContact();
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

	td1.focus()
	td1.addEventListener("focusout", () => {
        
        if (clickConfirm == false)
        {
            cancelDelete();
        }
        else
        {
            clickConfirm=false;
        }
    });
}

export function doDeleteContact()
{

    let jsonPayLoad = JSON.stringify
    (
        {
			id:originalRow.querySelector("#editContactButton").name
        }
    );

    let url = urlBase + "/deleteContact" + extension;
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

                if (jsonObject.message != "Contact deleted") {console.log(jsonObject.message); clickConfirm=true; return;}//! Failed to modify Alert
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

function cancelDelete()
{
    let row = document.getElementById("newNameRow");
    row.replaceWith(originalRow);
}