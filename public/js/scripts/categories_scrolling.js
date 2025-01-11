'use strict';
// Get the container element
const container = document.getElementById('scrolling-menu');

const calculateWidth = () => {
    return Math.ceil(container.scrollWidth - container.clientWidth); // Round up to avoid floating point issues
}

let scrollLength = calculateWidth();

// Get the left and right arrow elements
const leftArrow = document.querySelector('.left-arrow .scrolling-arrow-button');
const rightArrow = document.querySelector('.right-arrow .scrolling-arrow-button');

// Calculate scroll amount based on container width
const calculateScrollAmount = () => {
    // Get the visible width of the container
    const visibleWidth = container.clientWidth;
    // Scroll 80% of the visible width
    return Math.floor(visibleWidth * 0.8);
};

function checkScroll() {
    scrollLength = calculateWidth();
    const currentScroll = container.scrollLeft;
    
    if (currentScroll === 0) {
        leftArrow.setAttribute("disabled", "true");
        rightArrow.removeAttribute("disabled");
    } else if (Math.abs(currentScroll - scrollLength) < 1) {
        rightArrow.setAttribute("disabled", "true");
        leftArrow.removeAttribute("disabled");
    } else {
        leftArrow.removeAttribute("disabled");
        rightArrow.removeAttribute("disabled");
    }
}

container.addEventListener("scroll", checkScroll);
window.addEventListener("resize", checkScroll);
checkScroll();

// Set the initial scroll position
let scrollPosition = 0;
container.scrollTo({
    top: 0,
    left: scrollPosition,
    behavior: 'smooth'
});

// Add event listener to the left arrow
leftArrow.addEventListener('click', () => {
    const scrollAmount = calculateScrollAmount();
    if(scrollPosition - scrollAmount >= 0) {
        scrollPosition -= scrollAmount;
    } else {
        scrollPosition = 0;
    }
    container.scrollTo({
        top: 0,
        left: scrollPosition,
        behavior: 'smooth'
    });
    checkScroll();
});

// Add event listener to the right arrow
rightArrow.addEventListener('click', () => {
    const scrollAmount = calculateScrollAmount();
    if(scrollPosition + scrollAmount <= scrollLength) {
        scrollPosition += scrollAmount;
    } else {
        scrollPosition = scrollLength;
    }
    container.scrollTo({
        top: 0,
        left: scrollPosition,
        behavior: 'smooth'
    });
    checkScroll();
});
