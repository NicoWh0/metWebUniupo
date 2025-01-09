"use strict";

class LoginModal {
    render(user) {
        return  !user ? `
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
                            <button type="submit" form="login-form" class="btn btn-primary submit-button">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        ` : '';
    }

    attachEventListeners() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const rememberMe = document.getElementById('remember-me').checked;

                try {
                    const response = await fetch('/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            password,
                            rememberMe
                        })
                    });

                    if (response.ok) {
                        // Close modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                        modal.hide();
                        
                        // Refresh auth state
                        window.location.reload();
                    } else {
                        // Handle login error
                        console.error('Login failed');
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                }
            });
        }
    }
}

export default LoginModal;