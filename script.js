// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Smooth scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Fix for mobile hover states
document.addEventListener('DOMContentLoaded', function() {
    function removeHoverOnTouch() {
        if ('ontouchstart' in window) {
            // Remove hover effects for touch devices
            document.body.classList.add('touch-device');
        }
    }
    
    removeHoverOnTouch();
});

// Update URL hash when scrolling to sections
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section-anchor');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        history.replaceState(null, null, `#${currentSection}`);
    }
});

// Photo Gallery Modal Functionality
const modal = document.getElementById('photoModal');
const modalImage = document.querySelector('.modal-image');
const closeBtn = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.modal-prev');
const nextBtn = document.querySelector('.modal-next');

// Get all about photos
const aboutPhotos = document.querySelectorAll('.about-photo');
let currentPhotoIndex = 0;

// Open modal when photo is clicked
aboutPhotos.forEach((photo, index) => {
    photo.addEventListener('click', () => {
        currentPhotoIndex = index;
        openModal();
    });
});

function openModal() {
    modal.classList.add('active');
    updateModalImage();
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

function updateModalImage() {
    const currentPhoto = aboutPhotos[currentPhotoIndex];
    modalImage.classList.remove('loaded');
    
    modalImage.onload = function() {
        modalImage.classList.add('loaded');
    };
    
    modalImage.src = currentPhoto.src;
    modalImage.alt = currentPhoto.alt;
}

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % aboutPhotos.length;
    updateModalImage();
}

function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + aboutPhotos.length) % aboutPhotos.length;
    updateModalImage();
}

// Event listeners
closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', showNextPhoto);
prevBtn.addEventListener('click', showPrevPhoto);

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            showPrevPhoto();
            break;
        case 'ArrowRight':
            showNextPhoto();
            break;
    }
});

// Sticky Navbar Functionality
const navbar = document.querySelector('.hero-navbar');
const heroSection = document.querySelector('.hero-video');

function updateStickyNavbar() {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    
    if (heroBottom <= 0) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}

// Update on scroll
window.addEventListener('scroll', updateStickyNavbar);

// Also update on page load in case page is refreshed partway down
window.addEventListener('load', updateStickyNavbar);

//Video Carousel Functionality - PERFECT SLIDE ALIGNMENT
document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.video-carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const slides = document.querySelectorAll('.video-carousel-slide');
    
    if (!carouselTrack) return;
    
    let currentPosition = 0;
    
    // Get number of slides to show based on screen size
    function getSlidesToShow() {
        const width = window.innerWidth;
        if (width <= 640) return 1;    // Mobile: 1 slide
        if (width <= 900) return 2;    // Tablet: 2 slides
        return 3;                      // Desktop: 3 slides
    }
    
    // Calculate exact scroll amount for perfect alignment
    function getScrollAmount() {
        const slide = slides[0];
        const slideWidth = slide.offsetWidth;
        const gap = parseInt(getComputedStyle(carouselTrack).gap) || 0;
        return slideWidth + gap;
    }
    
    // Arrow navigation
    prevButton.addEventListener('click', () => {
        const slidesToShow = getSlidesToShow();
        scrollToPosition(currentPosition - slidesToShow);
    });
    
    nextButton.addEventListener('click', () => {
        const slidesToShow = getSlidesToShow();
        scrollToPosition(currentPosition + slidesToShow);
    });
    
    function scrollToPosition(position) {
        const slidesToShow = getSlidesToShow();
        const maxPosition = Math.max(0, slides.length - slidesToShow);
        
        // Ensure position is valid
        position = Math.max(0, Math.min(position, maxPosition));
        
        currentPosition = position;
        const scrollAmount = position * getScrollAmount();
        
        carouselTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateArrowVisibility();
    }
    
    // Update arrow visibility
    function updateArrowVisibility() {
        const slidesToShow = getSlidesToShow();
        const maxPosition = Math.max(0, slides.length - slidesToShow);
        
        prevButton.disabled = currentPosition <= 0;
        nextButton.disabled = currentPosition >= maxPosition;
    }
    
    // Touch/swipe functionality with perfect snapping
    let isDragging = false;
    let startPosition = 0;
    let startScrollLeft = 0;
    
    carouselTrack.addEventListener('touchstart', touchStart);
    carouselTrack.addEventListener('touchmove', touchMove);
    carouselTrack.addEventListener('touchend', touchEnd);
    
    function touchStart(e) {
        isDragging = true;
        startPosition = e.touches[0].clientX;
        startScrollLeft = carouselTrack.scrollLeft;
        carouselTrack.style.scrollBehavior = 'auto';
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.touches[0].clientX;
        const diff = startPosition - currentPosition;
        carouselTrack.scrollLeft = startScrollLeft + diff;
    }
    
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.scrollBehavior = 'smooth';
        
        // Perfect snap to nearest slide group
        const scrollLeft = carouselTrack.scrollLeft;
        const scrollAmount = getScrollAmount();
        const slidesToShow = getSlidesToShow();
        
        // Calculate which slide group to snap to
        currentPosition = Math.round(scrollLeft / scrollAmount / slidesToShow) * slidesToShow;
        scrollToPosition(currentPosition);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const slidesToShow = getSlidesToShow();
        if (e.key === 'ArrowLeft') {
            scrollToPosition(currentPosition - slidesToShow);
        } else if (e.key === 'ArrowRight') {
            scrollToPosition(currentPosition + slidesToShow);
        }
    });
    
    // Handle window resize - recalculate and maintain position
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Adjust current position if it would be out of bounds after resize
            const slidesToShow = getSlidesToShow();
            const maxPosition = Math.max(0, slides.length - slidesToShow);
            
            if (currentPosition > maxPosition) {
                currentPosition = maxPosition;
            }
            
            // Scroll to maintain visual position
            scrollToPosition(currentPosition);
        }, 150);
    });
    
    // Initialize
    updateArrowVisibility();
    
    // Ensure perfect initial alignment
    setTimeout(() => {
        scrollToPosition(0);
    }, 100);
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
    
    if (hamburgerMenu && mobileNav) {
        // Toggle mobile navigation
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile nav when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile nav when clicking outside
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});