"use strict";

class ExploreTitleRow {

    constructor(tags) {
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
                        ${this.tags.map(tag => this.renderTag(tag)).join('')}
                    </ul>
                </div>
            </div>      
        `
    }

    renderTag(tag) {
        return `
            <li class="dropdown-item hashtag-item"><a href="#">#${tag.TagName}</a></li>
        `
    }
}

export default ExploreTitleRow;