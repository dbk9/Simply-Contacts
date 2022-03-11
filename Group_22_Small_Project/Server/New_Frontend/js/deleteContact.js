import { searchContacts } from "./searchContacts.js";

export class deleteContact
{
    urlBase = 'http://COP4331.xyz/LAMPAPI';
    extension = '.php';

    originalRow;
    row;
    newRow;
    userId = 0;
    clickConfirm=false;
    focus = false;

    that=this;

    constructor()
    {
        this.firstNameDelete = document.createElement("td");
        this.lastNameDelete = document.createElement("td");
        this.phoneNumberDelete = document.createElement("td");
        this.emailDelete = document.createElement("td");
    }

    changeRowDelete(button)
    {
        this.row = button.closest("tr");
        this.originalRow = this.row;

        this.newRow = document.createElement("tr");
        this.newRow.setAttribute("id", "deleteContactRow");

        // First Name
        this.firstNameDelete.setAttribute("id", "firstNameDelete");
        this.firstNameDelete.innerHTML = this.row.querySelector("#firstName").innerHTML;
        this.firstNameDelete.setAttribute("tabindex", "1");
        //
        
        // Last Name
        this.lastNameDelete.setAttribute("id", "lastNameDelete");
        this.lastNameDelete.innerHTML = this.row.querySelector("#lastName").innerHTML;
        this.lastNameDelete.setAttribute("tabindex", "2");
        //

        // Phone Number
        this.phoneNumberDelete.setAttribute("id", "phoneNumberDelete");
        this.phoneNumberDelete.innerHTML = this.row.querySelector("#phoneNumber").innerHTML;
        this.phoneNumberDelete.setAttribute("tabindex", "3");
        //

        // Email
        this.emailDelete.setAttribute("id", "emailDelete");
        this.emailDelete.innerHTML = this.row.querySelector("#email").innerHTML;
        this.emailDelete.setAttribute("tabindex", "4");
        //

        // Confirm Button
        let confirmButton = document.createElement("button");
        confirmButton.setAttribute("id", "confirmButton");
        confirmButton.setAttribute("class", "buttons green");
        confirmButton.innerHTML = "Confirm";
        confirmButton.setAttribute("tabindex", "5");

        confirmButton.addEventListener("mousedown", () => {
            this.that.doDeleteContact();
            this.that.clickConfirm = true;
        });

        confirmButton.addEventListener("keydown", (e) => {
            e.keyCode == 9 ? this.that.focus=true : this.that.focus=false;
        });
        confirmButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelDelete();
                document.querySelector("#addContactResult").innerHTML = "";
            }
            else
            {
                this.that.clickConfirm = false;
                this.that.focus = false;
            }
        });

        let td5 = document.createElement("td");
        td5.append(confirmButton)
        //

        // Cancel Button
        let cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancelButton");
        cancelButton.setAttribute("class", "buttons red");
        cancelButton.innerHTML = "Cancel";
        cancelButton.setAttribute("tabindex", "6");

        cancelButton.addEventListener("mousedown", () => {
            try{this.that.cancelDelete();}catch(err){}
            document.querySelector("#addContactResult").innerHTML = "";
        });
        cancelButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelDelete();
                document.querySelector("#addContactResult").innerHTML = "";
            }
            else
            {
                this.that.clickConfirm = false;
                this.that.focus = false;
            }
        });

        let td6 = document.createElement("td");
        td6.append(cancelButton)
        //

        // Append to the new row
        this.newRow.append(this.firstNameDelete);
        this.newRow.append(this.lastNameDelete);
        this.newRow.append(this.phoneNumberDelete);
        this.newRow.append(this.emailDelete);
        this.newRow.append(td5);
        this.newRow.append(td6);
        //

        this.row.replaceWith(this.newRow);

        this.firstNameDelete.focus();

        let list = [this.firstNameDelete, this.lastNameDelete, this.phoneNumberDelete, this.emailDelete];

        list.forEach(inputField => {

            inputField.addEventListener("input" , () => {
                document.querySelector("#addContactResult").innerHTML = "";
            });
            
            inputField.addEventListener("mousedown", () => {
                this.that.focus=true;
            });

            inputField.addEventListener("keydown", (e) => {
                e.keyCode == 9 ? this.that.focus=true : this.that.focus=false;
            });

            inputField.addEventListener("focusin", () => {
                this.that.clickConfirm = false;
                this.that.focus = false;
            });

            inputField.addEventListener("focusout", () => {
                
                if (this.that.clickConfirm == false && this.that.focus == false)
                {
                    this.that.cancelDelete();
                    document.querySelector("#addContactResult").innerHTML = "";
                }
                else
                {
                    this.that.clickConfirm = false;
                    this.that.focus = false;
                }                
            });
        });
    }

    doDeleteContact()
    {

        let jsonPayLoad = JSON.stringify
        (
            {
                id:this.originalRow.querySelector("#editContactButton").name
            }
        );

        let url = this.urlBase + "/deleteContact" + this.extension;
        let method = "POST";

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        let that = this.that;
        try
        {
            xhr.onreadystatechange = function()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    let jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.message != "Contact deleted") {console.log(jsonObject.message); return;}//! Failed to modify Alert
                    else
                    {
                        let sC = new searchContacts();
                        sC.searchContacts();
                        that.clickConfirm = true;
                    }
                }
            }

            xhr.send(jsonPayLoad);
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    cancelDelete()
    {
        let row = document.querySelector("#deleteContactRow");
        row.replaceWith(this.originalRow);
    }
}

