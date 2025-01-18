"use strict";

class Comments {
    render() {
        return `
            <div id="comments-section" class="row d-flex flex-column justify-content-around">
                <h1 id="comments-title">Commenti</h1>
                <div class="d-flex flex-column">
                    <div id="comment-form-group" class="input-group d-flex flex-row">
                        <div class="comment-user-image-wrapper d-flex align-items-start justify-content-start">
                            <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                        </div>
                        <textarea id="comment-form" class="form-control" aria-describedby="commentBlock" placeholder="Inserisci un commento (max 300 caratteri)" maxlength="300"></textarea>
                    </div>
                    <div id="comments-column" class="d-flex flex-column">
                        <div class="comment-wrapper d-flex flex-row">
                            <div class="comment-user-image-wrapper d-flex align-items-start">
                                <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                            </div>
                            <div class="card-container d-flex flex-column">
                                <div class="card">
                                    <div class="card-body bg-dark d-flex flex-column justify-content-between">
                                        <span class="card-title">NicoWho</span>
                                        <p class="card-text">Grazie a tutti!</p>
                                    </div>
                                </div>
                                <div class="comment-buttons-wrapper d-flex flex-row">
                                    <svg class="comment-button comment-edit-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#editComment">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                    <div class="d-flex flex-row justify-content-between align-items-center">
                                        <svg class="comment-button comment-like-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> 
                                            <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                        </svg>
                                        <span class="comment-like-counter">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-wrapper d-flex flex-row">
                            <div class="comment-user-image-wrapper d-flex align-items-start">
                                <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                            </div>
                            <div class="card-container d-flex flex-column">
                                <div class="card">
                                    <div class="card-body bg-dark d-flex flex-column justify-content-between">
                                        <span class="card-title">crow32</span>
                                        <p class="card-text">Molto bello! :&#41</p>
                                    </div>
                                </div>
                                <div class="comment-buttons-wrapper d-flex flex-row">
                                    <div class="d-flex flex-row justify-content-between align-items-center">
                                        <svg class="comment-button comment-like-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> 
                                            <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                        </svg>
                                        <span class="comment-like-counter">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-wrapper d-flex flex-row">
                            <div class="comment-user-image-wrapper d-flex align-items-start">
                                <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                            </div>
                            <div class="card-container d-flex flex-column">
                                <div class="card">
                                    <div class="card-body bg-dark d-flex flex-column justify-content-between">
                                        <span class="card-title">Sara98</span>
                                        <p class="card-text">Mi piace molto il tuo stile!</p>
                                    </div>
                                </div>
                                <div class="comment-buttons-wrapper d-flex flex-row">
                                    <div class="d-flex flex-row justify-content-between align-items-center">
                                        <svg class="comment-button comment-like-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> 
                                            <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                        </svg>
                                        <span class="comment-like-counter">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-wrapper d-flex flex-row">
                            <div class="comment-user-image-wrapper d-flex align-items-start">
                                <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                            </div>
                            <div class="card-container d-flex flex-column">
                                <div class="card">
                                    <div class="card-body bg-dark d-flex flex-column justify-content-between">
                                        <span class="card-title">Celeste_</span>
                                        <p class="card-text">Beautiful!</p>
                                    </div>
                                </div>
                                <div class="comment-buttons-wrapper d-flex flex-row">
                                    <div class="d-flex flex-row justify-content-between align-items-center">
                                        <svg class="comment-button comment-like-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> 
                                            <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                        </svg>
                                        <span class="comment-like-counter">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-wrapper d-flex flex-row">
                            <div class="comment-user-image-wrapper d-flex align-items-start">
                                <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                </svg>
                            </div>
                            <div class="card-container d-flex flex-column">
                                <div class="card">
                                    <div class="card-body bg-dark d-flex flex-column justify-content-between">
                                        <span class="card-title">Robin42</span>
                                        <p class="card-text">Anch'io andavo a fare delle camminate nei boschi da piccolo. Comunque davvero un ottimo lavoro. Complimenti!</p>
                                    </div>
                                </div>
                                <div class="comment-buttons-wrapper d-flex flex-row">
                                    <div class="d-flex flex-row justify-content-between align-items-center">
                                        <svg class="comment-button comment-like-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"> 
                                            <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                        </svg>
                                        <span class="comment-like-counter">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export default Comments;