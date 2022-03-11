
export class signOut
{
    button;

    constructor()
    {
        this.button = document.querySelector("#signOutButton");
        this.button.addEventListener("click", () => {this.doSignOut();});
    }

    doSignOut()
    {
        document.cookie = "Login Cookie= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
    }
}