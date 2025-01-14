"use strict";
import page from '//unpkg.com/page/page.mjs';
import { HomeView } from './views/home.js';
import Navbar from './templates/navbar/navbar.js';
import API from './api.js';
import LoginModal from './templates/modals/login_modal.js';
import RegisterModal from './templates/modals/register_modal.js';
import UploadModal from './templates/modals/upload_modal.js';
import LoadingScreen from './templates/others/loading_screen.js';

// App state management
const appState = {
    auth: {
        isLoggedIn: false,
        user: null
    },
    categories: [],
    mainCategories: []
};

// Event bus for auth state changes
const authEvents = new EventTarget();

LoadingScreen.show();

// Initialize views
const homeView = new HomeView();

// Route handlers
const renderHome = async () => {
    document.title = 'GroundArt - Home';
    await homeView.render();
};

// Define routes
page('/', '/home');
page('/home', renderHome);

// Update auth state and notify components
async function updateAuthState() {
    const user = await API.getCurrentUser();
    appState.auth = {
        isLoggedIn: user !== null,
        user: user ?? null
    };
    // Dispatch auth state change event
    authEvents.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: appState.auth 
    }));
    updateNavbar();
    updateModals();
}

// Update navbar based on auth state
function updateNavbar() {
    const navbarContainer = document.querySelector('#navbar');
    if (navbarContainer) {
        const navbar = new Navbar(appState.auth.user);
        navbarContainer.innerHTML = navbar.render();
        navbar.attachEventListeners();
    }
}

function updateModals() {
    const modalsContainer = document.querySelector('#modals');
    if(modalsContainer) {
        if(!appState.auth.isLoggedIn) {
            const loginModal = new LoginModal();
            modalsContainer.insertAdjacentHTML('beforeend', loginModal.render());
            loginModal.attachEventListeners();
            const registerModal = new RegisterModal();
            modalsContainer.insertAdjacentHTML('beforeend', registerModal.render());
            registerModal.attachEventListeners();
        }
        else {
            const uploadModal = new UploadModal();
            modalsContainer.insertAdjacentHTML('beforeend', uploadModal.render());
            uploadModal.attachEventListeners();  
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load categories (can be done in parallel with auth check)
        appState.categories = await API.getCategories();

        // Filter main categories
        const mainCategoryNames = ['Pittura', 'Disegno', 'Fotografia'];
        appState.mainCategories = mainCategoryNames
            .map(name => appState.categories.find(cat => cat.name === name))
            .filter(cat => cat !== undefined);

        // Check auth status 
        await updateAuthState();
        
        // Start the router
        page();

        // Remove loading state
        document.body.classList.remove('loading');
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';

    } catch (error) {
        console.error('Error initializing app:', error);
        // Handle initialization error
        document.body.classList.remove('loading');
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
    }
});

export { appState, authEvents };

