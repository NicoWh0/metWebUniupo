"use strict";

class Related {
    render() {
        return `
            <div class="d-flex flex-column h-50 align-content-center justify-content-start">
                <div id="related-title-wrapper" class="d-flex flex-row align-items-end">
                    <h2 id="related-title">Potrebbero piacerti anche...</h2>
                </div>
                <div class="container-fluid">
                    <div class="row row-cols-3 d-flex flex-row gx-1 gy-4 justify-content-around">
                        <div class="col d-flex justify-content-center">    
                            <a href="#" title="Fantasy Forest">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/small_forest.jpg" alt="Fantasy Forest">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Sky Mountain">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/man_on_oblivion.jpg" alt="Sky Mountain">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="fiume che scorre">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/quiet_river.jpg" alt="fiume che scorre">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Radura con funghi">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/radura.jpg" alt="Radura con funghi">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Valley and Mountains">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/robin-lhebrard-valley5.jpeg" alt="Valley and Mountains">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Just Some Flowers">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/robin-lhebrard-flowers.jpg" alt="Just Some Flowers">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="&quot;Ciclo&quot;">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/bee_flower.jpg" alt="&quot;Ciclo&quot;">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Chilling">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/chilling_at_the_lake.jpg" alt="Chilling">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Speed Forest Painting">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/another_green_forest.jpg" alt="Speed Forest Painting">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column h-50 align-content-center justify-content-start">
                <div id="related-more-by-wrapper" class="d-flex flex-row align-items-end">
                    <h3 id="more-by-title">Altro da NicoWho</h3>
                </div>
                <div class="container-fluid">
                    <div class="row row-cols-3 d-flex flex-row gx-1 gy-4 justify-content-around">
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Cascata bianca">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/white_peak_waterfall.jpg" alt="Cascata bianca">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Può capitare">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/oh_nouh.jpg" alt="Può capitare">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Pilastro">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/pillar.jpg" alt="Pilastro">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Da solo in un nuovo posto">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/lonely_in_a_new__place.jpg" alt="Da solo in un nuovo posto">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                        <div class="col d-flex justify-content-center">
                            <a href="#" title="Nebbia al tramonto">
                                <div class="related-img-container">                                       
                                    <img class="related-img" src="img/image_chart/mist_at_sunset.jpg" alt="Nebbia al tramonto">
                                    <div class="related-img-dark-transparent-layer"></div>
                                </div> 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export default Related;