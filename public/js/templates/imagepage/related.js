"use strict";

import API from "../../api.js";
import { appState } from "../../app.js";

class Related {
    constructor(imageData) {
        this.imageData = imageData;
        this.relatedImages = [];
        this.authorImages = [];
    }

    async fetchRelatedImages() {
        try {
            let images = [];
            const neededImages = 9;

            // Fetch author's other images first
            this.authorImages = await API.searchImages(this.imageData.AuthorName, 'author', 'date', 10);
            // Remove current image (if it's in the list) and take only the first 9
            this.authorImages = this.authorImages
                .filter(img => img.Id !== this.imageData.Id)
                .slice(0, 9);

            // (Related images) Try categories first
            if (this.imageData.categories && this.imageData.categories.length > 0) {
                const randomCategoryOrder = [...this.imageData.categories].sort(() => Math.random() - 0.5);
                for(const category of randomCategoryOrder) {
                    const categoryImages = await API.searchImages(category, 'category');
                    images = images.concat(categoryImages.filter(img => img.Id !== this.imageData.Id));
                }
            }
            images = images.filter(img => img.AuthorId !== this.imageData.AuthorId);
            //remove duplicates
            images = images.filter((img, index, self) => index === self.findIndex(t => t.Id === img.Id));

            // (Related images) If we need more images, try tags
            if (this.imageData.tags && this.imageData.tags.length > 0) {
                const randomTagOrder = [...this.imageData.tags].sort(() => Math.random() - 0.5);
                for(const tag of randomTagOrder) {
                    const tagImages = await API.searchImages(tag, 'tag');
                    images = images.concat(tagImages.filter(img => 
                        img.Id !== this.imageData.Id && 
                        !images.some(existingImg => existingImg.Id === img.Id)
                    ));
                }
            }
            images = images.filter(img => img.AuthorId !== this.imageData.AuthorId);
            //remove duplicates
            images = images.filter((img, index, self) => index === self.findIndex(t => t.Id === img.Id));

            // (Related images) If we still need more images, get random ones
            if (images.length < neededImages) {
                const randomImages = await API.getRandomImages(neededImages - images.length);
                images = images.concat(randomImages.filter(img => 
                    img.Id !== this.imageData.Id && 
                    !images.some(existingImg => existingImg.Id === img.Id)
                ));
            }
            images = images.filter(img => img.AuthorId !== this.imageData.AuthorId);
            //remove duplicates
            images = images.filter((img, index, self) => index === self.findIndex(t => t.Id === img.Id));

            // Take only the first 9
            this.relatedImages = images.slice(0, 9);

            // One last shuffle
            this.relatedImages = this.relatedImages.sort(() => Math.random() - 0.5);


        } catch (error) {
            console.error('Error fetching related images:', error);
            this.relatedImages = [];
            this.authorImages = [];
        }
    }

    render() {
        return `
            <div class="d-flex flex-column h-50 align-content-center justify-content-start">
                <div id="related-title-wrapper" class="d-flex flex-row align-items-end">
                    <h2 id="related-title">Potrebbero piacerti anche...</h2>
                </div>
                <div class="container-fluid">
                    <div class="row row-cols-3 d-flex flex-row gx-1 gy-4 justify-content-around">
                        ${this.relatedImages.map(image => this.#renderImageThumbnail(image)).join('')}
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column h-50 align-content-center justify-content-start">
                <div id="related-more-by-wrapper" class="d-flex flex-row align-items-end">
                    <a id="more-by-title" href="/user/${this.imageData.AuthorId}">Altro da ${this.imageData.AuthorName}</a>
                </div>
                <div class="container-fluid">
                    ${this.#renderAuthorImages()}
                </div>
            </div>
        `;
    }

    #renderImageThumbnail(image) {
        return `
            <div class="col d-flex justify-content-center">
                <a href="/image/${image.Id}" title="${image.Title}">
                    <div class="related-img-container">                                       
                        <img class="related-img" src="${image.ImagePath.replace('db_images', 'imageFile')}" alt="${image.Title}">
                        <div class="related-img-dark-transparent-layer"></div>
                    </div> 
                </a>
            </div>
        `;
    }

    #renderAuthorImages() {
        if (this.authorImages.length === 0) {
            return `
                <div class="d-flex justify-content-center align-items-center h-100">
                    <p class="text-center text-muted">
                        Ops, sembra che ${this.imageData.AuthorName} non abbia pubblicato altre immagini oltre a questa
                    </p>
                </div>
            `;
        }

        return `
            <div class="row row-cols-3 d-flex flex-row gx-1 gy-4 justify-content-around">
                ${this.authorImages.map(image => this.#renderImageThumbnail(image)).join('')}
            </div>
        `;
    }
}

export default Related;