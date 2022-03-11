import { doLogin } from './login.js';

import { doRegister } from "./addUser.js";

import { goToRegister, goToLogin } from "./visibilityManager.js";

// Waiting for The Click action to call the embedded function Login
document.querySelector('#doLoginButton').addEventListener('click', function login(){
    doLogin();
});

// Waiting for The Click action to call the embedded function Register
document.querySelector('#doRegisterButton').addEventListener('click', function register(){
    doRegister();
    doLogin("newUsername", "newPassword");
});

// Waiting for The Click action to call the imported function goToRegister
document.querySelector('#goToRegister').addEventListener('click', goToRegister);

// Waiting for The Click action to call the imported function goToLogin
document.querySelector('#goToLogin').addEventListener('click', goToLogin);