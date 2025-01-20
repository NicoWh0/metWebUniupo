"use strict";

class EditCommentModal {
    
    render() {
        return `
            <div class="modal fade" id="editComment" tabindex="-1" aria-labelledby="editCommentLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="editCommentLabel">Modifica commento (max 300 caratteri)</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="message-text-comment" class="col-form-label">Testo Commento:</label>
                                    <textarea class="form-control" id="message-text-comment">Grazie a tutti!</textarea>
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
        `;
    }
}

export default EditCommentModal;