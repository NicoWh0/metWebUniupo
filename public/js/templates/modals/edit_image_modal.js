"use strict";

import { appState } from '../../app.js';
import API from '../../api.js';

class EditImageModal {
    constructor(imageData) {
        this.id = imageData.id;
        this.title = imageData.title;
        this.description = imageData.description;
        this.categories = imageData.categories;
        this.tags = imageData.tags;
    }
    
    render() {
        return `
            <div class="modal fade" id="editImage" tabindex="-1" aria-labelledby="editImageLabel">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="editImageLabel">Modifica immagine</h1>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-image-form">
                                <div class="form-group mb-3">
                                    <label for="edit-image-title" class="col-form-label">Titolo<span class="text-danger">*</span>:</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="edit-image-title" 
                                        maxlength="24" 
                                        minlength="5" 
                                        pattern="[a-zA-Z0-9_ ]{5,24}" 
                                        required 
                                        value="${this.title ?? ''}"
                                    >
                                    <div class="form-text" style="color: #808080;">
                                        Il titolo deve essere lungo dai 5 ai 24 caratteri e può contenere solo lettere, numeri, underscore e spazi.
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="edit-image-description" class="col-form-label">Descrizione:</label>
                                    <textarea class="form-control" id="edit-image-description" maxlength="128">${this.description ?? ''}</textarea>
                                    <div class="form-text" style="color: #808080;">
                                        La descrizione deve essere lunga al massimo 128 caratteri.
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="editCategoryDropdown1" class="col-form-label">Categoria 1 (obbligatoria)<span class="text-danger">*</span>:</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="editCategoryDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="editCategoryMenu1">
                                            
                                        </ul>
                                        <input type="hidden" id="editSelectedCategory1" name="category1" required>
                                    </div>
                                </div>
                                <div class="form-group mb-3" id="edit-category2-container">
                                    <label for="editCategoryDropdown2" class="col-form-label">Categoria 2 (opzionale):</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="editCategoryDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="editCategoryMenu2">
                                            <li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>
                                            <!-- Options will be populated dynamically -->
                                        </ul>
                                        <input type="hidden" id="editSelectedCategory2" name="category2">
                                    </div>
                                </div>
                                <div class="form-group mb-3" id="edit-category3-container">
                                    <label for="editCategoryDropdown3" class="col-form-label">Categoria 3 (opzionale):</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="editCategoryDropdown3" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="editCategoryMenu3">
                                            <li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>
                                            <!-- Options will be populated dynamically -->
                                        </ul>
                                        <input type="hidden" id="editSelectedCategory3" name="category3">
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="edit-image-tags" class="col-form-label">Tags (max 16):</label>
                                    <input type="text" class="form-control" id="edit-image-tags" placeholder="Aggiungi un tag e premi Invio" maxlength="16" minlength="3" pattern="[a-zA-Z0-9_]{3,16}">
                                    <div class="form-text" style="color: #808080;">
                                        Il tag deve essere lungo dai 3 ai 16 caratteri e può contenere solo lettere, numeri e underscore.
                                    </div>
                                    <div id="edit-tags-container" class="mt-2"></div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button id="delete-image-button" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">Elimina</button>
                            <button id="edit-image-button" type="submit" form="edit-image-form" class="btn btn-primary submit-button" disabled>Modifica</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteConfirmModalLabel">Conferma eliminazione</h5>
                            <button id="dismiss-delete-button-header" type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Sei sicuro di voler eliminare questa immagine? Questa azione non può essere annullata.
                        </div>
                        <div class="modal-footer">
                            <button id="dismiss-delete-button" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button id="confirm-delete-button" type="button" class="btn btn-danger">Elimina</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    attachEventListeners() {
        const modal = document.getElementById('editImage');
        const form = document.getElementById('edit-image-form');
        const titleInput = document.getElementById('edit-image-title');
        const tagInput = document.getElementById('edit-image-tags');
        const tagsContainer = document.getElementById('edit-tags-container');

        // Tag input handling
        tagInput.addEventListener('keyup', (e) => this.handleTagInput(e, tagsContainer));

        // Category selection handling
        this.setupCategorySelectors();

        // Populate tags
        this.populateEditTagsMenu();

        const disableSubmitButton = () => {
            const submitButton = document.getElementById('edit-image-button');
            submitButton.disabled = !form.checkValidity() || document.getElementById('editSelectedCategory1').value === '';
        }

        //Enable submit button only if all fields are valid
        modal.addEventListener('shown.bs.modal', disableSubmitButton);
        form.addEventListener('editCategoryChange', disableSubmitButton);
        titleInput.addEventListener('input', disableSubmitButton);

        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent form submission on enter
        form.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });

        // Add delete confirmation handler
        const confirmDeleteButton = document.getElementById('confirm-delete-button');
        if (confirmDeleteButton) {
            confirmDeleteButton.addEventListener('click', async () => {
                try {
                    confirmDeleteButton.disabled = true;
                    confirmDeleteButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Eliminazione...';

                    // Call API to delete image
                    await API.deleteImage(this.id);

                    // Close both modals
                    const editModal = bootstrap.Modal.getInstance(document.getElementById('editImage'));
                    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
                    editModal.hide();
                    deleteModal.hide();

                    // Redirect to home page or refresh
                    window.location.href = '/';

                } catch (error) {
                    console.error('Error deleting image:', error);
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger mt-3';
                    errorDiv.textContent = error.message || 'Errore durante l\'eliminazione. Riprova.';
                    document.querySelector('#deleteConfirmModal .modal-body').appendChild(errorDiv);

                    // Remove error message after 3 seconds
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 3000);

                } finally {
                    confirmDeleteButton.disabled = false;
                    confirmDeleteButton.innerHTML = 'Elimina';
                }
            });
        }

        const dismissDeleteModal = () => {
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            deleteModal.hide();
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editImage'));
            editModal.show();
        }

        // Dismiss delete modal
        const dismissDeleteButton = document.getElementById('dismiss-delete-button');
        const dismissDeleteButtonHeader = document.getElementById('dismiss-delete-button-header');
        if (dismissDeleteButton) {
            dismissDeleteButton.addEventListener('click', dismissDeleteModal);
        }
        if (dismissDeleteButtonHeader) {
            dismissDeleteButtonHeader.addEventListener('click', dismissDeleteModal);
        }
    }

    handleTagInput(e, tagsContainer) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = e.target.value.trim().toLowerCase();
            if(tag.match(/^[a-zA-Z0-9_]{3,16}$/)) {
                if (tag && this.tags.length < 16 && !this.tags.includes(tag)) {
                    this.addTag(tag, tagsContainer);
                    e.target.value = '';
                }
            }
        }
    }

    addTag(tag, container, newTag = true) {
        if(newTag) this.tags.push(tag);
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
            <span class="tag-text">${tag}</span>
            <span class="tag-close">&times;</span>
        `;
        container.appendChild(tagElement);

        tagElement.querySelector('.tag-close').addEventListener('click', () => {
            container.removeChild(tagElement);
            const index = this.tags.indexOf(tag);
            if (index > -1) {
                this.tags.splice(index, 1);
            }
        });
    }

    setupCategorySelectors() {
        const menus = {
            1: document.getElementById('editCategoryMenu1'),
            2: document.getElementById('editCategoryMenu2'),
            3: document.getElementById('editCategoryMenu3')
        };
        const buttons = {
            1: document.getElementById('editCategoryDropdown1'),
            2: document.getElementById('editCategoryDropdown2'),
            3: document.getElementById('editCategoryDropdown3')
        };
        const inputs = {
            1: document.getElementById('editSelectedCategory1'),
            2: document.getElementById('editSelectedCategory2'),
            3: document.getElementById('editSelectedCategory3')
        };

        // Initialize the menus
        this.populateEditCategoryMenu(menus[1], null, true);
        this.populateEditCategoryMenu(menus[2], null, false);
        this.populateEditCategoryMenu(menus[3], null, false);

        // Set initial values from existing categories
        if (this.categories && this.categories.length > 0) {

            // Set each category
            this.categories.forEach((categoryName, index) => {
                const level = index + 1;
                
                // For first level, search in mainCategories
                const category = level === 1 ? 
                    appState.mainCategories.find(cat => cat.name === categoryName) :
                    appState.categories.find(cat => cat.name === categoryName);
                
                if (category) {
                    // Update button text and background
                    buttons[level].textContent = category.name;
                    buttons[level].style.setProperty('--background', `url(/${category.iconPath})`);
                    
                    // Update hidden input
                    inputs[level].value = category.id;

                    // Update the next category menu
                    if (level === 2) {
                        this.populateEditCategoryMenu(menus[3], category.id, false);
                    } else if (level === 3) {
                        this.populateEditCategoryMenu(menus[2], category.id, false);
                    }
                }
            });
        }

        // Setup event listeners for each menu
        Object.entries(menus).forEach(([level, menu]) => {
            menu.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-option')) {
                    this.handleCategorySelection(e, parseInt(level), buttons, inputs, menus);
                    document.getElementById('edit-image-form').dispatchEvent(new CustomEvent('editCategoryChange', { 
                        detail: { 
                            level: parseInt(level),
                            value: e.target.getAttribute('data-value')
                        } 
                    }));
                }
            });
        });
    }

    handleCategorySelection(e, level, buttons, inputs, menus) {
        e.preventDefault();
        const selectedValue = e.target.getAttribute('data-value');
        const selectedText = e.target.textContent.trim();
        const selectedBackground = e.target.style.getPropertyValue('--background');
        
        buttons[level].textContent = selectedText;
        buttons[level].style.setProperty('--background', selectedBackground);
        inputs[level].value = selectedValue;
        
        if (level === 2) {
            this.populateEditCategoryMenu(menus[3], selectedValue, false);
        } else if (level === 3) {
            this.populateEditCategoryMenu(menus[2], selectedValue, false);
        }
    }

    populateEditCategoryMenu(menu, excludeValue = '', isMainCategory = false) {
        const categories = appState.categories;
        const mainCategoriesName = appState.mainCategories.map(cat => cat.name);
        
        menu.innerHTML = !isMainCategory ? 
            '<li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>' : '';
        
        // Filter categories based on whether we're populating main or side categories
        const categoriesToShow = categories.filter((category) => {
            if (isMainCategory) {
                // For main category (first), show only main categories
                return mainCategoriesName.includes(category.name);
            } else {
                // For side categories (second and third), exclude:
                // 1. Main categories
                // 2. First selected category
                // 3. Second/Third selected category (if any)
                const isMainCategory = mainCategoriesName.includes(category.name);
                const isExcluded = category.id.toString() === excludeValue;

                
                return !isMainCategory && !isExcluded;
            }
        });
        
        categoriesToShow.forEach((category) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a class="dropdown-item category-option" 
                   href="#" 
                   style="--background: url(/${category.iconPath})" 
                   data-value="${category.id}">
                    ${category.name}
                </a>`;
            menu.appendChild(li);
        });
    }

    populateEditTagsMenu() {
        const tagsContainer = document.getElementById('edit-tags-container');
        tagsContainer.innerHTML = '';
        this.tags.forEach(tag => {
            this.addTag(tag, tagsContainer, false);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('edit-image-title').value;
        const description = document.getElementById('edit-image-description').value;
        const tags = this.tags;
        
        // Collect selected categories
        const categories = [];
        for (let i = 1; i <= 3; i++) {
            const value = document.getElementById(`editSelectedCategory${i}`).value;
            if (value) categories.push(value);
        }

        // Prepare the data object
        const dataToSend = {
            title: title,
            description: description?.length > 0 ? description : '',
            categories: categories,
            tags: tags
        };
        console.log(dataToSend);

        try {
            // Send the data to the server
            await API.editImage(this.id, dataToSend);
            console.log('Edit successful');
            
            // Show success message
            this.showSuccessMessage('Modifica effettuata con successo!');

            // Reload the page after 500ms
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Edit failed:', error);
            
            // Create and append the error message
            this.showErrorMessage(error.message || 'Modifica fallita. Si prega di riprovare.');
        }
    }

    showSuccessMessage(message) {
        // Create a div for the success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3'; // Bootstrap alert class
        successDiv.textContent = message;

        // Append the success message to the modal body
        const modalBody = document.querySelector('#editImage .modal-body');
        modalBody.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000); // Remove after 5 seconds
    }

    showErrorMessage(message) {
        // Create a div for the error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3'; // Bootstrap alert class
        errorDiv.textContent = message;
    
        // Append the error message to the modal body
        const modalBody = document.querySelector('#editImage .modal-body');
        modalBody.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 10000); // Remove after 10 seconds
    }
}

export default EditImageModal;