"use strict";

import { appState } from '../../app.js';

class UploadModal {
    constructor() {
        this.tags = [];
    }

    render() {
        return `
            <div class="modal fade" id="uploadImage" tabindex="-1" aria-labelledby="uploadImageLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="uploadImageLabel">Pubblica immagine</h1>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="upload-image-form">
                                <div class="form-group mb-3">
                                    <label for="image-title" class="col-form-label">Titolo*:</label>
                                    <input type="text" class="form-control" id="image-title" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-description" class="col-form-label">Descrizione:</label>
                                    <textarea class="form-control" id="image-description"></textarea>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-category" class="col-form-label">Categoria 1 (obbligatoria):</label>
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
                                    <label for="image-category" class="col-form-label">Categoria 2 (opzionale):</label>
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
                                    <label for="image-category" class="col-form-label">Categoria 3 (opzionale):</label>
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
                                    <label for="image-file" class="col-form-label">Seleziona immagine:</label>
                                    <input type="file" class="form-control" id="image-file" accept="image/*" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="image-tags" class="col-form-label">Tags (max 10):</label>
                                    <input type="text" class="form-control" id="image-tags" placeholder="Aggiungi un tag e premi Enter">
                                    <div id="tags-container" class="mt-2"></div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button type="submit" form="upload-image-form" class="btn btn-primary submit-button">Pubblica</button>
                        </div>
                    </div>
                </div>
            </div>       
        `
    }

    attachEventListeners() {
        const form = document.getElementById('upload-image-form');
        const tagInput = document.getElementById('image-tags');
        const tagsContainer = document.getElementById('tags-container');

        // Tag input handling
        tagInput.addEventListener('keyup', (e) => this.handleTagInput(e, tagsContainer));

        // Category selection handling
        this.setupCategorySelectors();

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
            const tag = e.target.value.trim();
            if (tag && this.tags.length < 10 && !this.tags.includes(tag)) {
                this.addTag(tag, tagsContainer);
                e.target.value = '';
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
        const formData = new FormData();
        formData.append('title', document.getElementById('image-title').value);
        formData.append('description', document.getElementById('image-description').value);
        formData.append('imageFile', document.getElementById('image-file').files[0]);
        formData.append('tags', JSON.stringify(this.tags));
        
        // Collect selected categories
        const categories = [];
        for (let i = 1; i <= 3; i++) {
            const value = document.getElementById(`selectedCategory${i}`).value;
            if (value) categories.push(value);
        }
        formData.append('categories', JSON.stringify(categories));

        try {
            // Here you would call your API to upload the image
            console.log('Form data ready for submission:', formData);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
}

export default UploadModal;