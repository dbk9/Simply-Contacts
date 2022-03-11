import { addContact } from "./addContact.js";
import { cookie } from "./cookieManager.js";
import { deleteContact } from "./deleteContact.js";
import { deleteUser } from "./deleteUser.js";
import { editContact } from "./editContact.js";
import { searchContacts } from "./searchContacts.js";
import { signOut } from "./signOut.js";

// Load Welcome Message with first and last name on load
window.addEventListener("load", () =>
{
    let Cookie = new cookie();
    Cookie.readCookie();
    document.querySelector("#welcomeMessage").innerHTML = "Welcome " + Cookie.firstName + " " + Cookie.lastName + "!";
});

//search Contacts
let search = new searchContacts();

// Unregister
let unregister = new deleteUser();

// SignOut
let signOutListener = new signOut();

// Check If Table Actions
const table = document.querySelector("#displayTable");
table.addEventListener("focusin", function(e)
{
    //console.log(e.target);
    if(e.target.matches("#editContactButton"))
    {
        let editContactRow = new editContact();
        editContactRow.changeRow(e.target);
    }
    else if(e.target.matches("#addContactButton"))
    {
        let addNewContact = new addContact();
        addNewContact.changeRowAdd(e.target);
    }
    else if (e.target.matches("#deleteContactButton"))
    {
        let delContact = new deleteContact();
        delContact.changeRowDelete(e.target);
    }
});