"use strict";

class ScrollingMenu {

    constructor(categories) {
        this.categories = categories;
    }

    render() {
        return `
            <div id="scrolling-menu-wrapper" class="container-fluid d-flex position-relative">
                <div id="scrolling-menu-overlay-left" class="scrolling-menu-overlay"></div>
                <div id="scrolling-menu-overlay-right" class="scrolling-menu-overlay"></div>
                <div class="d-flex flex-column align-items-center justify-content-center scrolling-menu-arrow-wrapper left-arrow">
                    <button type="button" id="arrow-left-button" class="scrolling-arrow-button p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" id="arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </button>
                </div>
                <div id="scrolling-menu" class="row flex-row flex-nowrap border-bottom">
                    ${this.renderScrollMenu()}
                </div>
                <div class="d-flex flex-column align-items-center justify-content-center scrolling-menu-arrow-wrapper right-arrow">
                    <button type="button" id="arrow-right-button" class="scrolling-arrow-button p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" id="arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg>
                    </button>
                </div>
            </div>
        `
    }

    renderScrollMenuItem(category) {
        return `
            <ul class="list-group-item scrolling-item d-flex align-items-center">
                <a class="scrolling-anchor d-flex flex-row align-items-center" href="search.html?category=${category.name}">
                    <img class="scrolling-img" src="${category.iconPath}" alt="${category.name}">
                    <div class="d-flex justify-content-between">
                        <h3 class="scrolling-text">${category.name}</h3>
                    </div>
                </a>
            </ul>
        `;
    }

    renderScrollMenu() {
        return `
            <li class="list-group list-group-horizontal w-75">
                ${this.categories.map(category => this.renderScrollMenuItem(category)).join('')} 
            </li>
        `;
    }
}

export default ScrollingMenu;