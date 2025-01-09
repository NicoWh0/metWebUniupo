"use strict";

class ExploreTitleRow {

    constructor(tags = null) {
        this.tags = tags;
    }

    render() {
        return `
            <div id="title-row" class="row d-flex flex-row flex-nowrap align-content-center justify-content-between">
                <div class="col-3 d-flex flex-column-reverse">
                    <span id="title-row-title">Esplora</span>
                </div>
                <div class="col-3 dropend position-relative d-flex flex-row-reverse">
                    <button id="hashtag-button" class="btn btn-primary" data-bs-toggle="dropdown" aria-expanded="false">&nbsp#&nbsp</button>
                    <ul id="hashtag-menu" class="dropdown-menu">
                        <li class="dropdown-item hashtag-item"><a href="#">#home</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#edifici</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#personaggi</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#pixelart</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#biancoenero</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#manga</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#cat</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#animals</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#novizio</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#natura</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#ritratto</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#amici</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#videogame</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#film</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#sfondi</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#colori</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#dog</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#cartoon</a></li>
                        <li class="dropdown-item hashtag-item"><a href="#">#school</a></li>
                    </ul>
                </div>
            </div>      
        `
    }
}

export default ExploreTitleRow;