"use strict";


class SearchHeader {

    constructor(search_info_title, search_info_counter, initialSearchValue = '', initialSearchBy = 'all', initialOrderBy = '') {
        this.search_info_title = search_info_title;
        this.search_info_counter = search_info_counter;
        this.initialSearchValue = initialSearchValue;
        this.initialSearchBy = initialSearchBy;
        this.initialOrderBy = initialOrderBy;
        this.debounceTimeout = null;
    }


    render() {
        // Helper function to get the display text for filter values
        const getFilterText = (type, value) => {
            const filterMappings = {
                searchBy: {
                    'all': 'Nessuna preferenza',
                    'title': 'Titolo',
                    'category': 'Categoria',
                    'author': 'Nome artista',
                    'tag': 'Tag'
                },
                orderBy: {
                    '': 'Nessuna preferenza',
                    'likes': 'Numero di like',
                    'comments': 'Numero di commenti',
                    'date': 'Più recenti'
                }
            };
            return filterMappings[type][value] || 'Nessuna preferenza';
        };

        return `
            <div id="search-header" class="row d-flex flex-row align-items-center justify-content-start">
                <div id="search-info-box" class="d-flex flex-column justify-content-around h-75">
                    <h2 id="search-info-title">${this.search_info_title}</h2>
                    <p id="search-info-counter">${this.search_info_counter}</p>
                </div>
                <div class="col-12 mb-4">
                    <div class="search-bar-container">
                        <input type="text" 
                               class="form-control search-input" 
                               id="search-bar"
                               placeholder="Cerca immagini..."
                               value="${this.initialSearchValue}"
                               aria-label="Search">
                        <i class="bi bi-search search-icon"></i>
                    </div>
                </div>
                <div id="search-buttons" class="d-flex align-items-center gap-4 h-50">
                    <div class="d-flex align-items-center justify-content-between gap-2 w-100">
                        <label for="sortDropdown" class="form-label mb-0">Ordina per:</label>
                        <div class="dropdown">
                            <button class="btn btn-primary search-filter-button dropdown-toggle" 
                                    id="sortDropdown" 
                                    role="button" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false">
                                ${getFilterText('orderBy', this.initialOrderBy)}
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item search-option" value="">Nessuna preferenza</li>
                                <li class="dropdown-item search-option" value="likes">Numero di like</li>
                                <li class="dropdown-item search-option" value="comments">Numero di commenti</li>
                                <li class="dropdown-item search-option" value="date">Più recenti</li>
                            </ul>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between gap-2 w-100">
                        <label for="filterDropdown" class="form-label mb-0">Cerca per:</label>
                        <div class="dropdown">
                            <button class="btn btn-primary search-filter-button dropdown-toggle" 
                                    id="filterDropdown" 
                                    role="button" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false">
                                ${getFilterText('searchBy', this.initialSearchBy)}
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item search-option" value="all">Nessuna preferenza</li>
                                <li class="dropdown-item search-option" value="title">Titolo</li>
                                <li class="dropdown-item search-option" value="category">Categoria</li>
                                <li class="dropdown-item search-option" value="author">Nome artista</li>
                                <li class="dropdown-item search-option" value="tag">Tag</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const searchInput = document.getElementById('search-bar');
        const sortOptions = document.querySelectorAll('#sortDropdown + .dropdown-menu .dropdown-item');
        const filterOptions = document.querySelectorAll('#filterDropdown + .dropdown-menu .dropdown-item');

        // Search input handler with debounce
        searchInput.addEventListener('input', (e) => {
            // Clear the previous timeout
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }

            // Set a new timeout
            this.debounceTimeout = setTimeout(() => {
                const searchTerm = e.target.value.trim();
                document.dispatchEvent(new CustomEvent('search', { 
                    detail: { searchTerm } 
                }));
            }, 500); // Wait 500ms after the user stops typing
        });

        // Sort options handler
        sortOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const value = e.target.getAttribute('value') || 'none';
                const text = e.target.textContent;
                
                // Update button text
                document.getElementById('sortDropdown').textContent = text;
                
                // Dispatch filter change event
                document.dispatchEvent(new CustomEvent('filterChange', { 
                    detail: { 
                        type: 'sort',
                        value: value 
                    } 
                }));
            });
        });

        // Filter options handler
        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const value = e.target.getAttribute('value') || 'none';
                const text = e.target.textContent;
                
                // Update button text
                document.getElementById('filterDropdown').textContent = text;
                
                // Dispatch filter change event
                document.dispatchEvent(new CustomEvent('filterChange', { 
                    detail: { 
                        type: 'filter',
                        value: value 
                    } 
                }));
            });
        });
    }

    async updateResults(filterOption) {
        const searchEvent = new CustomEvent('search', { 
            detail: { filterOption } 
        });
        document.dispatchEvent(searchEvent);
    }

}


export default SearchHeader;