"use strict";
import API from "../../api.js";

class Navbar {
    constructor(user) {
        this.user = user;
    }

    render() {
        return `
            <button id="offcanvas-button" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"><span>≡</span></button>
            <div class="offcanvas offcanvas-top bg-dark" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="container-sm d-flex flex-sm-column">
                        <div class="row d-flex flex-column g-2 w-100">
                            <div class="col-sm-12 d-flex justify-content-center">
                                <form id="search-box-offcanvas" class="d-flex search-box" role="search">
                                    <svg class="search-lens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                    <input id="search-bar-offcanvas" class="form-control me-2 search-bar" type="search" placeholder="Cerca Opere o Artisti" aria-label="Search">
                                </form>
                            </div>
                            ${
                                this.user ? `
                                    <div class="col-sm-12">
                                        <a id="offcanvas-user-anchor" href="user.html">
                                            <div id="offcanvas-user-wrapper">
                                                <svg class="rounded-circle" id="offcanvas-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                                </svg>
                                                <span id="offcanvas-username">${this.user.username}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="col-sm-12">
                                        <li class="list-group offcanvas-small-menu">
                                            <ul class="list-group-item offcanvas-small-menu-item">
                                                <a class="small-menu-item-anchor" href="#">Modifica Profilo</a>
                                            </ul>
                                            <ul class="list-group-item offcanvas-small-menu-item">
                                                <button class="small-menu-item-btn btn" id="logout-button-offcanvas">Logout</button>
                                            </ul>
                                        </li>
                                    </div> 
                                ` : 
                                `
                                    <div class="col-sm-12">
                                        <li class="list-group offcanvas-small-menu">
                                            <ul class="list-group-item offcanvas-small-menu-item">
                                                <button class="small-menu-item-btn btn" id="login-button-offcanvas" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                                            </ul>
                                            <ul class="list-group-item offcanvas-small-menu-item">
                                                <button class="small-menu-item-btn btn" id="register-button-offcanvas" data-bs-toggle="modal" data-bs-target="#registerModal">Registrati</button>
                                            </ul>
                                        </li>
                                    </div>
                                    <div class="login-register-buttons-placeholder"></div>
                                `
                            }
                        </div>
                    </div>
                </div>
            </div>
            <a id="logo-title" class="navbar-brand" href="/home">
                <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M59.83496,15.93018c.58534-.84171-.47382-1.97421-1.3526-1.4057-5.57391,3.37177-9.40014,8.55298-11.87414,13.02704,1.27216-3.72504,2.64307-6.33099,2.66473-6.37183,.47233-.82822-.51683-1.83225-1.3521-1.35298-6.1728,3.27894-10.56227,12.06404-12.79036,17.50941-.60535-1.19093-.45393-1.42772-1.22173-1.7522-1.53018-.14769-2.0655,1.78005-2.82287,4.30243-.39265-1.2627-.84084-2.22669-1.18196-2.84809,.63995-6.79315,5.57477-16.4527,5.62537-16.55096,.45334-.81196-.49843-1.79306-1.32474-1.35787-3.57662,1.72963-8.26016,8.06795-10.62942,11.52358-.78455-4.85364-1.70538-8.47906-1.71625-8.52118-.17421-.80062-1.32199-1.0199-1.77832-.33882-.77393,1.06771-1.44611,3.39693-2.04187,7.03823C13.41101,20.49426,5.94891,14.84021,5.59863,14.57861c-.91282-.69839-2.13897,.55722-1.35931,1.45073,5.8778,6.88472,7.24242,24.14052,7.53185,29.61079h-2.25116c-.55225,0-1,.44775-1,1,0,.55225,.44775,1,1,1H54.25977c.55225,0,1-.44775,1-1s-.44775-1-1-1h-1.93671c-.43323-17.41272,7.43085-29.58673,7.5119-29.70996Zm-16.99951,19.08887c1.08519,3.5025,1.69001,7.32883,1.64672,10.62109,0,0-4.04998,0-4.04998,0,.33392-5.56683,1.01117-10.00397,1.85541-12.2832,.16943,.47656,.35693,1.03516,.54785,1.66211Zm3.05078-11.25244c-.77838,1.88916-1.6839,4.40973-2.37061,7.21722-.07434-.17542-.11926-.27435-.12598-.289-.25332-.59806-1.08977-.77639-1.56788-.33787-2.16058,1.88859-3.04144,9.15104-3.39764,15.28318h-1.26837c-.11157-1.78064-.44067-3.60461-.99628-5.44434,1.19739-3.22498,4.68457-11.72443,9.72675-16.4292Zm-12.3623,14.90918c.86304,2.1182,1.49575,4.75242,1.62944,6.96436,.00002,0-3.13225,0-3.13225,0,.46991-3.19305,1.02655-5.59296,1.50281-6.96436Zm-5.15186-.25928c.66809,1.34912,1.58344,3.85919,1.50488,7.22363h-2.8681c.2373-3.2088,.72461-5.77136,1.36322-7.22363Zm3.61816-15.08984c-1.41595,3.24225-3.26373,8.05359-3.91565,12.31335-2.20482,1.4407-2.72344,6.05483-3.0733,10.00006,.00012,.00006-.41407,.00006-.41407,.00006,.21735-3.38159,.02368-7.41895-.57977-12.03088,1.90613-2.95972,5.09448-7.42218,7.98279-10.28259Zm-11.33643,2.5332c1.20401,5.3242,2.40574,14.78002,1.92774,19.78028,.00011-.00001-4.20301-.00001-4.20301-.00001,.20722-3.97644,1.06141-15.0129,2.27527-19.78027Zm-11.63477-5.5376c2.84448,2.87714,6.34436,7.07074,8.52271,11.9729-.62585,5.00464-.99829,10.47681-1.16669,13.34497h-2.60138c-.22894-4.39667-1.17188-16.74536-4.75464-25.31787Zm37.46442,25.31787c.0329-3.12817-.42004-6.43793-1.35168-9.85968,.81995-2.4165,4.09735-11.04724,10.84479-16.94354-2.42822,5.0719-5.94647,14.62427-5.6488,26.80322h-3.8443Z"/>
                </svg>
                <div id="title-box">
                    <h1 id="title">GroundArt</h1>
                </div>   
            </a>
            <form id="search-box-navbar" class="d-flex search-box" role="search">
                <svg class="search-lens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <input id="search-bar-navbar" class="form-control me-2 search-bar" type="search" placeholder="Cerca per Titolo, Artista, Genere o Tag" aria-label="Search">
            </form>
            ${
                this.user ? `
                    <div id="user-and-submit">
                        <a class="d-flex" id="user-logged" data-bs-toggle="dropdown" href="#">
                            <svg id="user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                            <!--<img class="rounded rounded-circle border border-1 border-opacity-50 border-light" id="user-image" src="img/image_chart/nicowho.jpeg"/>-->
                        </a>
                        <div id="user-dropdown-menu" class="dropdown-menu">
                            <h5 class="dropdown-header">${this.user.username}</h5>
                            <a class="dropdown-item" href="user.html">Visualizza Profilo</a>
                            <a class="dropdown-item" href="#">Modifica Profilo</a>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-btn btn" id="logout-button">Logout</button>
                        </div>
                        <button type="button" class="btn btn-primary shadow-none submit-button" data-bs-toggle="modal" data-bs-target="#uploadImage">Pubblica</button>       
                </div>  
                ` : 
                `
                    <div class="login-register-buttons d-flex align-items-center">
                        <button type="button" class="btn btn-primary sign-in-up-btn" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                    <button type="button" class="btn btn-primary sign-in-up-btn" data-bs-toggle="modal" data-bs-target="#registerModal">Registrati</button>
                    </div>
                    <div class="login-register-buttons-placeholder"></div>
                `
            }
        `  
    }

    attachEventListeners() {
        const logoutButton = document.getElementById('logout-button');
        const logoutButtonOffcanvas = document.getElementById('logout-button-offcanvas');

        const listener = async () => {
            try {
                await API.logout();
                window.location.href = '/home';
            } catch (error) {
                console.error('Logout failed: ', error);
            }
        };

        if (logoutButton) {
            logoutButton.addEventListener('click', listener);
        }
        if (logoutButtonOffcanvas) {
            logoutButtonOffcanvas.addEventListener('click', listener);
        }
    }
}

export default Navbar;


/*
            <header id="navbar" class="nav navbar-dark bg-dark justify-content-between d-flex align-items-center border-bottom">
            <button id="offcanvas-button" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">≡</button>
            <div class="offcanvas offcanvas-top bg-dark" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="container-sm d-flex flex-sm-column">
                        <div class="row d-flex flex-column g-2">
                            <div class="col-sm-12 d-flex justify-content-center">
                                <form id="search-box" class="d-flex" role="search">
                                    <svg id="search-lens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                    <input id="search-bar" class="form-control me-2" type="search" placeholder="Cerca Opere o Artisti" aria-label="Search">
                                </form>
                            </div>
                            <div class="col-sm-12">
                                <a id="offcanvas-user-anchor" href="user.html">
                                    <div id="offcanvas-user-wrapper">
                                        <svg class="rounded-circle" id="offcanvas-user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span id="offcanvas-username">NicoWho</span>
                                    </div>
                                </a>
                            </div>
                            <div class="col-sm-12">
                                <li class="list-group offcanvas-small-menu">
                                    <ul class="list-group-item offcanvas-small-menu-item">
                                        <a class="small-menu-item-anchor" href="#">Modifica Profilo</a>
                                    </ul>
                                    <ul class="list-group-item offcanvas-small-menu-item">
                                        <a class="small-menu-item-anchor" href="#">Logout</a>
                                    </ul>
                                </li>
                            </div>     
                        </div>
                    </div>
                </div>
            </div>
            <a id="logo-title" class="navbar-brand" href="index.html">
                <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M59.83496,15.93018c.58534-.84171-.47382-1.97421-1.3526-1.4057-5.57391,3.37177-9.40014,8.55298-11.87414,13.02704,1.27216-3.72504,2.64307-6.33099,2.66473-6.37183,.47233-.82822-.51683-1.83225-1.3521-1.35298-6.1728,3.27894-10.56227,12.06404-12.79036,17.50941-.60535-1.19093-.45393-1.42772-1.22173-1.7522-1.53018-.14769-2.0655,1.78005-2.82287,4.30243-.39265-1.2627-.84084-2.22669-1.18196-2.84809,.63995-6.79315,5.57477-16.4527,5.62537-16.55096,.45334-.81196-.49843-1.79306-1.32474-1.35787-3.57662,1.72963-8.26016,8.06795-10.62942,11.52358-.78455-4.85364-1.70538-8.47906-1.71625-8.52118-.17421-.80062-1.32199-1.0199-1.77832-.33882-.77393,1.06771-1.44611,3.39693-2.04187,7.03823C13.41101,20.49426,5.94891,14.84021,5.59863,14.57861c-.91282-.69839-2.13897,.55722-1.35931,1.45073,5.8778,6.88472,7.24242,24.14052,7.53185,29.61079h-2.25116c-.55225,0-1,.44775-1,1,0,.55225,.44775,1,1,1H54.25977c.55225,0,1-.44775,1-1s-.44775-1-1-1h-1.93671c-.43323-17.41272,7.43085-29.58673,7.5119-29.70996Zm-16.99951,19.08887c1.08519,3.5025,1.69001,7.32883,1.64672,10.62109,0,0-4.04998,0-4.04998,0,.33392-5.56683,1.01117-10.00397,1.85541-12.2832,.16943,.47656,.35693,1.03516,.54785,1.66211Zm3.05078-11.25244c-.77838,1.88916-1.6839,4.40973-2.37061,7.21722-.07434-.17542-.11926-.27435-.12598-.289-.25332-.59806-1.08977-.77639-1.56788-.33787-2.16058,1.88859-3.04144,9.15104-3.39764,15.28318h-1.26837c-.11157-1.78064-.44067-3.60461-.99628-5.44434,1.19739-3.22498,4.68457-11.72443,9.72675-16.4292Zm-12.3623,14.90918c.86304,2.1182,1.49575,4.75242,1.62944,6.96436,.00002,0-3.13225,0-3.13225,0,.46991-3.19305,1.02655-5.59296,1.50281-6.96436Zm-5.15186-.25928c.66809,1.34912,1.58344,3.85919,1.50488,7.22363h-2.8681c.2373-3.2088,.72461-5.77136,1.36322-7.22363Zm3.61816-15.08984c-1.41595,3.24225-3.26373,8.05359-3.91565,12.31335-2.20482,1.4407-2.72344,6.05483-3.0733,10.00006,.00012,.00006-.41407,.00006-.41407,.00006,.21735-3.38159,.02368-7.41895-.57977-12.03088,1.90613-2.95972,5.09448-7.42218,7.98279-10.28259Zm-11.33643,2.5332c1.20401,5.3242,2.40574,14.78002,1.92774,19.78028,.00011-.00001-4.20301-.00001-4.20301-.00001,.20722-3.97644,1.06141-15.0129,2.27527-19.78027Zm-11.63477-5.5376c2.84448,2.87714,6.34436,7.07074,8.52271,11.9729-.62585,5.00464-.99829,10.47681-1.16669,13.34497h-2.60138c-.22894-4.39667-1.17188-16.74536-4.75464-25.31787Zm37.46442,25.31787c.0329-3.12817-.42004-6.43793-1.35168-9.85968,.81995-2.4165,4.09735-11.04724,10.84479-16.94354-2.42822,5.0719-5.94647,14.62427-5.6488,26.80322h-3.8443Z"/>
                </svg>
              <div id="title-box">
                  <h1 id="title">GroundArt</h1>
              </div>   
          </a>
          <form id="search-box" class="d-flex" role="search">
              <svg id="search-lens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              <input id="search-bar" class="form-control me-2" type="search" placeholder="Cerca per Titolo, Artista, Genere o Tag" aria-label="Search">
          </form>
          <div id="user-and-submit">
              <a class="d-flex" id="user-logged" data-bs-toggle="dropdown" href="#">
                  <!--<svg id="user-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>-->
                  <img class="rounded rounded-circle border border-1 border-opacity-50 border-light" id="user-image" src="img/image_chart/nicowho.jpeg"/>
              </a>
              <div id="user-dropdown-menu" class="dropdown-menu">
                  <h5 class="dropdown-header">NicoWho</h5>
                  <a class="dropdown-item" href="user.html">Visualizza Profilo</a>
                  <a class="dropdown-item" href="#">Modifica Profilo</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Logout</a>
              </div>
              <button type="button" class="btn btn-primary shadow-none submit-button" data-bs-toggle="modal" data-bs-target="#uploadImage">Pubblica</button>       
          </div>
      </header>





*/
