"use strict";

import API from '../../api.js';

class LoginModal {
    render() {
        return   `
            <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="loginModalLabel">Login</h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="login-form" class="needs-validation" novalidate>
                                <div class="form-group mb-3 has-validation">
                                    <label for="username" class="col-form-label">Username:</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="login-username" 
                                           required>
                                    <div class="invalid-feedback">
                                        Inserisci il tuo username.
                                    </div>
                                </div>
                                <div class="form-group mb-3 has-validation">
                                    <label for="password" class="col-form-label">Password:</label>
                                    <input type="password" 
                                           class="form-control" 
                                           id="login-password" 
                                           required>
                                    <div class="invalid-feedback">
                                        Inserisci la tua password.
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer d-flex justify-content-end">
                            <div>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                                <button id="login-submit" type="submit" form="login-form" class="btn btn-primary submit-button">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById('loginModal');
        const form = document.getElementById('login-form');
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');

        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            form.classList.remove('was-validated');
            
            usernameInput.setCustomValidity('');
            passwordInput.setCustomValidity('');
            
            const errorDiv = form.querySelector('.alert');
            if (errorDiv) {
                errorDiv.remove();
            }
        });
        
        if(usernameInput && passwordInput) {
            usernameInput.addEventListener('input', () => {
                usernameInput.setCustomValidity('');
            });
            passwordInput.addEventListener('input', () => {
                passwordInput.setCustomValidity('');
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                usernameInput.classList.remove('is-invalid');
                passwordInput.classList.remove('is-invalid');
                // Add validation class to show feedback
                form.classList.add('was-validated');

                // Check if the form is valid
                if (!form.checkValidity()) {
                    return;
                }

                // Get form data
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                
                const submitButton = document.getElementById('login-submit');
                const originalText = submitButton.innerHTML;

                try {
                    // Clear previous error states
                    usernameInput.setCustomValidity('');
                    passwordInput.setCustomValidity('');

                    // Show loading state
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

                    // Attempt login
                    await API.login(username, password);
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    modal.hide();
                    
                    // Refresh page to update auth state
                    window.location.reload();

                } catch (error) {
                    // Empty the username and password fields (also trigger invalid state)
                    usernameInput.value = '';
                    passwordInput.value = '';

                    // Show error message
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger mt-3';
                    errorDiv.textContent = error.message || 'Login fallito. Riprova più tardi.';
                    form.appendChild(errorDiv);

                    setTimeout(() => errorDiv.remove(), 10000);

                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
            });
        }
    }
}

export default LoginModal;