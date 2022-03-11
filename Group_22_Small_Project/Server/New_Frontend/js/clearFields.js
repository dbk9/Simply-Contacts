
export class clearFields
{
    constructor()
    {
        console.log("Clear Fields Created");
    }

    clearLogin()
    {
        console.log("Cleared Login")

        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";

        document.querySelector("#loginResult").innerHTML = "";
    }

    clearRegistration()
    {
        console.log("Cleared Registration")

        document.querySelector("#newFirstName").value = "";
        document.querySelector("#newLastName").value = "";
        document.querySelector("#newUsername").value = "";
        document.querySelector("#newPassword").value = "";

        document.querySelector("#addResult").innerHTML = "";
    }
}