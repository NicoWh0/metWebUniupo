"use strict";
import Navbar from "./navbar/navbar.js";
import LoginModal from "./navbar/login_modal.js";

// App state management
const appState = {
    auth: {
        isLoggedIn: false,
        user: null
    }
};

// Navbar management
function updateNavbar() {
    const navbarContainer = document.querySelector('#navbar');
    const loginModalContainer = document.querySelector('#loginModal');

    if (!navbarContainer) return;

    const navbar = new Navbar(appState.auth.user);

    const loginModal = new LoginModal(appState.auth.user);

    const navContent = navbar.render();

    const loginModalContent = loginModal.render();

    navbarContainer.innerHTML = navContent;
    loginModalContainer.innerHTML = loginModalContent;
}

// Check authentication status on page load
async function checkAuthStatus() {
    try {
        console.log("Check Auth status called");
        const response = await fetch('/users/me', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();

        if(response.status === 404) {
            appState.auth = {
                isLoggedIn: false,
                user: null
            }
        } else {
            appState.auth = {
                isLoggedIn: true,
                user: data.user
            }
        }
        
        updateNavbar();
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

