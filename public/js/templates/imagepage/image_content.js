"use strict";

class ImageContent {
    render() {
        return `
            <div id="full-image-container-upper" class="d-flex flex-column align-items-center">
                <figure id="full-image-container" class="row-cols-xl-1 figure d-flex flex-column align-items-center">
                    <div id="full-image-wrapper" class="col-xl-1 figure-img">
                        <img id="full-image" class="" src="img/image_chart/walking_woods.jpg">
                    </div>
                    <figcaption id="post-description" class="figure-caption">
                        <div id="title-and-buttons" class="d-flex flex-row justify-content-between">
                            <h1 id="title-art">Passeggiata nel Bosco</h1>
                            <div id="img-interact-container" class="d-flex flex-row justify-content-around align-items-center">
                                <span class="interact-inline">
                                    <svg class="img-interact" xmlns="http://www.w3.org/2000/svg" id="edit-shape" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#editImage">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </span>
                                <span class="interact-inline">
                                    <svg class="img-interact" id="download-shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"> 
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/> 
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/> 
                                    </svg>
                                </span>
                                <span id="like-inline" class="interact-inline">
                                    <svg class="img-interact" id="like-shape" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"/>
                                    </svg>
                                    <span id="like-counter">42</span>
                                </span>
                            </div>
                        </div>
                        <div id="author-row" class="d-flex flex-row justify-content-between">
                            <span id="author-intro">di:</span>
                            <span id="author">NicoWho</span>
                        </div>  
                    </figcaption>
                </figure>
            </div>
            <div id="description-and-tags" class="row d-flex flex-column">
                <div id="img-description-wrapper" class="col-8">
                    <span id="img-description">Mi mancano le camminate che da piccolo facevo nel bosco...</span>
                </div>
                <li id="tag-list-group" class="list-group list-group-horizontal d-flex flex-wrap justify-content-center">
                    <ul class="list-group-item tag-item">#natura</ul>
                    <ul class="list-group-item tag-item">#bosco</ul>
                    <ul class="list-group-item tag-item">#nature</ul>
                    <ul class="list-group-item tag-item">#ricordi</ul>
                    <ul class="list-group-item tag-item">#childmemory</ul>
                    <ul class="list-group-item tag-item">#painting</ul>
                    <ul class="list-group-item tag-item">#green</ul>
                    <ul class="list-group-item tag-item">#alberi</ul>
                    <ul class="list-group-item tag-item">#camminata</ul>
                    <ul class="list-group-item tag-item">#wholesome</ul>
                    <ul class="list-group-item tag-item">#woods</ul>
                    <ul class="list-group-item tag-item">#sfondo</ul>
                    <ul class="list-group-item tag-item">#background</ul>
                    <ul class="list-group-item tag-item">#illustrazione</ul>
                </li>
            </div>
        `;
    }
}

export default ImageContent;