
import { cookie } from "./cookieManager.js"
import { visibilityManager } from "./visibilityManager.js";

export class deleteUser
{
	urlBase = 'http://COP4331.xyz/LAMPAPI';
	extension = '.php';

	userId = 0;
	firstName = "";
	lastName = "";

	constructor()
	{
		let vm = new visibilityManager();
		let that = this;

		document.querySelector("#unregisterButtonView").addEventListener("click", function(){
			vm.goToUnregisterView();
		});

		document.querySelector("#cancelUnregisterButton").addEventListener("click", function(){
			vm.goToContactsPage();
		});

		document.querySelector("#unregisterButton").addEventListener("click", function(){
			that.doDeleteUser();
		});
	}

	doDeleteUser()
	{
		let Cookie = new cookie();
		Cookie.readCookie(this);

		console.log("User id is:" + this.userId);
		
		////* Variables for the http request to login with the login api
		let jsonPayLoad = JSON.stringify(
			{
				id : parseInt( this.userId )
			}
		);

		let url = this.urlBase + "/deleteUser" + this.extension;
		let method = "POST";

		//* Opening the connection to the api file 
		let xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try
		{
			xhr.send(jsonPayLoad);
			console.log("User deleted successfully");
			window.location.href = "index.html";
			return;

		}
		catch(err)
		{
			console.log("Error deleting.")
		}

		Cookie.deleteCookie();
	}
}