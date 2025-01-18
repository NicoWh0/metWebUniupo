"use strict";


class NotFound {
    render() {
        return `
            <div id="not-found-container" class="container-fluid d-flex flex-column justify-content-center align-items-center">
                <h1 class="text-center">404 - Page not found</h1>
                <p class="text-center">La pagina che stai cercando non esiste.</p>
                <a href="/home">Torna alla home</a>
            </div>
        `;
    }
}

export default NotFound;