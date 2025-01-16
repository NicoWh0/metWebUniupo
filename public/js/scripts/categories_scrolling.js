'use strict';

class CategoryScroller {
    constructor() {
        // Get the container element
        this.container = document.getElementById('scrolling-menu');
        this.scrollLength = this.calculateWidth();

        // Get the left and right arrow elements
        this.leftArrow = document.querySelector('.left-arrow .scrolling-arrow-button');
        this.rightArrow = document.querySelector('.right-arrow .scrolling-arrow-button');

        // Set the initial scroll position
        this.scrollPosition = 0;
        this.container.scrollTo({
            top: 0,
            left: this.scrollPosition,
            behavior: 'smooth'
        });

        // Bind methods
        this.checkScroll = this.checkScroll.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);

        // Initialize
        this.attachEventListeners();
        this.checkScroll();
    }

    calculateWidth() {
        return Math.ceil(this.container.scrollWidth - this.container.clientWidth);
    }

    calculateScrollAmount() {
        const visibleWidth = this.container.clientWidth;
        return Math.floor(visibleWidth * 0.8);
    }

    checkScroll() {
        this.scrollLength = this.calculateWidth();
        const currentScroll = this.container.scrollLeft;
        
        if (currentScroll === 0) {
            this.leftArrow.setAttribute("disabled", "true");
            this.rightArrow.removeAttribute("disabled");
        } else if (Math.abs(currentScroll - this.scrollLength) < 1) {
            this.rightArrow.setAttribute("disabled", "true");
            this.leftArrow.removeAttribute("disabled");
        } else {
            this.leftArrow.removeAttribute("disabled");
            this.rightArrow.removeAttribute("disabled");
        }
    }

    handleLeftClick() {
        const scrollAmount = this.calculateScrollAmount();
        if(this.scrollPosition - scrollAmount >= 0) {
            this.scrollPosition -= scrollAmount;
        } else {
            this.scrollPosition = 0;
        }
        this.container.scrollTo({
            top: 0,
            left: this.scrollPosition,
            behavior: 'smooth'
        });
        this.checkScroll();
    }

    handleRightClick() {
        const scrollAmount = this.calculateScrollAmount();
        if(this.scrollPosition + scrollAmount <= this.scrollLength) {
            this.scrollPosition += scrollAmount;
        } else {
            this.scrollPosition = this.scrollLength;
        }
        this.container.scrollTo({
            top: 0,
            left: this.scrollPosition,
            behavior: 'smooth'
        });
        this.checkScroll();
    }

    attachEventListeners() {
        this.container.addEventListener("scroll", this.checkScroll);
        window.addEventListener("resize", this.checkScroll);
        this.leftArrow.addEventListener('click', this.handleLeftClick);
        this.rightArrow.addEventListener('click', this.handleRightClick);
    }

    detachEventListeners() {
        this.container.removeEventListener("scroll", this.checkScroll);
        window.removeEventListener("resize", this.checkScroll);
        this.leftArrow.removeEventListener('click', this.handleLeftClick);
        this.rightArrow.removeEventListener('click', this.handleRightClick);
    }
}

// Export a function that creates and returns a new instance
function initializeCategoryScroller() {
    return new CategoryScroller();
}

export { initializeCategoryScroller };