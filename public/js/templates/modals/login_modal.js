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
                            <form id="login-form">
                                <div class="form-group mb-3">
                                    <label for="username" class="col-form-label">Username:</label>
                                    <input type="text" class="form-control" id="username" required>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="password" class="col-form-label">Password:</label>
                                    <input type="password" class="form-control" id="password" required>
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
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', this.handleLogin);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        // Get form data
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const form = document.getElementById('login-form');
        const submitButton = document.getElementById('login-submit');
        const originalText = submitButton.innerHTML;
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

            // Attempt login
            await API.login(username, password);
            
            // Close modal
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            
            // Refresh page to update auth state
            window.location.reload();

        } catch (error) {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3';
            errorDiv.textContent = error.message || 'Login failed. Please try again.';
            form.appendChild(errorDiv);

            // Remove error message after 10 seconds
            setTimeout(() => errorDiv.remove(), 10000);

        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
}

export default LoginModal;