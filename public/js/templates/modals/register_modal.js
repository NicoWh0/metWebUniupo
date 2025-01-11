"use strict";

class RegisterModal {
    render() {
        return `
            <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
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
                                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                                    <div class="invalid-feedback">
                                        Inserisci un indirizzo email valido
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
                                           minlength="3"
                                           maxlength="20"
                                           pattern="[A-Za-z0-9_]+">
                                    <div class="invalid-feedback">
                                        L'username deve essere tra 3 e 20 caratteri e può contenere solo lettere, numeri e underscore
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
                                           pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$">
                                    <div class="invalid-feedback">
                                        La password deve contenere almeno 8 caratteri, una lettera e un numero
                                    </div>
                                </div>

                                <!-- Confirm Password -->
                                <div class="mb-3">
                                    <label for="register-confirm-password" class="form-label">Conferma Password</label>
                                    <input type="password" 
                                           class="form-control" 
                                           id="register-confirm-password" 
                                           name="confirmPassword"
                                           required>
                                    <div class="invalid-feedback">
                                        Le password non coincidono
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

    attachValidation() {
        const form = document.getElementById('register-form');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        // Add password match validation
        const validatePasswordMatch = () => {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity('Le password non coincidono');
            } else {
                confirmPassword.setCustomValidity('');
            }
        };

        password.addEventListener('change', validatePasswordMatch);
        confirmPassword.addEventListener('change', validatePasswordMatch);

        // Form validation
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                // Form is valid, collect data
                const formData = {
                    email: form.email.value,
                    username: form.username.value,
                    password: form.password.value
                };
                
                // Here you can call your API to register the user
                console.log('Form data:', formData);
            }

            form.classList.add('was-validated');
        });
    }
}

export default RegisterModal;