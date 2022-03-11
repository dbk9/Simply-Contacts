//Change Form Visibility
export function goToRegister()
{
    //Make Register Form Visible
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("registerDiv").style.display = "inline";
}

export function goToLogin()
{
    //Make Login Form Visible
    document.getElementById("loginDiv").style.display = "inline";
    document.getElementById("registerDiv").style.display = "none";
}

export function goToUnregisterView() 
{
    document.getElementById("mainContainer").style.display="none";
    document.getElementById("confirmUnregisterView").style.display="flex";
}

export function goToContactsPage() 
{
    document.getElementById("mainContainer").style.display="flex";
    document.getElementById("confirmUnregisterView").style.display="none";
}