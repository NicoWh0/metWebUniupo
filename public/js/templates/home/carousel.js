"use strict";


class Carousel {

    constructor(mainCategories) {
        this.mainCategories = mainCategories;
    }

    render() {
        return `
            <div id="carouselTop" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ${this.mainCategories.map((_, index) => `
                        <button type="button" 
                            data-bs-target="#carouselTop" 
                            data-bs-slide-to="${index}" 
                            ${index === 0 ? 'class="active" aria-current="true"' : ''} 
                            aria-label="Slide ${index + 1}">
                        </button>
                    `).join('')}
                </div>
                <div class="carousel-inner">
                    ${this.mainCategories.map((category, index) => 
                        this.renderCarouselItem(category, index === 0)
                    ).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselTop" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselTop" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;
    }

    renderCarouselItem(category, isActive) {
        return `
            <div class="carousel-item ${isActive ? 'active' : ''}">
                <a class="carousel-img-container" href="/search?category=${encodeURIComponent(category.name)}">
                    <img src="${category.iconPath}" class="d-block w-100" alt="${category.name}">
                </a>
                <div class="carousel-caption d-none d-md-block">
                    <h2 class="carousel-caption-title">${category.name}</h2>
                </div>
            </div>
        `;
    }
}

export default Carousel;