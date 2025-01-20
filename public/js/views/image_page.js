"use strict";

import ImageContent from '../templates/imagepage/image_content.js';
import Comments from '../templates/imagepage/comments.js';
import Related from '../templates/imagepage/related.js';
import LoadingScreen from '../templates/others/loading_screen.js';
import EditImageModal from '../templates/modals/edit_image_modal.js';
import EditCommentModal from '../templates/modals/edit_comment_modal.js';
import API from '../api.js';
import { appState } from '../app.js';

class ImagePage {

    constructor() {
        this.imageContent = null;
        this.comments = new Comments();
        this.related = new Related();

        //Image data
        this.imageData = null;
        this.imageTags = null;
        this.imageCategories = null;
        this.imageComments = null;

        this.modals = []; // Array to store modal instances
    }

    async mount(id) {
        LoadingScreen.show();
        //for now, we just need to render the page
        try {
            await this.#loadImageData(id);
            this.imageContent = new ImageContent(this.imageData, this.imageTags, this.imageCategories);
            const mainContent = document.getElementById('content');
            mainContent.innerHTML = await this.#render();
            await this.#addModals();
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
        return `
            <section id="offcanvas-end" class="offcanvas offcanvas-end bg-dark" tabindex="-1" aria-labelledby="offcanvasEndLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body d-flex flex-column">
                    ${this.related.render()}
                </div>
            </section>
            <main id="user-post-content" class="container-fluid d-flex flex-row">
                <div id="img-content-column" class="container-lg d-flex flex-column">
                    <div id="offcanvas-related-button-row" class="d-flex flex-row justify-content-end align-content-center">
                        <button id="offcanvas-related-button" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-end" aria-controls="offcanvasEnd">Correlati</button>
                    </div>
                    ${this.imageContent.render()}
                    ${this.comments.render()}
                </div>
                <div id="related" class="container-sm d-flex flex-column align-content-center">
                    ${this.related.render()}
                </div>
            </main>
        `;
    }

    async #addModals() {
        const modalsContainer = document.querySelector('#modals');
        if(modalsContainer) {
            // Create and add edit image modal
            const editImageModal = new EditImageModal({
                title: this.imageData.Title,
                description: this.imageData.Description,
                categories: this.imageCategories,
                tags: this.imageTags
            });        
            modalsContainer.insertAdjacentHTML('beforeend', editImageModal.render());
            editImageModal.attachEventListeners();
            
            // Create and add edit comment modal
            const editCommentModal = new EditCommentModal();    
            modalsContainer.insertAdjacentHTML('beforeend', editCommentModal.render());
            //editCommentModal.attachEventListeners();

            // Store Bootstrap modal instances for cleanup
            this.modals = [
                bootstrap.Modal.getOrCreateInstance(document.getElementById('editImage')),
                bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')),
                bootstrap.Modal.getOrCreateInstance(document.getElementById('editComment'))
            ];
        }
    }

    unmount() {
        // Hide and dispose of all modals
        this.modals.forEach(modal => {
            if (modal) {
                modal.hide(); // Hide the modal if it's open
                modal.dispose(); // Remove the modal from memory
            }
        });

        // Remove modal elements from DOM
        const modalsContainer = document.querySelector('#modals');
        if (modalsContainer) {
            for(let i = 0; i < this.modals.length; i++) {
                modalsContainer.removeChild(modalsContainer.lastElementChild);
            }
        }

        // Clear modal instances array
        this.modals = [];
    }

    async #loadImageData(id) {  
        this.imageData = await API.getImageById(id);
        this.imageTags = (await API.getTagsByImageId(id)).map(tag => tag.TagName);
        this.imageCategories = (await API.getCategoriesByImageId(id)).map(category => category.Name);
        //Ensure categories are in the correct order
        const mainCategory = this.imageCategories.find(category => appState.mainCategories.find(cat => cat.name === category));
        this.imageCategories = [mainCategory, ...this.imageCategories.filter(category => category !== mainCategory)];


        this.imageComments = await API.getCommentsByImageId(id);

        console.log(this.imageData);
        console.log(this.imageTags);
        console.log(this.imageCategories);
        console.log(this.imageComments); 
    }
}

export default ImagePage;