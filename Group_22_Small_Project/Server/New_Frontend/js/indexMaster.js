
// User Field Clearer
import { clearFields } from "./clearFields.js";
let clearer = new clearFields();

// Import for Login
import { doLoginClass } from "./login.js";
document.querySelector("#doLoginButton").addEventListener("click", function(){
    let login = new doLoginClass();
    login.doLogin();
});

// Import for Register
import { AddUserClass } from "./addUser.js";
document.querySelector("#doRegisterButton").addEventListener("click", function(){
    let register = new AddUserClass();
    register.doRegister();
})

// Import for Visibility changes
import { visibilityManager } from "./visibilityManager.js";
let vm = new visibilityManager();

document.querySelector("#goToRegisterButton").addEventListener("click", function(){
    console.log("goToRegister");
    clearer.clearLogin();
    vm.goToRegister();
});
document.querySelector("#goToLoginButton").addEventListener("click", function(){
    console.log("goToLogin");
    clearer.clearRegistration();
    vm.goToLogin();
});