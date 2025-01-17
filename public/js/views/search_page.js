"use strict";

import SearchHeader from "../templates/search/search_header.js";
import SearchGallery from "../templates/search/search_gallery.js";
import LoadingScreen from "../templates/others/loading_screen.js";
import API from "../api.js";

class SearchPage {
    constructor(search_info_title, search_info_counter, initialSearchValue = '', searchBy = 'all', orderBy = '') {
        this.validSearchBy = ['all', 'title', 'category', 'author', 'tag'];
        this.validOrderBy = ['likes', 'comments', 'date'];
        this.search_info_title = search_info_title;
        this.search_info_counter = search_info_counter;
        this.initialSearchValue = initialSearchValue;
        
        // Initialize search parameters
        this.searchParams = {
            searchTerm: initialSearchValue,
            searchBy: searchBy,
            orderBy: orderBy
        };

        // Validate initial parameters
        this.#validateSearchByParams();
        this.#validateOrderByParams();

        this.searchHeader = new SearchHeader(
            search_info_title, 
            search_info_counter, 
            this.searchParams.searchTerm,
            this.searchParams.searchBy,
            this.searchParams.orderBy
        );
        this.searchGallery = new SearchGallery();

        // Bind handlers
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    async mount() {
        LoadingScreen.show();

        const mainContent = document.querySelector('#content');
        mainContent.innerHTML = this.render();

        // Attach event listeners
        document.addEventListener('search', this.handleSearch);
        document.addEventListener('filterChange', this.handleFilterChange);
        this.searchHeader.attachEventListeners();

        // Initial search
        await this.performSearch();
        
        LoadingScreen.hide();
    }

    async handleSearch(event) {
        this.searchParams.searchTerm = event.detail.searchTerm;
        await this.performSearch();
    }

    async handleFilterChange(event) {
        console.log("Search page: handleFilterChange");
        const { type, value } = event.detail;
        console.log(type, value);
        if (type === 'sort') {
            this.searchParams.orderBy = value && value !== 'none' ? value : '';
        } else if (type === 'filter') {
            this.searchParams.searchBy = value && value !== 'none' ? value : 'all';
        }
        await this.performSearch();
    }

    async performSearch() {
        try {
            // If searchTerm is empty, show placeholder message instead of making API call
            if (!this.searchParams.searchTerm) {
                document.getElementById('search-info-counter').textContent = 
                    'Inserisci un termine di ricerca';
                this.searchGallery.showPlaceholder(
                    'Cosa vuoi cercare?', 
                    'Digita qualcosa nella barra di ricerca'
                );
                return;
            }

            this.#validateSearchByParams();
            this.#validateOrderByParams();

            // Show loading state
            document.getElementById('search-info-counter').textContent = 'Ricerca in corso...';
            
            // Make API call
            const results = await API.searchImages(
                this.searchParams.searchTerm,
                this.searchParams.searchBy,
                this.searchParams.orderBy
            );

            // Update results count
            document.getElementById('search-info-counter').textContent = 
                `${results.length} risultat${results.length === 1 ? 'o' : 'i'} trovat${results.length === 1 ? 'o' : 'i'}`;

            // Update gallery
            this.searchGallery.updateResults(results);

        } catch (error) {
            console.error('Search failed:', error);
            document.getElementById('search-info-counter').textContent = 
                'Errore durante la ricerca';
        }
    }

    render() {
        return `
            <div class="container-fluid">
                ${this.searchHeader.render()}
                ${this.searchGallery.render()}
            </div>
        `;
    }

    #validateSearchByParams() {
        if (!this.validSearchBy.includes(this.searchParams.searchBy)) {
            this.searchParams.searchBy = 'all';
        }
    }

    #validateOrderByParams() {
        if (!this.validOrderBy.includes(this.searchParams.orderBy)) {
            this.searchParams.orderBy = '';
        }
    }
}

export default SearchPage;