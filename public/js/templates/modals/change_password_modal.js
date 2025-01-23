"use strict";

import API from '../../api.js';

class ChangePasswordModal {
    constructor() {
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
    }

    render() {
        return `
            <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content standard-background">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="changePasswordModalLabel">Modifica Password</h1>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="change-password-form">
                                <div class="form-group mb-3">
                                    <label for="old-password" class="col-form-label">Vecchia Password<span class="text-danger">*</span>:</label>
                                    <input type="password" class="form-control" id="old-password" maxlength="16" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="new-password" class="col-form-label">Nuova Password<span class="text-danger">*</span>:</label>
                                    <input type="password" 
                                           class="form-control" 
                                           id="new-password" 
                                           required
                                           minlength="8"
                                           maxlength="16">
                                    <div class="invalid-feedback">
                                        La password deve contenere almeno dagli 8 ai 16 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale.
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="confirm-password" class="col-form-label">Conferma Password<span class="text-danger">*</span>:</label>
                                    <input type="password" class="form-control" id="confirm-password" minlength="8" maxlength="16" required>
                                    <div class="invalid-feedback">
                                        Le password non coincidono.
                                    </div>
                                </div>

                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                            <button type="submit" form="change-password-form" class="btn btn-primary">Salva</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById('change-password-form');
        const modal = document.getElementById('changePasswordModal');
        const oldPasswordInput = document.getElementById('old-password');
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');


        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            form.classList.remove('was-validated');
            oldPassword.setCustomValidity('');
            newPasswordInput.setCustomValidity('');
            confirmPasswordInput.setCustomValidity('');
        });


        const validatePassword = () => {
            const value = newPasswordInput.value;
            const isValid = 
                value.length >= 8 &&
                value.length <= 16 &&
                /[A-Z]/.test(value) && 
                /[a-z]/.test(value) &&    
                /[0-9]/.test(value) &&    
                /[!@#$%^&*_\-+=]/.test(value); 

            if (!isValid) {
                newPasswordInput.setCustomValidity('Password non valida');
            } else {
                newPasswordInput.setCustomValidity('');
            }
        };

        newPasswordInput.addEventListener('input', validatePassword);

        // Check password match in real-time
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value !== newPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Le password non coincidono');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });

        newPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value !== '') {
                if (confirmPasswordInput.value !== newPasswordInput.value) {
                    confirmPasswordInput.setCustomValidity('Le password non coincidono');
                } else {
                    confirmPasswordInput.setCustomValidity('');
                }
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.preventDefault();
            validatePassword();
            if (!form.checkValidity()) {
                e.stopPropagation();
                return;
            }

            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                return;
            }

            try {
                await API.changePassword(oldPassword, newPassword, confirmPassword);
                
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success mt-2';
                successDiv.textContent = 'Password modificata con successo!';
                form.appendChild(successDiv);

                // Close modal after 1 second
                setTimeout(() => {
                    bootstrap.Modal.getInstance(modal).hide();
                }, 1000);

            } catch (error) {
                console.error('Password change failed:', error);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-2';
                errorDiv.textContent = error.message || 'Modifica password fallita. Riprova.';
                form.appendChild(errorDiv);

                setTimeout(() => {
                    errorDiv.remove();
                }, 3000);
            }
        });

        // Reset form when modal is hidden
        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            const alerts = form.querySelectorAll('.alert');
            alerts.forEach(alert => alert.remove());
            confirmPasswordInput.setCustomValidity('');
        });
    }
}

export default ChangePasswordModal;
