'use strict';
const tags = [];

document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('image-tags');
    const tagsContainer = document.getElementById('tags-container');
    const form = document.getElementById('upload-image-form');
    const categoryItems1 = document.querySelectorAll('#categoryMenu1 .category-option');
    const categoryButton1 = document.getElementById('categoryDropdown1');
    const selectedCategoryInput1 = document.getElementById('selectedCategory1');

    const categoryItems2 = document.querySelectorAll('#categoryMenu2 .category-option');
    const categoryButton2 = document.getElementById('categoryDropdown2');
    const selectedCategoryInput2 = document.getElementById('selectedCategory2');

    const categoryItems3 = document.querySelectorAll('#categoryMenu3 .category-option');
    const categoryButton3 = document.getElementById('categoryDropdown3');
    const selectedCategoryInput3 = document.getElementById('selectedCategory3');

    const categories = [
        { value: 'Fotografia', text: 'Fotografia', img: '/img/update_category/fotografia.jpg'},
        { value: 'Pittura', text: 'Pittura', img: '/img/update_category/disegno.jpg' },
        { value: 'Disegno', text: 'Disegno', img: '/img/update_category/pittura.jpg' }
    ];

    const categoryMenu1 = document.getElementById('categoryMenu1');
    const categoryMenu2 = document.getElementById('categoryMenu2');
    const categoryMenu3 = document.getElementById('categoryMenu3');

    tagInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = this.value.trim();
            console.log('Current tags:', tags); // Log current tags
            if (tag && tags.length < 10 && !tags.includes(tag)) {
                console.log('Lunghezza tags:', tags.length, ' Aggiunto tag:', tag);
                addTag(tag);
                this.value = '';
            } else {
                console.log('Tag not added. Reason:', 
                    !tag ? 'Empty tag' : 
                    tags.length >= 10 ? 'Max tags reached' : 
                    'Tag already exists');
            }
        }
    });

    function addTag(tag) {
        tags.push(tag);
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
            <span class="tag-text">${tag}</span>
            <span class="tag-close">&times;</span>
        `;
        tagsContainer.appendChild(tagElement);

        tagElement.querySelector('.tag-close').addEventListener('click', function() {
            tagsContainer.removeChild(tagElement);
            const index = tags.indexOf(tag);
            if (index > -1) {
                tags.splice(index, 1);
            }
            console.log('Tag removed. Current tags:', tags); // Log after removal
        });
    }

    form.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the form data to your server
        console.log('Form submitted');
        console.log('Title:', document.getElementById('image-title').value);
        console.log('Description:', document.getElementById('image-description').value);
        console.log('Category:', document.getElementById('image-category').value);
        console.log('File:', document.getElementById('image-file').files[0]);
        console.log('Tags:', tags);
    });

    categoryMenu1.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-option')) {
            e.preventDefault();
            const selectedValue = e.target.getAttribute('data-value');
            const selectedText = e.target.textContent.trim();
            
            categoryButton1.textContent = selectedText;
            selectedCategoryInput1.value = selectedValue;
            
            // Show the second category dropdown
            document.getElementById('category2-container').style.display = 'block';
            populateCategoryMenu(categoryMenu2, selectedValue, selectedCategoryInput3.value);
            populateCategoryMenu(categoryMenu3, selectedValue, selectedCategoryInput2.value);
        }
    });

    categoryMenu2.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-option')) {
            e.preventDefault();
            const selectedValue = e.target.getAttribute('data-value');
            const selectedText = e.target.textContent.trim();
            
            categoryButton2.textContent = selectedText;
            selectedCategoryInput2.value = selectedValue;
            
            // Show the third category dropdown
            document.getElementById('category3-container').style.display = 'block';
            populateCategoryMenu(categoryMenu3, selectedCategoryInput1.value, selectedValue);
            populateCategoryMenu(categoryMenu1, selectedCategoryInput2.value, selectedValue, false);
        }
    });

    categoryMenu3.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-option')) {
            e.preventDefault();
            const selectedValue = e.target.getAttribute('data-value');
            const selectedText = e.target.textContent.trim();
            
            categoryButton3.textContent = selectedText;
            selectedCategoryInput3.value = selectedValue;
            populateCategoryMenu(categoryMenu2, selectedCategoryInput1.value, selectedValue);
            populateCategoryMenu(categoryMenu1, selectedCategoryInput2.value, selectedValue, false);
        }
    });

    function populateCategoryMenu(menu, excludeValue1, excludeValue2 = '', noneOption = true) {
        menu.innerHTML = noneOption ? '<li><a class="dropdown-item category-option" href="#" data-value="">Nessuna</a></li>' : '';
        categories.forEach(category => {
            if (category.value !== excludeValue1 && category.value !== excludeValue2) {
                const li = document.createElement('li');
                li.innerHTML = `<a class="dropdown-item category-option" href="#" style="--background: url(${category.img})" data-value="${category.value}">${category.text}</a>`;
                menu.appendChild(li);
            }
        });
    }
});
