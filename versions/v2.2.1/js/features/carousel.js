/**
 * Carousel Module
 * Handles carousel functionality for educational content
 */

import { qs, qsa, addClass, removeClass } from '../core/domHelpers.js';

/**
 * Carousel Class
 * Manages carousel navigation and interactions
 */
export class Carousel {
    constructor(containerId, slides) {
        this.container = qs(`#${containerId}`);
        if (!this.container) {
            console.error(`Carousel container ${containerId} not found`);
            return;
        }

        this.slides = slides;
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.render();
        this.attachEventListeners();
    }

    /**
     * Render carousel HTML
     */
    render() {
        const wrapper = this.container.querySelector('.carousel-content-wrapper');
        if (!wrapper) return;

        // Create slides HTML
        const slidesHTML = this.slides.map((slide, index) => `
            <div class="carousel-slide" data-slide="${index}">
                ${slide.content}
            </div>
        `).join('');

        wrapper.innerHTML = `
            <div class="carousel-wrapper">
                ${slidesHTML}
            </div>
        `;

        // Create progress bar
        this.createProgressBar();

        // Create tab labels
        this.createTabLabels();

        this.updateCarousel();
    }

    /**
     * Create progress bar segments
     */
    createProgressBar() {
        const progressBar = this.container.querySelector('.carousel-progress-bar');
        if (!progressBar) return;

        progressBar.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const segment = document.createElement('div');
            segment.className = 'carousel-progress-segment';
            segment.dataset.slide = index;

            segment.addEventListener('click', () => this.goToSlide(index));

            progressBar.appendChild(segment);
        });
    }

    /**
     * Create tab labels
     */
    createTabLabels() {
        const tabLabels = this.container.querySelector('.carousel-tab-labels');
        if (!tabLabels) return;

        tabLabels.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const label = document.createElement('div');
            label.className = 'carousel-tab-label';
            label.dataset.slide = index;
            label.textContent = this.shortenTitle(slide.title);

            label.addEventListener('click', () => this.goToSlide(index));

            tabLabels.appendChild(label);
        });
    }

    /**
     * Shorten slide title for display
     * @param {string} title - Original title
     * @returns {string} Shortened title
     */
    shortenTitle(title) {
        // Remove emojis and parentheses content
        return title
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/\([^)]*\)/g, '')
            .trim();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Navigation buttons
        const prevBtn = this.container.querySelector('.carousel-btn-prev');
        const nextBtn = this.container.querySelector('.carousel-btn-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Touch/swipe support
        const wrapper = this.container.querySelector('.carousel-content-wrapper');
        if (wrapper) {
            wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            wrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        }

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    /**
     * Go to previous slide
     */
    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    /**
     * Go to next slide
     */
    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }

    /**
     * Update carousel display
     */
    updateCarousel() {
        const wrapper = this.container.querySelector('.carousel-wrapper');
        if (!wrapper) return;

        // Update transform
        const offset = -this.currentSlide * 100;
        wrapper.style.transform = `translateX(${offset}%)`;

        // Update progress segments
        const segments = this.container.querySelectorAll('.carousel-progress-segment');
        segments.forEach((segment, index) => {
            if (index === this.currentSlide) {
                addClass(segment, 'active');
            } else {
                removeClass(segment, 'active');
            }
        });

        // Update tab labels
        const labels = this.container.querySelectorAll('.carousel-tab-label');
        labels.forEach((label, index) => {
            if (index === this.currentSlide) {
                addClass(label, 'active');
            } else {
                removeClass(label, 'active');
            }
        });

        // Update navigation buttons
        const prevBtn = this.container.querySelector('.carousel-btn-prev');
        const nextBtn = this.container.querySelector('.carousel-btn-next');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.slides.length - 1;
        }
    }

    /**
     * Handle touch start
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    /**
     * Handle touch end
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next
                this.next();
            } else {
                // Swiped right - go to previous
                this.prev();
            }
        }
    }
}
