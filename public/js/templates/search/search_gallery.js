"use strict";

class SearchGallery {

    constructor(images, standard_background = false) {
        this.images = images;
        this.standard_background = standard_background;
    }

    render() {
        return `
            <div id="search-result-gallery-container" class="container-fluid justify-content-center d-flex ${this.standard_background ? 'standard-background' : ''}">
                <div id="search-result-gallery" class="w-100 h-100 d-flex flex-row justify-content-start flex-wrap">
                    ${!this.images || this.images.length === 0 ? 
                        this.#renderEmptyState() : 
                        this.images.map(image => this.#renderImage(image)).join('')
                    }
                </div>
            </div>     
        `
    }

    #renderEmptyState() {
        return `
            <div class="col-12 text-center mt-5">
                <svg class="search-placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <h3>Nessun risultato trovato</h3>
                <p class="text-muted">Prova a modificare i filtri di ricerca</p>
            </div>
        `;
    }

    #renderImage(image) {
        return `
            <a class="image-anchor search-result-anchor" href="/image/${image.Id}">
                <div class="search-result-wrapper light-grey-border">
                    <img class="search-result-img" src="${image.ImagePath.replace('db_images', 'imageFile')}" alt="${image.Title}">
                    <div class="search-result-overlay-desc d-flex flex-column-reverse">    
                        <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                            <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0 z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0 A8 8 0 0 1 0 8 z m8-7a7 7 0 0 0-5.468 11.37 C3.242 11.226 4.805 10 8 10 s4.757 1.225 5.468 2.37 A7 7 0 0 0 8 1z"/>
                                </svg>
                                <span class="search-result-author-username">${image.AuthorName}</span>
                            </div>
                            <span class="search-result-title">${image.Title}</span>
                        </div>  
                    </div>
                </div>
            </a>
        `
    }

    #reRender() {
        const galleryElement = document.getElementById('search-result-gallery');
        if (galleryElement) {
            galleryElement.innerHTML = this.images.length === 0 ? 
                this.#renderEmptyState() : 
                this.images.map(image => this.#renderImage(image)).join('');
        }
    }

    updateResults(newResults) {
        this.images = newResults;
        this.#reRender();
    }

    showPlaceholder(title, message) {
        const galleryElement = document.getElementById('search-result-gallery');
        if (galleryElement) {
            galleryElement.innerHTML = `
                <div class="col-12 text-center mt-5">
                    <svg class="search-placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                    <h3>${title}</h3>
                    <p class="text-muted">${message}</p>
                </div>
            `;
        }
    }
}

export default SearchGallery;