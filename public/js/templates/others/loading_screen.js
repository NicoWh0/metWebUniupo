export default class LoadingScreen {
    static render() {
        return `
            <div id="loading-screen" class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style="z-index: 9999;">
                <div class="text-center text-white">
                    <div class="spinner-border mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h4>Caricamento...</h4>
                </div>
            </div>
        `;
    }

    static show() {
        document.body.insertAdjacentHTML('beforeend', LoadingScreen.render());
    }

    static hide() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.remove(), 500); // Remove after fade animation
        }
    }
}
