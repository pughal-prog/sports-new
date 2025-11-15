// Championship Carousel Functionality
let currentChampionshipSlide = 0;
const championshipSlides = document.querySelectorAll('.championship-carousel .carousel-slide');
const championshipIndicators = document.querySelectorAll('.championship-carousel .indicator');

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    if (championshipSlides.length > 0) {
        showChampionshipSlide(0);
        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            changeChampionshipSlide(1);
        }, 5000);
    }

});

// Change slide by direction (-1 for previous, 1 for next)
function changeChampionshipSlide(direction) {
    currentChampionshipSlide += direction;

    if (currentChampionshipSlide >= championshipSlides.length) {
        currentChampionshipSlide = 0;
    } else if (currentChampionshipSlide < 0) {
        currentChampionshipSlide = championshipSlides.length - 1;
    }

    showChampionshipSlide(currentChampionshipSlide);
}

// Go to specific slide
function goToChampionshipSlide(index) {
    if (index >= 0 && index < championshipSlides.length) {
        currentChampionshipSlide = index;
        showChampionshipSlide(currentChampionshipSlide);
    }
}

// Show specific slide
function showChampionshipSlide(index) {
    // Hide all slides
    championshipSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (championshipIndicators[i]) {
            championshipIndicators[i].classList.remove('active');
        }
    });

    // Show current slide
    if (championshipSlides[index]) {
        championshipSlides[index].classList.add('active');
    }

    if (championshipIndicators[index]) {
        championshipIndicators[index].classList.add('active');
    }
}

