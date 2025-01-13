"use strict";

class SearchGallery {


    constructor(images) {
        this.images = images;
    }


    render() {
        return `
            <div id="search-result-gallery-container" class="container-fluid justify-content-center d-flex standard-background">
                <div id="search-result-gallery" class="w-100 h-100 d-flex flex-row justify-content-start flex-wrap">
                    ${this.images.map(image => this.renderImage(image)).join('')}
                </div>
            </div>     
        `
    }

    renderImage(image) {
        return `
            <a class="image-anchor search-result-anchor" href="#">
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
}

export default SearchGallery;