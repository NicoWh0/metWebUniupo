"use strict";

import API from '../../api.js';

class RegisterModal {
    render() {
        return `
            <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel">
                <div class="modal-dialog">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="registerModalLabel">Registrazione</h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="register-form" novalidate>
                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="register-email" class="form-label">Email</label>
                                    <input type="email" 
                                           class="form-control" 
                                           id="register-email" 
                                           name="email"
                                           required
                                           pattern="^([a-z0-9._%+]|-)+@([a-z0-9.]|-)+\.[a-z]{2,}$"
                                           maxlength="320"
                                    >
                                    <div class="invalid-feedback">
                                        Inserisci un indirizzo email valido.
                                    </div>
                                </div>

                                <!-- Username -->
                                <div class="mb-3">
                                    <label for="register-username" class="form-label">Username</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="register-username" 
                                           name="username"
                                           required
                                           minlength="4"
                                           maxlength="20"
                                           pattern="[A-Za-z0-9_]{4,20}"
                                    >
                                    <div class="invalid-feedback">
                                        L'username deve essere tra 4 e 20 caratteri e può contenere solo lettere, numeri e underscore.
                                    </div>
                                </div>

                                <!-- Password -->
                                <div class="mb-3">
                                    <label for="register-password" class="form-label">Password</label>
                                    <input type="password" 
                                           class="form-control" 
                                           id="register-password" 
                                           name="password"
                                           required
                                           minlength="8"
                                           maxlength="16"
                                    >
                                    <div class="invalid-feedback">
                                        La password deve contenere almeno dagli 8 ai 16 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale.
                                    </div>
                                </div>

                                <!-- Confirm Password -->
                                <div class="mb-3">
                                    <label for="register-confirm-password" class="form-label">Conferma Password</label>
                                    <input type="password" 
                                           class="form-control" 
                                           id="register-confirm-password" 
                                           name="confirmPassword"
                                           maxlength="16"
                                           required>
                                    <div class="invalid-feedback">
                                        Le password non coincidono.
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button type="submit" form="register-form" class="btn btn-primary submit-button">Registrati</button>
                        </div>
                    </div>
                </div>
            </div>       
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById('registerModal');
        const form = document.getElementById('register-form');
        const username = document.getElementById('register-username');
        const email = document.getElementById('register-email');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            form.classList.remove('was-validated');
            
            username.setCustomValidity('');
            email.setCustomValidity('');
            password.setCustomValidity('');
            confirmPassword.setCustomValidity('');
        });

        const validatePassword = () => {
            const value = password.value;
            const isValid = 
                value.length >= 8 &&
                value.length <= 16 &&
                /[A-Z]/.test(value) && 
                /[a-z]/.test(value) &&    
                /[0-9]/.test(value) &&    
                /[!@#$%^&*_\-+=]/.test(value); 

            if (!isValid) {
                password.setCustomValidity('Password non valida');
            } else {
                password.setCustomValidity('');
            }
        };
        
        username.addEventListener('input', () => {
            username.setCustomValidity('');
        });
        email.addEventListener('input', () => {
            email.setCustomValidity('');
        });
        password.addEventListener('input', validatePassword);
        confirmPassword.addEventListener('input', () => {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('Le password non coincidono');
            } else {
                confirmPassword.setCustomValidity('');
            }
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            validatePassword();
            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                // Form is valid, collect data
                const formData = {
                    email: form.email.value,
                    username: form.username.value,
                    password: form.password.value,
                    confirmPassword: form.confirmPassword.value
                };
                
                // Here you can call your API to register the user
                try {
                    await API.register(formData);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    modal.hide();
                    await API.login(formData.username, formData.password);
                    window.location.reload();
                } catch(error) {
                    if(error.cause === 409) {
                        username.value = '';
                        email.value = '';
                    }
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger mt-3';
                    errorDiv.textContent = error.message || 'Registration failed. Please try again.';
                    form.appendChild(errorDiv);
                    
                    setTimeout(() => errorDiv.remove(), 10000);
                }
            }
            form.classList.add('was-validated');
        });
    }
}

export default RegisterModal;