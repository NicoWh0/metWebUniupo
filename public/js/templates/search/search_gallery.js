"use strict";

class SearchGallery {


    render() {
        return `
            <div id="search-result-gallery-container" class="container-fluid justify-content-center d-flex standard-background">
                <div id="search-result-gallery" class="w-100 h-100 d-flex flex-row justify-content-start flex-wrap">
                    <a class="image-anchor search-result-anchor" href="post.html">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/walking_woods.jpg" alt="Passeggiata nel Bosco">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse justify-content-start">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">NicoWho</span>
                                    </div>
                                    <span class="search-result-title">Passeggiata nel Bosco</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/woman_on_horse.jpg" alt="Donna su Cavallo">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Celeste_</span>
                                    </div>
                                    <span class="search-result-title">Donna su Cavallo</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/robin-lhebrard-valley5.jpeg" alt="Valley and Mountains">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Robin42</span>
                                    </div>
                                    <span class="search-result-title">Valley and Mountains</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/robin-lhebrard-flowers.jpg" alt="Robin42">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Robin42</span>
                                    </div>
                                    <span class="search-result-title">Just Some Flowers</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/radura.jpg" alt="Radura con funghi">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Marco C.</span>
                                    </div>
                                    <span class="search-result-title">Radura con funghi</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/white_peak_waterfall.jpg" alt="Cascata bianca">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">NicoWho</span>
                                    </div>
                                    <span class="search-result-title">Cascata Bianca</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/robin-lhebrard-valley5.jpeg" alt="Valley and Mountains">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Robin42</span>
                                    </div>
                                    <span class="search-result-title">Valley and Mountains</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/desert_study.jpg" alt="Desert">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Robin42</span>
                                    </div>
                                    <span class="search-result-title">Desert</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/nature_warrior_female.jpg" alt="Idee per personaggio">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Aria</span>
                                    </div>
                                    <span class="search-result-title">Idea per personaggio</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/summer_house.jpg" alt="Casa in Estate">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Xavier</span>
                                    </div>
                                    <span class="search-result-title">Casa in Estate</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/nature_mage.jpg" alt="Stregone della terra">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse"> 
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Aria</span>
                                    </div>
                                    <span class="search-result-title">Stregone della terra</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/small_forest.jpg" alt="Fantasy Forest">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">    
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">DaniDani</span>
                                    </div>
                                    <span class="search-result-title">Fantasy Forest</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/alltrees.jpg" alt="qualche albero">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">DaniDani</span>
                                    </div>
                                    <span class="search-result-title">qualche albero</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="#">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/bee_flower.jpg" alt="Ciclo">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Xavier</span>
                                    </div>
                                    <span class="search-result-title">"Ciclo"</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a class="image-anchor search-result-anchor" href="post.html">
                        <div class="search-result-wrapper light-grey-border">
                            <img class="search-result-img" src="img/image_chart/robin-lhebrard-valley5.jpeg" alt="Valley and Mountains">
                            <div class="search-result-overlay-desc d-flex flex-column-reverse">    
                                <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                                    <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                        <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0 z"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0 A8 8 0 0 1 0 8 z m8-7a7 7 0 0 0-5.468 11.37 C3.242 11.226 4.805 10 8 10 s4.757 1.225 5.468 2.37 A7 7 0 0 0 8 1z"/>
                                        </svg>
                                        <span class="search-result-author-username">Robin42</span>
                                    </div>
                                    <span class="search-result-title">Valley and Mountains</span>
                                </div>  
                            </div>
                        </div>
                    </a>
                </div>
            </div>     
        `
    }

    renderImage(image) {
        return `
            <a class="image-anchor search-result-anchor" href="${image.href}">
                <div class="search-result-wrapper light-grey-border">
                    <img class="search-result-img" src="${image.path}" alt="${image.title}">
                    <div class="search-result-overlay-desc d-flex flex-column-reverse">    
                        <div class="search-result-desc d-flex flex-column-reverse justify-content-around">
                            <div class="search-result-author-row d-flex flex-row justify content-start align-items-center">
                                <svg class="search-result-author-img" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0 z"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0 A8 8 0 0 1 0 8 z m8-7a7 7 0 0 0-5.468 11.37 C3.242 11.226 4.805 10 8 10 s4.757 1.225 5.468 2.37 A7 7 0 0 0 8 1z"/>
                                </svg>
                                <span class="search-result-author-username">${image.author}</span>
                            </div>
                            <span class="search-result-title">${image.title}</span>
                        </div>  
                    </div>
                </div>
            </a>
        `
    }
}

export default SearchGallery;