"use strict";
import page from '//unpkg.com/page/page.mjs';
import { HomeView } from './views/home.js';
import Navbar from "./templates/navbar/navbar.js";
import LoginModal from "./templates/modals/login_modal.js";


// App state management
const appState = {
    auth: {
        isLoggedIn: false,
        user: null
    }
};

const fetchHeaders = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const homeView = new HomeView();

// Define routes
const renderHome = async () => {
    document.title = 'GroundArt - Home';
    await homeView.render();
};

page('/', '/home');
page('/home', renderHome);

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
        const response = await fetch('/users/me', fetchHeaders);
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

async function getCategories() {
    try {
        const response = await fetch('/categories', fetchHeaders);
        const data = await response.json();
        
        const categoryContainer = document.querySelector('#scrolling-menu');
        if (categoryContainer && data.categories) {
            // Convert the object into an array of categories
            const categoriesArray = Object.entries(data.categories).map(([name, details]) => ({
                name: name,
                id: details.id,
                iconPath: details.iconPath
            }));

            const categoryComponent = new Categories(categoriesArray);
            categoryContainer.innerHTML = categoryComponent.renderScrollMenu();
        }

    } catch(error) {
        console.error('Error getting categories:', error);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    getCategories();

    // Update navbar (your existing code)
    const navbarContainer = document.querySelector('#navbar');
    if (navbarContainer) {
        const navbar = new Navbar(appState.auth.user);
        navbarContainer.innerHTML = navbar.render();
    }

    // Start the router
    page();
});

