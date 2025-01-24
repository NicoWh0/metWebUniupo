"use strict";

class UserImages {
    constructor(images, user) {
        this.images = images;
        this.user = user;
    }

    render() {
        return `
            <div id="user-posted-images" class="container-fluid">
                <div id="user-art-gallery" class="w-100 d-flex flex-row justify-content-start flex-wrap ${this.images.length > 0 ? '' : 'empty'}">
                    ${
                        this.images.length > 0 ?
                        this.images.map(image => this.#renderImage(image)).join('')
                        :
                        `<div id="user-art-empty" class="d-flex flex-column justify-content-center align-items-center w-100">
                            <h1 class="text-center text-muted">:(</h1>
                            <p class="text-center">Sembra che ${this.user?.username} non abbia ancora pubblicato nessuna immagine</p>
                        </div>`
                    }
                </div>
            </div>
        `
    }


    #renderImage(image) {
        return `
            <a class="image-anchor user-art-anchor" href="/image/${image.Id}">
                <div class="user-art-wrapper">
                    <img class="user-art" src="${image.ImagePath.replace('db_images', 'imageFile')}" alt="${image.Title}">
                    <div class="user-art-overlay-desc d-flex flex-column-reverse">
                        <span class="user-art-desc">${image.Title}</span>
                    </div>
                </div>
            </a>
        `
    }
}

export default UserImages;