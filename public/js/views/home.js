"use strict";
import Carousel from '../templates/home/carousel.js';
import ScrollingMenu from '../templates/home/scrolling_menu.js';
import ExploreTitleRow from '../templates/home/explore_title_row.js';
import SearchGallery from '../templates/search/search_gallery.js';
import LoadingScreen from '../templates/others/loading_screen.js';

export class HomeView {
    constructor() {
        this.mainCategories = []; // Will be populated from server
        this.sideCategories = [];
        this.categories = [];     // Will be populated from server
        
        // Pre-instantiate components
        this.carousel = null;
        this.scrollingMenu = null;
        this.exploreTitleRow = new ExploreTitleRow();
        this.searchGallery = new SearchGallery();
    }

    async render() {
        // Show loading screen
        LoadingScreen.show();

        try {
            // Start loading data immediately
            const dataPromise = this.loadData();

            // Render initial layout with loading states
            document.getElementById('content').innerHTML = `
                <div id="carousel-row" class="row-cols-1 invisible">
                    <div class="text-center p-5">Loading carousel...</div>
                </div>
                <div id="scrolling-menu-wrapper" class="container-fluid d-flex position-relative invisible">
                    <div class="text-center w-100 p-3">Loading categories...</div>
                </div>
                <div class="invisible">
                    ${this.exploreTitleRow.render()}
                    ${this.searchGallery.render()}
                </div>
            `;

            // Wait for data and update components
            await dataPromise;
            this.updateComponents();

            // Show all components
            document.querySelectorAll('#content > div').forEach(el => {
                el.classList.remove('invisible');
                el.classList.add('fade-in');
            });

        } catch (error) {
            console.error('Error rendering home page:', error);
            // Show error message to user
            document.getElementById('content').innerHTML = `
                <div class="alert alert-danger m-3" role="alert">
                    Si è verificato un errore durante il caricamento della pagina. Riprova più tardi.
                </div>
            `;
        } finally {
            // Hide loading screen
            LoadingScreen.hide();
        }
    }

    async loadData() {
        try {
            // Load categories
            const categoriesResponse = await fetch('/categories');
            const categoriesData = await categoriesResponse.json();
            
            // Convert categories and filter main ones
            const mainCategoryNames = ['Pittura', 'Disegno', 'Fotografia'];
            
            this.categories = Object.entries(categoriesData.categories).map(([name, details]) => ({
                name,
                id: details.id,
                iconPath: details.iconPath
            }));

            // Filter main categories in the correct order
            this.mainCategories = mainCategoryNames
                .map(name => this.categories.find(cat => cat.name === name))
                .filter(cat => cat !== undefined);

            // Filter side categories
            this.sideCategories = this.categories.filter(
                entry => !mainCategoryNames.find(name => name === entry.name)
            );

            // Instantiate components that need data
            this.carousel = new Carousel(this.mainCategories);
            this.scrollingMenu = new ScrollingMenu(this.sideCategories);

        } catch (error) {
            console.error('Error loading home page data:', error);
        }
    }

    updateComponents() {
        // Update carousel
        const carouselContainer = document.getElementById('carousel-row');
        if (carouselContainer && this.carousel) {
            carouselContainer.innerHTML = this.carousel.render();
        }

        // Update scrolling menu
        const menuWrapper = document.getElementById('scrolling-menu-wrapper');
        if (menuWrapper && this.scrollingMenu) {
            menuWrapper.innerHTML = this.scrollingMenu.render();
        }

        // Initialize components after rendering
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize Bootstrap carousel
        const carouselElement = document.getElementById('carouselTop');
        if (carouselElement) {
            new window.bootstrap.Carousel(carouselElement);
        }

        // Load and execute the categories scrolling script
        const script = document.createElement('script');
        script.src = '/js/scripts/categories_scrolling.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);
    }
}