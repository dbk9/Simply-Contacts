
// On Load Populate table
import { searchContacts } from "./searchContacts.js";
document.addEventListener("DOMContentLoaded", () =>
{
    searchContacts();
});

// Search Functions
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function()
{
    searchContacts();
});

// Table function imports
import { updateContact, changeRow } from "./editContact.js"
import { changeRowAdd } from "./addContact.js"
import { changeRowDelete } from "./deleteContact.js";

// Check If Table Actions
const table = document.querySelector("#displayTable");
table.addEventListener("click", function(e)
{
    console.log(e.path[0]);
    if(e.target.matches("#editContactButton"))
    {
        changeRow(e.path[0]);
    }
    else if(e.target.matches("#addContactButton"))
    {
        changeRowAdd(e.path[0]);
    }
    else if (e.target.matches("#confirmButton"))
    {
        //searchContacts();
    }
    else if (e.target.matches("#deleteContactButton"))
    {
        changeRowDelete(e.path[0]);
    }
});

// Sign Out
import { doSignOut } from "./signOut.js";
document.querySelector("#signOut").addEventListener("click", doSignOut);

// Delete User Functions
import { doDeleteUser, readCookie, userId } from "./deleteUser.js";
document.querySelector('#unregisterButton').addEventListener('click', function deleteUser(){
    console.log("From master file, user Id is: " + userId);
    doDeleteUser(userId);
});

// Visibility Changes
import { goToUnregisterView, goToContactsPage } from "./visibilityManager.js";
document.querySelector("#unregisterButtonView").addEventListener("click", goToUnregisterView);
document.querySelector("#cancelUnregisterButton").addEventListener("click", goToContactsPage);