'use strict';
// Get the container element
const container = document.getElementById('scrolling-menu');

const calculateWidth = () => {
    return container.scrollWidth - container.clientWidth; // Subtract the padding
}


let scrollLength = calculateWidth();

// Get the left and right arrow elements
const leftArrow = document.querySelector('.left-arrow .scrolling-arrow-button');
const rightArrow = document.querySelector('.right-arrow .scrolling-arrow-button');

function checkScroll() {
    scrollLength = calculateWidth();
    const currentScroll = container.scrollLeft;
    if (currentScroll === 0) {
        leftArrow.setAttribute("disabled", "true");
        rightArrow.removeAttribute("disabled");
    } else if (currentScroll >= scrollLength) { // Change this line from === to >=
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
    if(scrollPosition - 150 >= 0) scrollPosition -= 300; 
    else scrollPosition = 0;
    container.scrollTo({
        top: 0,
        left: scrollPosition,
        behavior: 'smooth'
    });
    checkScroll();
});

// Add event listener to the right arrow
rightArrow.addEventListener('click', () => {
    if(scrollPosition + 150 <= scrollLength) scrollPosition += 300;
    else scrollPosition = scrollLength;
    container.scrollTo({
        top: 0,
        left: scrollPosition,
        behavior: 'smooth'
    });
    checkScroll();
});
