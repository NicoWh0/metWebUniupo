"use strict";

import ImageContent from '../templates/imagepage/image_content.js';
import Comments from '../templates/imagepage/comments.js';
import Related from '../templates/imagepage/related.js';
import LoadingScreen from '../templates/others/loading_screen.js';

class ImagePage {

    constructor() {
        this.imageContent = new ImageContent();
        this.comments = new Comments();
        this.related = new Related();
    }

    async mount(id) {
        LoadingScreen.show();
        //for now, we just need to render the page
        const mainContent = document.getElementById('content');
        mainContent.innerHTML = await this.#render();
        LoadingScreen.hide();
    }

    async #render() {
        return `
            <div class="modal fade" id="editImage" tabindex="-1" aria-labelledby="editImageLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="editImageLabel">Modifica immagine pubblicata</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="recipient-name" class="col-form-label">Titolo*:</label>
                                    <input type="text" class="form-control" id="recipient-name">
                                </div>
                                <div class="form-group">
                                    <label for="message-text" class="col-form-label">Descrizione:</label>
                                    <textarea class="form-control" id="message-text"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-primary">Conferma modifiche</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="editComment" tabindex="-1" aria-labelledby="editCommentLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="editCommentLabel">Modifica commento (max 300 caratteri)</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="message-text" class="col-form-label">Testo Commento:</label>
                                    <textarea class="form-control" id="message-text">Grazie a tutti!</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-primary">Conferma modifiche</button>
                        </div>
                    </div>
                </div>
            </div>
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
}

export default ImagePage;