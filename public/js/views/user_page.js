"use strict";

import UserHeader from '../templates/user/user_header.js';
import UserImages from '../templates/user/user_images.js';
import LoadingScreen from '../templates/others/loading_screen.js';
import API from '../api.js';

class UserPage {
    constructor() {
        this.userId = null;
        this.user = null;
        this.images = [];
    }

    async mount(id) {
        LoadingScreen.show();
        this.userId = id;
        try {
            await this.#loadUser();
            await this.#loadImages();
            await this.#render();
        } catch (error) {
            if(error.cause === 404) {
                window.location.href = '/404';
                return;
            }
            else {
                console.error(error);
                document.getElementById('content').innerHTML = `
                    <div class="vh-100 d-flex justify-content-center align-items-center">
                        <div class="alert alert-danger m-3" role="alert">
                            Si è verificato un errore durante il caricamento della pagina. Riprova più tardi.
                        </div>
                    </div>
                `;
            }
        } finally {
            LoadingScreen.hide();
        }
    }

    async #render() {
        const userHeader = new UserHeader(this.user);
        const userImages = new UserImages(this.images, this.user);

        const content = document.getElementById('content');
        content.innerHTML = `
            ${userHeader.render()}
            ${userImages.render()}
        `
    }

    async #loadUser() {
        this.user = await API.getUser(this.userId);
        console.log(this.user);
    }

    async #loadImages() {
        this.images = await API.searchImages(this.user.username, 'author');
        console.log(this.images);
    }
}

export default UserPage;