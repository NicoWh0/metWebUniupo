"use strict";

import { appState } from '../../app.js';
import API from '../../api.js';

class UploadModal {
    constructor() {
        this.tags = [];
    }

    render() {
        return `
            <div class="modal fade" id="uploadImage" tabindex="-1" aria-labelledby="uploadImageLabel">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="uploadImageLabel">Pubblica immagine</h1>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="upload-image-form">
                                <div class="form-group mb-3">
                                    <label for="image-title" class="col-form-label">Titolo<span class="text-danger">*</span>:</label>
                                    <input type="text" class="form-control" id="image-title" maxlength="24" minlength="5" pattern="[a-zA-Z0-9_ ]{5,24}" required>
                                    <div class="form-text" style="color: #808080;">
                                        Il titolo deve essere lungo dai 5 ai 24 caratteri e può contenere solo lettere, numeri, underscore e spazi.
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-description" class="col-form-label">Descrizione:</label>
                                    <textarea class="form-control" id="image-description" maxlength="128"></textarea>
                                    <div class="form-text" style="color: #808080;">
                                        La descrizione deve essere lunga al massimo 128 caratteri.
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="categoryDropdown1" class="col-form-label">Categoria 1 (obbligatoria)<span class="text-danger">*</span>:</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="categoryDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="categoryMenu1">
                                            
                                        </ul>
                                        <input type="hidden" id="selectedCategory1" name="category1" required>
                                    </div>
                                </div>
                                <div class="form-group mb-3" id="category2-container" style="display: none;">
                                    <label for="categoryDropdown2" class="col-form-label">Categoria 2 (opzionale):</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="categoryDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="categoryMenu2">
                                            <li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>
                                            <!-- Options will be populated dynamically -->
                                        </ul>
                                        <input type="hidden" id="selectedCategory2" name="category2">
                                    </div>
                                </div>
                                <div class="form-group mb-3" id="category3-container" style="display: none;">
                                    <label for="categoryDropdown3" class="col-form-label">Categoria 3 (opzionale):</label>
                                    <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle w-100 text-center category-dropdown" type="button" id="categoryDropdown3" data-bs-toggle="dropdown" aria-expanded="false">
                                            Seleziona una categoria
                                        </button>
                                        <ul class="dropdown-menu w-100 category-menu" id="categoryMenu3">
                                            <li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>
                                            <!-- Options will be populated dynamically -->
                                        </ul>
                                        <input type="hidden" id="selectedCategory3" name="category3">
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-file" class="col-form-label">Seleziona immagine<span class="text-danger">*</span>:</label>
                                    <input type="file" class="form-control" id="image-file" accept="image/png, image/jpeg" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-tags" class="col-form-label">Tags (max 16):</label>
                                    <input type="text" class="form-control" id="image-tags" placeholder="Aggiungi un tag e premi Invio" maxlength="16" minlength="3" pattern="[a-zA-Z0-9_]{3,16}">
                                    <div class="form-text" style="color: #808080;">
                                        Il tag deve essere lungo dai 3 ai 16 caratteri e può contenere solo lettere, numeri e underscore.
                                    </div>
                                    <div id="tags-container" class="mt-2"></div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button id="upload-image-button" type="submit" form="upload-image-form" class="btn btn-primary submit-button" disabled>Pubblica</button>
                        </div>
                    </div>
                </div>
            </div>       
        `
    }

    attachEventListeners() {
        const modal = document.getElementById('uploadImage');
        const form = document.getElementById('upload-image-form');
        const titleInput = document.getElementById('image-title');
        const tagInput = document.getElementById('image-tags');
        const tagsContainer = document.getElementById('tags-container');
        const imageFile = document.getElementById('image-file');

        modal.addEventListener('hidden.bs.modal', () => {
            this.clearForm();
        });

        // Tag input handling
        tagInput.addEventListener('keyup', (e) => this.handleTagInput(e, tagsContainer));

        

        // Category selection handling
        this.setupCategorySelectors();

        const disableSubmitButton = () => {
            const submitButton = document.getElementById('upload-image-button');
            submitButton.disabled = !form.checkValidity() || document.getElementById('selectedCategory1').value === '';
        }

        //Enable submit button only if all fields are valid
        modal.addEventListener('shown.bs.modal', disableSubmitButton);
        form.addEventListener('categoryChange', disableSubmitButton);
        titleInput.addEventListener('input', disableSubmitButton);
        imageFile.addEventListener('change', disableSubmitButton);

        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent form submission on enter
        form.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
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

    addTag(tag, container) {
        this.tags.push(tag);
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
            1: document.getElementById('categoryMenu1'),
            2: document.getElementById('categoryMenu2'),
            3: document.getElementById('categoryMenu3')
        };
        const buttons = {
            1: document.getElementById('categoryDropdown1'),
            2: document.getElementById('categoryDropdown2'),
            3: document.getElementById('categoryDropdown3')
        };
        const inputs = {
            1: document.getElementById('selectedCategory1'),
            2: document.getElementById('selectedCategory2'),
            3: document.getElementById('selectedCategory3')
        };

        // Setup event listeners for each menu
        Object.entries(menus).forEach(([level, menu]) => {
            menu.addEventListener('click', (e) => {
                if (e.target.classList.contains('category-option')) {
                    this.handleCategorySelection(e, parseInt(level), buttons, inputs, menus);
                    document.getElementById('upload-image-form').dispatchEvent(new CustomEvent('categoryChange', { 
                        detail: { 
                            level: parseInt(level),
                            value: e.target.getAttribute('data-value')
                        } 
                    }));
                }
            });
        });

        // Initialize the menus
        this.populateCategoryMenu(menus[1], null, true);
        this.populateCategoryMenu(menus[2], null, false);
        this.populateCategoryMenu(menus[3], null, false);
    }

    handleCategorySelection(e, level, buttons, inputs, menus) {
        e.preventDefault();
        const selectedValue = e.target.getAttribute('data-value');
        const selectedText = e.target.textContent.trim();
        const selectedBackground = e.target.style.getPropertyValue('--background');
        
        buttons[level].textContent = selectedText;
        buttons[level].style.setProperty('--background', selectedBackground);
        inputs[level].value = selectedValue;
        
        if (level === 1) {
            document.getElementById('category2-container').style.display = 'block'; 
        }
        else if (level === 2) {
            document.getElementById('category3-container').style.display = 'block';
            // Populate second and third with side categories
            this.populateCategoryMenu(menus[3], selectedValue, false);
        } else if (level === 3) {
            document.getElementById('category3-container').style.display = 'block';
            this.populateCategoryMenu(menus[2], selectedValue, false);
        }
    }

    populateCategoryMenu(menu, excludeValue = '', isMainCategory = false) {
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

    async handleSubmit(e) {
        e.preventDefault();

        const imageFile = document.getElementById('image-file').files[0];
        const title = document.getElementById('image-title').value;
        const description = document.getElementById('image-description').value;
        const tags = this.tags;
        
        // Collect selected categories
        const categories = [];
        for (let i = 1; i <= 3; i++) {
            const value = document.getElementById(`selectedCategory${i}`).value;
            if (value) categories.push(value);
        }

        // Prepare the data object
        const formData = new FormData();
        formData.append('imageFile', imageFile); // Append the file
        formData.append('title', title);
        formData.append('description', description ?? '');
        categories.forEach(cat => formData.append("categories[]", cat));
        tags.forEach(tag => formData.append("tags[]", tag));

        try {
            // Send the data to the server
            const newId = await API.uploadImage(formData);
            
            // Show success message
            this.showSuccessMessage('Immagine caricata con successo!');

            // Clear the form fields
            this.clearForm();

            // Redirect to page with new image
            setTimeout(() => {
                window.location.href = `/image/${newId}`;
            }, 1000);

        } catch (error) {
            console.error('Upload failed:', error);
            
            // Create and append the error message
            this.showErrorMessage(error.message || 'Caricamento fallito. Riprova più tardi.');
        }
    }

    showSuccessMessage(message) {
        // Create a div for the success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3'; // Bootstrap alert class
        successDiv.textContent = message;

        // Append the success message to the modal body
        const modalBody = document.querySelector('#uploadImage .modal-body');
        modalBody.appendChild(successDiv);

        // Optionally, remove the success message after a certain time
        setTimeout(() => {
            successDiv.remove();
        }, 10000); // Remove after 10 seconds
    }

    clearForm() {
        // Clear the form fields
        document.getElementById('upload-image-form').reset();
        this.tags = []; 

        // Clear displayed tags in the UI
        const tagsContainer = document.getElementById('tags-container');
        tagsContainer.innerHTML = ''; 

        // Reset category selections
        for (let i = 1; i <= 3; i++) {
            const categoryButton = document.getElementById(`categoryDropdown${i}`);
            const selectedCategoryInput = document.getElementById(`selectedCategory${i}`);
            selectedCategoryInput.value = '';
            categoryButton.textContent = 'Seleziona una categoria'; 
            categoryButton.style.setProperty('--background', 'none');
        }

        // Hide side category containers
        for (let i = 2; i <= 3; i++) {
            document.getElementById(`category${i}-container`).style.display = 'none';
        }
    }

    showErrorMessage(message) {
        // Create a div for the error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3'; // Bootstrap alert class
        errorDiv.textContent = message;
    
        // Append the error message to the modal body
        const modalBody = document.querySelector('#uploadImage .modal-body');
        modalBody.appendChild(errorDiv);
    
        // Optionally, remove the error message after a certain time
        setTimeout(() => {
            errorDiv.remove();
        }, 10000); // Remove after 10 seconds
    }
}

export default UploadModal;