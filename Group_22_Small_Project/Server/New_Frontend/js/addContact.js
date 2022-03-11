import { cookie } from "./cookieManager.js";
import { searchContacts } from "./searchContacts.js";

export class addContact
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

    firstName;
    lastName;
    phoneNumber;
    email;

    constructor()
    {
        this.firstName = document.createElement("input");
        this.lastName = document.createElement("input");
        this.phoneNumber = document.createElement("input");
        this.email = document.createElement("input");
    }

    changeRowAdd(button)
    {
        this.row = button.closest("tr");
        this.originalRow = this.row;

        //console.log(button.name);
        this.userId=button.name;

        this.newRow = document.createElement("tr");
        this.newRow.setAttribute("id", "newContactRow");

        // First Name
        this.firstName.setAttribute("id", "newFirstNameInput");
        this.firstName.setAttribute("type","text");
        this.firstName.setAttribute("placeholder", "*First Name*");
        this.firstName.setAttribute("tabindex", "1");

        
        let td1 = document.createElement("td");
        td1.append(this.firstName);
        //

        // Last Name
        this.lastName.setAttribute("id", "newLastNameInput");
        this.lastName.setAttribute("type","text");
        this.lastName.setAttribute("placeholder", "*Last Name*");
        this.lastName.setAttribute("tabindex", "2");
        
        let td2 = document.createElement("td");
        td2.append(this.lastName);
        //

        // Phone Number
        this.phoneNumber.setAttribute("id", "newPhoneNumberInput");
        this.phoneNumber.setAttribute("type","text");
        this.phoneNumber.setAttribute("placeholder", "Phone Number");
        this.phoneNumber.setAttribute("tabindex", "3");

        let td3 = document.createElement("td");
        td3.append(this.phoneNumber);
        //

        // Email
        this.email.setAttribute("id", "newEmailInput");
        this.email.setAttribute("type","text");
        this.email.setAttribute("placeholder", "Email");
        this.email.setAttribute("tabindex", "4");


        let td4 = document.createElement("td");
        td4.append(this.email);
        //

        // Confirm Button
        let confirmButton = document.createElement("button");
        confirmButton.setAttribute("id", "confirmButton");
        confirmButton.setAttribute("class", "buttons green");
        confirmButton.setAttribute("tabindex", "5");
        confirmButton.innerHTML = "Confirm";

        confirmButton.addEventListener("mousedown", () => {
            this.that.doAddContact();
            this.that.clickConfirm = true;
        });

        confirmButton.addEventListener("keydown", (e) => {
            e.keyCode == 9 ? this.that.focus=true : this.that.focus=false;
        });
        confirmButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelAddContact();
                document.querySelector("#addContactResult").innerHTML = "";
            }
            else
            {
                this.that.clickConfirm = false;
                this.that.focus = false;
            }
        });

        let td5 = document.createElement("td");
        td5.append(confirmButton);
        //

        // Cancel Button
        let cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancelButton");
        cancelButton.setAttribute("class", "buttons red");
        cancelButton.setAttribute("tabindex", "6");
        cancelButton.innerHTML = "Cancel";

        cancelButton.addEventListener("mousedown", () => {
            try{this.that.cancelAddContact();}catch(err){}
            document.querySelector("#addContactResult").innerHTML = "";
        });
        cancelButton.addEventListener("focusout", () => {
            if (this.that.clickConfirm == false && this.that.focus == false)
            {
                this.that.cancelAddContact();
                document.querySelector("#addContactResult").innerHTML = "";
            }
            else
            {
                this.that.clickConfirm = false;
                this.that.focus = false;
            }
        });

        let td6 = document.createElement("td");
        td6.append(cancelButton);
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

        this.firstName.focus();
        this.firstName.select();

        let list = [this.firstName, this.lastName, this.phoneNumber, this.email];

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
                    this.that.cancelAddContact();
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

    doAddContact()
    {
        let blank = this.checkBlanks();

        if ( blank != "" ) {
            document.querySelector("#addContactResult").innerHTML = blank;
            return;
        }

        let Cookie = new cookie();
        Cookie.readCookie(this);

        let phoneNumber = this.getNumbers(this.phoneNumber.value);

        let jsonPayLoad = JSON.stringify
        (
            {
                userId: parseInt(this.userId),
                firstName:document.getElementById("newFirstNameInput").value,
                lastName:document.getElementById("newLastNameInput").value,
                phoneNumber:phoneNumber,
                email:document.getElementById("newEmailInput").value
            }
        );

        let url = this.urlBase + "/addContact" + this.extension;
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

                    if (jsonObject.message != "Contact added") {console.log(jsonObject.message); that.clickConfirm=true; return;}//! Failed to modify Alert
                    else
                    {
                        let sC = new searchContacts();
                        sC.searchContacts();
                        that.clickConfirm=true;
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

    cancelAddContact()
    {
        let row = document.querySelector("#newContactRow");
        row.replaceWith(this.originalRow);
    }

    checkBlanks()
    {
        let firstName="";
        let lastName="";
        
        if(this.firstName.value.toString().trim() == "")
        {
            firstName = "First Name";
        }

        if (this.lastName.value.toString().trim() == "")
        {
            lastName = "Last Name";
        }

        let ret = (firstName != "" && lastName != "") ? "Missing " + firstName + " & " + lastName : (firstName != "" || lastName != "") ? "Missing " + firstName + lastName : "";

        let invalidPN = "";
        let invalidE = "";

        if (this.phoneNumber.value.trim() != "")
        {
            let errorPN = this.getNumbers(this.phoneNumber.value);

            if ( (errorPN + "").length != 10 )
            {
                invalidPN = "Phone Number";
            }
        }

        if (this.email.value.trim() != "")
        {
            let that = this.that;


            if ( ! (/\S+@\S+\.\S+/).test(that.email.value) )
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