
export class visibilityManager
{
    constructor(){}

    goToRegister()
    {
        document.querySelector("#loginDiv").style.display = "none";
        document.querySelector("#registerDiv").style.display = "inline";
    }

    goToLogin()
    {
        document.querySelector("#loginDiv").style.display = "inline";
        document.querySelector("#registerDiv").style.display = "none";
    }

    goToUnregisterView() 
    {
        document.getElementById("mainCenter").style.display="none";
        document.getElementById("confirmUnregisterView").style.display="inline";
    }

    goToContactsPage() 
    {
        document.getElementById("mainCenter").style.display="inline";
        document.getElementById("confirmUnregisterView").style.display="none";
    }
}