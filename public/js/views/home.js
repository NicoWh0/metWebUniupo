"use strict";
import Carousel from '../templates/home/carousel.js';
import ScrollingMenu from '../templates/home/scrolling_menu.js';
import ExploreTitleRow from '../templates/home/explore_title_row.js';
import SearchGallery from '../templates/search/search_gallery.js';
import LoadingScreen from '../templates/others/loading_screen.js';
import { appState } from '../app.js';
import API from '../api.js';
import { initializeCategoryScroller } from '../scripts/categories_scrolling.js';

export class HomeView {
    constructor() {
        this.mainCategories = [];
        this.sideCategories = [];
        this.categories = [];    
        
        // Pre-instantiate components
        this.carousel = null;
        this.scrollingMenu = null;
        this.exploreTitleRow = null;
        this.searchGallery = null;
        this.categoryScroller = null;
    }

    async mount() {
        await this.#render();

        // Initialize the category scroller
        this.categoryScroller = initializeCategoryScroller();
    }

    async #render() {
        LoadingScreen.show();
        try {
            // Start loading data immediately
            await this.#loadData();

            // Render initial layout with loading states
            document.getElementById('content').innerHTML = `
                <div id="carousel-row" class="row-cols-1 fade-in">
                    
                </div>
                <div id="scrolling-menu-wrapper" class="container-fluid d-flex position-relative fade-in">
                    
                </div>
                <div id="home-content" class="fade-in">
                
                </div>
            `;

            await this.#updateComponents();

        } catch (error) {
            console.error('Error rendering home page:', error);
            // Show error message to user
            document.getElementById('content').innerHTML = `
                <div class="vh-100 d-flex justify-content-center align-items-center">
                    <div class="alert alert-danger m-3" role="alert">
                        Si è verificato un errore durante il caricamento della pagina. Riprova più tardi.
                    </div>
                </div>
            `;
        } finally {
            // Hide loading screen
            LoadingScreen.hide();
        }
    }

    async #loadData() {
        try {
            // Use categories from appState
            const mainCategoryNames = appState.mainCategories.map(cat => cat.name);
            
            // Convert categories and filter main ones
            this.categories = appState.categories;

            // Filter main categories in the correct order
            this.mainCategories = mainCategoryNames
                .map(name => this.categories.find(cat => cat.name === name))
                .filter(cat => cat !== undefined);

            // Filter side categories
            this.sideCategories = this.categories.filter(
                category => !mainCategoryNames.includes(category.name)
            );

            // Instantiate components that need data
            this.carousel = new Carousel(this.mainCategories);
            this.scrollingMenu = new ScrollingMenu(this.sideCategories);
            const tags = await API.getMostUsedTags();
            this.exploreTitleRow = new ExploreTitleRow(tags);
            const images = await API.getRandomImages();
            this.searchGallery = new SearchGallery(images, true);

        } catch (error) {
            console.error('Error loading home page data:', error);
        }
    }

    async #updateComponents() {
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

        const homeContent = document.getElementById('home-content');
        if(homeContent && this.exploreTitleRow) {
            homeContent.innerHTML = `
                ${this.exploreTitleRow.render()}
                ${this.searchGallery.render()}
            `;
        }

        // Initialize components after rendering
        await this.#initializeComponents();
    }

    async #initializeComponents() {
        // Initialize Bootstrap carousel
        const carouselElement = document.getElementById('carouselTop');
        if (carouselElement) {
            new window.bootstrap.Carousel(carouselElement);
        }
    }
}