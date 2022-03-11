import { cookie } from "./cookieManager.js";
import { searchContacts } from "./searchContacts.js";

export class editContact
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
        this.firstNameEdit = document.createElement("input");
        this.lastNameEdit = document.createElement("input");
        this.phoneNumberEdit = document.createElement("input");
        this.emailEdit = document.createElement("input");
    }

    changeRow(button)
    {
        this.row = button.closest("tr");
        this.originalRow = this.row;

        ///console.log(this.row.querySelector("#name").innerHTML);

        this.newRow = document.createElement("tr");
        this.newRow.setAttribute("id", "editContactRow");

        // First Name
        this.firstNameEdit.setAttribute("id", "newFirstNameEdit");
        this.firstNameEdit.setAttribute("type","text");
        this.firstNameEdit.setAttribute("placeholder", "*First Name*");
        this.firstNameEdit.setAttribute("tabindex", "1");
        this.firstNameEdit.value = this.row.querySelector("#firstName").innerHTML;


        let td1 = document.createElement("td");
        td1.append(this.firstNameEdit);
        //
        
        // Last Name
        this.lastNameEdit.setAttribute("id", "newLastNameEdit");
        this.lastNameEdit.setAttribute("type","text");
        this.lastNameEdit.setAttribute("placeholder", "*Last Name*");
        this.lastNameEdit.setAttribute("tabindex", "2");
        this.lastNameEdit.value = this.row.querySelector("#lastName").innerHTML;

        let td2 = document.createElement("td");
        td2.append(this.lastNameEdit);
        //

        // Phone Number
        this.phoneNumberEdit.setAttribute("id", "newPhoneNumberEdit");
        this.phoneNumberEdit.setAttribute("type","text");
        this.phoneNumberEdit.setAttribute("placeholder", "Phone Number");
        this.phoneNumberEdit.setAttribute("tabindex", "3");
        this.phoneNumberEdit.value = this.row.querySelector("#phoneNumber").innerHTML;

        let td3 = document.createElement("td");
        td3.append(this.phoneNumberEdit);
        //

        // Email
        this.emailEdit.setAttribute("id", "newEmailEdit");
        this.emailEdit.setAttribute("type","text");
        this.emailEdit.setAttribute("placeholder", "Email Address");
        this.emailEdit.setAttribute("tabindex", "4");
        this.emailEdit.value = this.row.querySelector("#email").innerHTML;

        let td4 = document.createElement("td");
        td4.append(this.emailEdit);
        //

        // Confirm Button
        let confirmButton = document.createElement("button");
        confirmButton.setAttribute("id", "confirmButton");
        confirmButton.setAttribute("class", "buttons green");
        confirmButton.innerHTML = "Confirm";
        confirmButton.setAttribute("tabindex", "5");

        confirmButton.addEventListener("mousedown", () => {
            this.that.updateContact();
            this.that.clickConfirm = true;
        });

        confirmButton.addEventListener("keydown", (e) => {
            e.keyCode == 9 ? this.that.focus=true : this.that.focus=false;
        });
        confirmButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelUpdate();
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
            try{this.that.cancelUpdate();}catch(err){}
            document.querySelector("#addContactResult").innerHTML = "";
        });
        cancelButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelUpdate();
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
        this.newRow.append(td1);
        this.newRow.append(td2);
        this.newRow.append(td3);
        this.newRow.append(td4);
        this.newRow.append(td5);
        this.newRow.append(td6);
        //

        this.row.replaceWith(this.newRow);

        this.firstNameEdit.focus();
        this.firstNameEdit.select();

        let list = [this.firstNameEdit, this.lastNameEdit, this.phoneNumberEdit, this.emailEdit];

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
                    this.that.cancelUpdate();
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

    updateContact()
    {
        let blank = this.checkBlanks();

        if ( blank != "" ) {
            document.querySelector("#addContactResult").innerHTML = blank;
            return;
        }

        let Cookie = new cookie();
        Cookie.readCookie(this);


        let newFN = this.firstNameEdit.value != "" ? this.firstNameEdit.value.trim() : this.originalRow.querySelector("#firstName").innerHTML;

        let newLN = this.lastNameEdit.value != "" ? this.lastNameEdit.value.trim() : this.originalRow.querySelector("#lastName").innerHTML;
        
        let newPN = this.phoneNumberEdit.value != "" ? this.getNumbers(this.phoneNumberEdit.value) : this.getNumbers( this.originalRow.querySelector("#phoneNumber").innerHTML );

        let newE = this.emailEdit.value != "" ? this.emailEdit.value.trim() : this.originalRow.querySelector("#email").innerHTML;

        let jsonPayLoad = JSON.stringify
        (
            {
                id: parseInt( this.originalRow.querySelector("#editContactButton").name),
                userId: parseInt( this.userId ),
                firstName:newFN,
                lastName:newLN,
                phoneNumber:newPN,
                email:newE                
            }
        );

        let url = this.urlBase + "/editContact" + this.extension;
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

                    if (jsonObject.message != "Contact modified") {return;}//! Failed to modify Alert
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

    cancelUpdate()
    {
        let row = document.querySelector("#editContactRow");
        row.replaceWith(this.originalRow);
    }

    checkBlanks()
    {
        let firstName="";
        let lastName="";
        
        if(this.firstNameEdit.value == "")
        {
            if (this.firstNameEdit.value.toString().trim() == "")
            {
                firstName = "First Name";
            }
        }

        if(this.lastNameEdit.value == "")
        {
            if (this.lastNameEdit.value.toString().trim() == "")
            {
                lastName = "Last Name";
            }
        }

        let ret = (firstName != "" && lastName != "") ? "Missing " + firstName + " & " + lastName : (firstName != "" || lastName != "") ? "Missing " + firstName + lastName : "";

        let invalidPN = "";
        let invalidE = "";

        if (this.phoneNumberEdit.value.trim() != "")
        {
            let errorPN = this.getNumbers(this.phoneNumberEdit.value);

            if ( (errorPN + "").length != 10 )
            {
                invalidPN = "Phone Number";
            }
        }

        if (this.emailEdit.value.trim() != "")
        {
            let that = this.that;


            if ( ! (/\S+@\S+\.\S+/).test(that.emailEdit.value) )
            {
                invalidE = "Email Address"
            }
        }

        let ret2 = (invalidPN != "" && invalidE != "") ? "Invalid " + invalidPN + " & " + invalidE : (invalidPN != "" || invalidE != "") ? "Invalid " + invalidPN + invalidE : "";

        return (ret != "" && ret2 != "") ? ret + " & " + ret2 : (ret != "" || ret2 != "") ? ret + ret2 : "";
    }

    getNumbers(str)
    {
        let number;

        try {
            let matches = (str).match(/\d+/g);

            let numberStr = "";

            matches.forEach(str => {
                numberStr += str;
            });

            number = parseInt(numberStr);
        }
        catch(err)
        {
            console.log(err.message);

            return 0;
        }

        return number;
    }

}