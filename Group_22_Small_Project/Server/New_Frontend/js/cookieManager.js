
export class cookie
{
    firstName="";
    lastName="";
    userId="";

    constructor(firstName="", lastName="", userId="")
    {
        this.firstName=firstName;
        this.lastName=lastName;
        this.userId=userId;

        //console.log("Created Cookie Class Instance");
    }

    saveCookie()
    {
        let minutes = 20;
        let date = new Date();

        date.setTime(date.getTime() + (minutes*60*1000)) //* counted in milliseconds

        document.cookie = "Login Cookie=Login" + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", userId=" + this.userId + "; expires=" + date.toGMTString();
    }

    readCookie(that)
    {
        let data = document.cookie;
        let splits = data.split(",");
        for(var i = 0; i < splits.length; i++) 
        {
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");
            if( tokens[0] == "firstName" )
            {
                this.firstName = tokens[1];
                try{that.firstName = tokens[1];}catch(err){}
            }
            else if( tokens[0] == "lastName" )
            {
                this.lastName = tokens[1];
                try{that.lastName = tokens[1];}catch(err){}
            }
            else if( tokens[0] == "userId" )
            {
                this.userId = parseInt( tokens[1].trim() );
                try{that.userId = tokens[1];}catch(err){}
            }
        }
    }

    deleteCookie()
    {
        let date = new Date();
        date.setTime(date.getTime());

        document.cookie = "Login Cookie=Login; expires=" + date.toGMTString();
    }
}