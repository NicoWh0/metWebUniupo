"use strict";
import page from '//unpkg.com/page/page.mjs';
import { HomeView } from './views/home.js';
import Navbar from './templates/navbar/navbar.js';
import API from './api.js';
import LoginModal from './templates/modals/login_modal.js';
import RegisterModal from './templates/modals/register_modal.js';
import UploadModal from './templates/modals/upload_modal.js';
import ChangePasswordModal from './templates/modals/change_password_modal.js';
import SearchPage from './views/search_page.js';
import NotFound from './templates/others/not_found.js';
import ImagePage from './views/image_page.js';
import UserPage from './views/user_page.js';

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

// Initialize views
const homeView = new HomeView();

// Route handlers
const renderHome = async () => {
    document.title = 'GroundArt - Home';
    await homeView.mount();
};

// Define routes
page('/', '/home');
page('/home', renderHome);
page('/search', async (ctx) => {
    //query is like this: ?value=searchTerm&searchBy=filterValue&sort=sortValue
    document.title = 'GroundArt - Search';
    const query = ctx.querystring;
    const searchTerm = query.split('&')[0]?.split('=')[1];
    const searchBy = query.split('&')[1]?.split('=')[1];
    const sortValue = query.split('&')[2]?.split('=')[1];

    const searchPage = new SearchPage(
        "Risultati della ricerca", 
        "0 risultati trovati",    
        searchTerm ?? '',
        searchBy ?? 'all',
        sortValue ?? ''
    );
    ctx.searchPage = searchPage;

    await searchPage.mount();
});


page.exit('/search', async (ctx, next) => {
    // Unmount search page
    ctx.searchPage.unmount();
    ctx.searchPage = null;
    next();
});

page('/image/:id', async (ctx) => {
    const imagePage = new ImagePage();
    document.title = 'GroundArt - Image';
    ctx.imagePage = imagePage;
    await imagePage.mount(ctx.params.id);
});

page.exit('/image/:id', async (ctx, next) => {
    ctx.imagePage.unmount();
    ctx.imagePage = null;
    // Reset body style (if related image is clicked in the offcanvas)
    document.getElementsByTagName('body')[0].style.overflow = null;
    document.getElementsByTagName('body')[0].style.paddingRight = null;
    next();
});

page('/user/:id', async (ctx) => {
    const userPage = new UserPage();
    document.title = 'GroundArt - User';
    await userPage.mount(ctx.params.id);
});

page.exit('*', async (_, next) => {
    //Scroll to top when exiting any page
    window.scrollTo(0, 0);
    next();
});


page('*', () => {
    const notFound = new NotFound();
    document.title = 'GroundArt - Page not found';
    const content = document.getElementById('content');
    content.innerHTML = notFound.render();
});

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
            const changePasswordModal = new ChangePasswordModal();
            modalsContainer.insertAdjacentHTML('beforeend', changePasswordModal.render());
            changePasswordModal.attachEventListeners();
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

