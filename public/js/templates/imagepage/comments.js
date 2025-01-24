"use strict";

import { appState } from "../../app.js";
import API from "../../api.js";

class Comments {
    constructor(comments, imageId) {
        this.comments = comments;
        this.imageId = imageId;
    }

    render() {
        return `
            <div id="comments-section" class="row d-flex flex-column justify-content-around" aria-hidden="false">
                <div id="comments-title-container" class="d-flex flex-column justify-content-between">
                    <h1 id="comments-title">Commenti</h1>
                    <div id="comment-form-group" class="input-group d-flex flex-row">
                        <div class="comment-user-image-wrapper d-flex align-items-start justify-content-start">
                            <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                        </div>
                        <textarea id="comment-form" 
                            class="form-control" 
                            aria-describedby="commentBlock" 
                            placeholder="Inserisci un commento (max 128 caratteri)" 
                            maxlength="128" 
                            minlength="1"
                            ${!appState.auth.isLoggedIn ? 'readonly' : ''}></textarea>  
                    </div>
                </div>
                <div class="d-flex flex-column">
                    <div id="comments-column" class="d-flex flex-column">
                        ${this.#renderComments()}
                    </div>
                </div>
            </div>
        `;
    }

    #renderComments() {
        return this.comments.length > 0 ?
            this.comments.map(comment => this.#renderComment(comment)).join('') : this.#renderNoComments();
    }

    attachEventListeners() {
        const commentForm = document.getElementById('comment-form');
        
        if (commentForm) {
            // Handle focus event
            commentForm.addEventListener('click', () => {
                if (!appState.auth.isLoggedIn) {
                    // If user is not logged in, show login modal
                    const loginModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal'));
                    loginModal.show();
                    commentForm.blur(); // Remove focus from textarea
                }
            });

            commentForm.addEventListener('focus', () => {
                if (!appState.auth.isLoggedIn) {
                    //Prevent focus if user is not logged in
                    commentForm.blur(); 
                }
            });

            // Handle keyup event for logged-in users
            commentForm.addEventListener('keyup', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey && appState.auth.isLoggedIn) {
                    e.preventDefault();
                    
                    const content = commentForm.value.trim();
                    if (content.length === 0) return;

                    try {
                        // Send comment to server
                        const newCommentId = await API.addComment(this.imageId, content);

                        const newComment = {
                            Id: newCommentId,
                            Content: content,
                            Username: appState.auth.user.username,
                            UploadDate: new Date().toISOString(),
                            UserId: appState.auth.user.id,
                            editable: true,
                            liked: false,
                            Likes: 0
                        }
                        
                        // Clear textarea
                        commentForm.value = '';

                        // Add new comment to UI
                        const commentsColumn = document.getElementById('comments-column');

                        // If there were no comments, delete the "no comments" message
                        if (document.getElementById('no-comments-message')) {
                            document.getElementById('no-comments-message').remove();
                        }

                        // Add the new comment to the beginning of the list
                        commentsColumn.insertAdjacentHTML('afterbegin', this.#renderComment(newComment));

                        //Add the new comment to the comments array
                        if(this.comments && this.comments.length > 0) this.comments.push(newComment);
                        else this.comments = [newComment];

                        //Add event listeners for the new comment
                        this.#addEditCommentEventListener(commentsColumn.firstElementChild.querySelector('.comment-edit-button'));
                        this.#addLikeCommentEventListener(commentsColumn.firstElementChild.querySelector('.comment-like-button'));

                    } catch (error) {
                        console.error('Error adding comment:', error);
                        // Show error message
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'alert alert-danger mt-2';
                        errorDiv.textContent = error.message || 'Errore durante l\'invio del commento. Riprova.';
                        commentForm.parentNode.insertAdjacentElement('afterend', errorDiv);

                        // Remove error message after 3 seconds
                        setTimeout(() => {
                            errorDiv.remove();
                        }, 3000);
                    }
                }
            });
        }

        // Add event listeners for edit buttons
        document.querySelectorAll('.comment-edit-button').forEach(editButton => {
            this.#addEditCommentEventListener(editButton);
        });

        // Add event listeners for like buttons
        document.querySelectorAll('.comment-like-button').forEach(likeButton => {
            this.#addLikeCommentEventListener(likeButton);
        });
    }

    #renderComment(comment) {
        return `
            <div class="comment-wrapper d-flex flex-row" data-comment-id="${comment.Id}">
                <div class="comment-user-image-wrapper d-flex align-items-start">
                    <svg class="comment-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                </div>
                <div class="card-container d-flex flex-column">
                    <div class="card">
                        <div class="card-body bg-dark d-flex flex-column justify-content-between">
                            <span class="card-title"><a href="/user/${comment.UserId}">${comment.Username}</a></span>
                            <p class="card-text">${comment.Content}</p>
                        </div>
                    </div>
                    <div class="comment-buttons-wrapper d-flex flex-row">
                        ${comment.editable ? `
                            <svg 
                                class="comment-button comment-edit-button" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 16 16" 
                                data-bs-toggle="modal" 
                                data-bs-target="#editComment"
                            >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        ` : ''}
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <svg class="comment-button comment-like-button${comment.liked ? ' liked' : ''}" 
                                 data-comment-id="${comment.Id}"
                                 xmlns="http://www.w3.org/2000/svg" 
                                 viewBox="0 0 32 32"> 
                                <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                            </svg>
                            <span class="comment-like-counter" data-comment-id="${comment.Id}">${comment.Likes || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    #renderNoComments() {
        return `
            <div id="no-comments-message" class="d-flex flex-column align-items-center justify-content-center w-100">
                <p class="text-center"><em>Ancora nessun commento disponibile</em></p>
                <p class="text-center"><em>Sii il primo a commentare questa immagine!</em></p>
            </div>
        `;
    }

    #addEditCommentEventListener(editButton) {
        editButton.addEventListener('click', () => {
            const commentWrapper = editButton.closest('.comment-wrapper');
            const commentId = commentWrapper.dataset.commentId;
            const commentText = commentWrapper.querySelector('.card-text').textContent;
            
            // Get edit modal instance
            const editModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editComment'));
            
            // Set callbacks
            editModal._element.querySelector('.modal-content').__component.onCommentUpdated = (_, newText) => {
                commentWrapper.querySelector('.card-text').textContent = newText;
                //show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success mt-2';
                successDiv.textContent = 'Commento modificato con successo.';
                commentWrapper.querySelector('.card-container').insertAdjacentElement('beforeend', successDiv);
                setTimeout(() => {
                    successDiv.remove();
                }, 4000);
            };
            
            editModal._element.querySelector('.modal-content').__component.onCommentDeleted = (_) => {
                commentWrapper.remove();
                
                //show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-warning mt-2 w-75';
                successDiv.textContent = 'Commento eliminato con successo.';
                document.getElementById('comments-title-container').insertAdjacentElement('afterend', successDiv);
                setTimeout(() => {
                    successDiv.remove();
                }, 4000);

                // If no more comments, show the "no comments" message
                if (document.querySelectorAll('.comment-wrapper').length === 0) {
                    document.getElementById('comments-column').innerHTML = this.#renderNoComments();
                }
            };
            
            // Set current comment data
            editModal._element.querySelector('.modal-content').__component.setCommentData(commentId, this.imageId, commentText);

            document.getElementById('deleteCommentConfirmModal').setAttribute('data-image-id', this.imageId);
            document.getElementById('deleteCommentConfirmModal').setAttribute('data-comment-id', commentId);

            // Show modal
            editModal.show();
        });
    }

    #addLikeCommentEventListener(likeButton) {
        likeButton.addEventListener('click', async () => {
            if (!appState.auth.isLoggedIn) {
                // If user is not logged in, show login modal
                const loginModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal'));
                loginModal.show();
                return;
            }

            const commentId = likeButton.dataset.commentId;
            const likeCounter = document.querySelector(`.comment-like-counter[data-comment-id="${commentId}"]`);
            const comment = this.comments.find(c => c.Id.toString() === commentId);
            if (!comment) return;

            try {
                // Toggle like status
                const newLikeStatus = !comment.liked;
                
                // Optimistic UI update
                comment.liked = newLikeStatus;
                likeButton.classList.toggle('liked');
                const currentLikes = parseInt(likeCounter.textContent);
                likeCounter.textContent = currentLikes + (newLikeStatus ? 1 : -1);

                // Make API request
                if (newLikeStatus) {
                    await API.likeComment(this.imageId, commentId);
                } else {
                    await API.unlikeComment(this.imageId, commentId);
                }

            } catch (error) {
                console.error('Error toggling comment like:', error);
                // Revert UI changes if API call fails
                comment.liked = !comment.liked;
                likeButton.classList.toggle('liked');
                const currentLikes = parseInt(likeCounter.textContent);
                likeCounter.textContent = currentLikes + (comment.liked ? 1 : -1);

                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-2';
                errorDiv.textContent = error.message || 'Errore durante l\'aggiornamento del like. Riprova.';
                likeButton.parentNode.insertAdjacentElement('afterend', errorDiv);

                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
        });
    }


}

export default Comments;