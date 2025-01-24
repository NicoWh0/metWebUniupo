"use strict";

class UserHeader {
    constructor(user) {
        this.user = user;
    }

    render() {
        return `
            <div id="user-header" class="d-flex flex-column-reverse w-100 align-items-center">
                <div id="user-info" class="card p-1 flex-column justify-content-center">
                    <div class="card-img">
                        <svg id="user-info-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </div>
                    <div class="card-body">
                        <div id="user-name" class="card-header">${this.user.username}</div>
                        <div id="user-mail" class="card-footer">${this.user.email}</div>
                        <div id="user-signed-up" class="card-footer">Utente dal ${new Date(this.user.signedUp).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        
        `
    }
}

export default UserHeader;