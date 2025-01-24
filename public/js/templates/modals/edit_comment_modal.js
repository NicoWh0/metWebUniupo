"use strict";

import API from '../../api.js';

class EditCommentModal {
    constructor() {
        this.currentCommentId = null;
        this.imageId = null;
        this.commentText = '';
        this.onCommentUpdated = null;
        this.onCommentDeleted = null;
    }
    
    render() {
        return `
            <div class="modal fade" id="editComment" tabindex="-1" aria-labelledby="editCommentLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="editCommentLabel">Modifica commento</h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-comment-form">
                                <div class="form-group">
                                    <label for="message-text-comment" class="col-form-label">Testo Commento:</label>
                                    <textarea class="form-control" 
                                            id="message-text-comment" 
                                            maxlength="128" 
                                            minlength="1"
                                            required></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button type="button" class="btn btn-danger" id="delete-comment-btn">Elimina</button>
                            <button type="submit" form="edit-comment-form" class="btn btn-primary sign-in-up-btn">Salva modifiche</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="deleteCommentConfirmModal" tabindex="-1" aria-labelledby="deleteCommentConfirmModalLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="deleteCommentConfirmModalLabel">Conferma eliminazione</h1>
                            <button type="button" id="dismiss-delete-comment-button-header" class="btn-close btn-close-white" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Sei sicuro di voler eliminare questo commento?</p>
                            <p>Questa azione non può essere annullata.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="dismiss-delete-comment-button" class="btn btn-secondary">Annulla</button>
                            <button type="button" id="confirm-delete-comment-button" class="btn btn-danger">Elimina</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCommentData() {
        return {
            commentId: this.currentCommentId,
            imageId: this.imageId,
            commentText: this.commentText
        };
    }

    setCommentData(commentId, imageId, commentText) {
        this.currentCommentId = commentId;
        this.imageId = imageId;
        this.commentText = commentText;
        
        // Update textarea with current comment text
        const textarea = document.getElementById('message-text-comment');
        if (textarea) {
            textarea.value = this.commentText;
        }
    }

    attachEventListeners() {
        console.log("Attaching event listeners to edit comment modal");
        const editModal = document.getElementById('editComment');
        const form = document.getElementById('edit-comment-form');
        const deleteBtn = document.getElementById('delete-comment-btn');
        const deleteConfirmModal = document.getElementById('deleteCommentConfirmModal');

        // Handle form submission (edit comment)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = document.getElementById('message-text-comment');
            const newText = textarea.value.trim();

            if (newText === '') return;

            try {
                await API.updateComment(this.imageId, this.currentCommentId, newText);
                
                // Hide modal
                bootstrap.Modal.getInstance(editModal).hide();

                // Callback to update UI
                if (this.onCommentUpdated) {
                    this.onCommentUpdated(this.currentCommentId, newText);
                }
            } catch (error) {
                console.error('Error updating comment:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-2';
                errorDiv.textContent = error.message || 'Errore durante l\'aggiornamento del commento. Riprova.';
                form.appendChild(errorDiv);

                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);
            }
        });

        // Handle delete button click
        deleteBtn.addEventListener('click', () => {
            // Hide edit modal and show delete confirmation modal
            bootstrap.Modal.getInstance(editModal).hide();
            const deleteModal = bootstrap.Modal.getOrCreateInstance(deleteConfirmModal);
            deleteModal.show();
        });

        // Handle delete confirmation
        const confirmDeleteBtn = document.getElementById('confirm-delete-comment-button');
        confirmDeleteBtn.addEventListener('click', async () => {
            try {
                confirmDeleteBtn.disabled = true;
                confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Eliminazione...';
                
                const imageId = deleteConfirmModal.getAttribute('data-image-id');
                const commentId = deleteConfirmModal.getAttribute('data-comment-id');
                await API.deleteComment(imageId, commentId);
                
                // Hide delete confirmation modal
                const deleteModal = bootstrap.Modal.getInstance(deleteConfirmModal);
                deleteModal.hide();

                // Callback to update UI
                if (this.onCommentDeleted) {
                    this.onCommentDeleted(commentId);
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-2';
                errorDiv.textContent = error.message || 'Errore durante l\'eliminazione del commento. Riprova.';
                document.querySelector('#deleteCommentConfirmModal .modal-body').appendChild(errorDiv);

                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);
            } finally {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.innerHTML = 'Elimina';
            }
        });

        // Handle dismiss delete modal
        const dismissDeleteModal = () => {
            const deleteModal = bootstrap.Modal.getInstance(deleteConfirmModal);
            deleteModal.hide();
            bootstrap.Modal.getInstance(editModal).show();
        };

        const dismissDeleteBtn = document.getElementById('dismiss-delete-comment-button');
        const dismissDeleteBtnHeader = document.getElementById('dismiss-delete-comment-button-header');
        
        if (dismissDeleteBtn) {
            dismissDeleteBtn.addEventListener('click', dismissDeleteModal);
        }
        if (dismissDeleteBtnHeader) {
            dismissDeleteBtnHeader.addEventListener('click', dismissDeleteModal);
        }

        // Reset form when edit modal is hidden
        editModal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            this.currentCommentId = null;
            this.imageId = null;
            this.commentText = '';
        });

        deleteConfirmModal.addEventListener('hidden.bs.modal', () => {
            deleteConfirmModal.removeAttribute('data-comment-id');
            deleteConfirmModal.removeAttribute('data-image-id');
        });
    }
}

export default EditCommentModal;