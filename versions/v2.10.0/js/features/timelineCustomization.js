/**
 * Timeline Icon Customization Module
 * Allows users to customize skin tones of family emojis in the timeline
 */

// Skin tone modifiers (Unicode)
const SKIN_TONES = {
    'default': '', // Default yellow emoji
    'light': '🏻',
    'mediumLight': '🏼',
    'medium': '🏽',
    'mediumDark': '🏾',
    'dark': '🏿'
};

// Default emojis
const BASE_EMOJIS = {
    grandma: '👵',
    grandpa: '👴',
    mother: '👩',
    father: '👨',
    child: '🧒'
};

// Storage key
const STORAGE_KEY = 'timeline_customization';

/**
 * Get saved customization from localStorage
 * @returns {Object} Customization settings
 */
export function getCustomization() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load timeline customization:', error);
    }

    // Default to medium skin tone
    return {
        grandma: 'medium',
        grandpa: 'medium',
        mother: 'medium',
        father: 'medium',
        child: 'medium'
    };
}

/**
 * Save customization to localStorage
 * @param {Object} customization - Customization settings
 */
export function saveCustomization(customization) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
        console.log('✅ Timeline customization saved');
        return true;
    } catch (error) {
        console.error('❌ Failed to save timeline customization:', error);
        return false;
    }
}

/**
 * Get emoji with applied skin tone
 * @param {string} type - Emoji type (grandma, grandpa, etc.)
 * @param {string} skinTone - Skin tone key
 * @returns {string} Emoji with skin tone
 */
export function getCustomizedEmoji(type, skinTone) {
    const baseEmoji = BASE_EMOJIS[type];
    const toneModifier = SKIN_TONES[skinTone] || '';
    return baseEmoji + toneModifier;
}

/**
 * Apply customization to the timeline in the DOM
 */
export function applyCustomization() {
    const customization = getCustomization();

    // Build customized emojis
    const grandparentsEmojis = `${getCustomizedEmoji('grandma', customization.grandma)}${getCustomizedEmoji('grandpa', customization.grandpa)}`;
    const parentsEmojis = `${getCustomizedEmoji('father', customization.father)}${getCustomizedEmoji('mother', customization.mother)}`;
    const childEmoji = getCustomizedEmoji('child', customization.child);

    // Find and update timeline content
    // The timeline is in the carousel slides, so we need to update the slide content
    const slideContent = document.querySelector('.carousel-slide.active');
    if (slideContent) {
        const content = slideContent.innerHTML;

        // Replace the emojis in the content
        const updatedContent = content
            .replace(/👵🏻👴🏻|👵🏼👴🏼|👵🏽👴🏽|👵🏾👴🏾|👵🏿👴🏿|👵👴/g, grandparentsEmojis)
            .replace(/👨🏻👩🏻|👨🏼👩🏼|👨🏽👩🏽|👨🏾👩🏾|👨🏿👩🏿|👨👩/g, parentsEmojis)
            .replace(/🧒🏻|🧒🏼|🧒🏽|🧒🏾|🧒🏿|🧒/g, childEmoji);

        if (content !== updatedContent) {
            slideContent.innerHTML = updatedContent;
            console.log('✅ Timeline customization applied');
        }
    }
}

/**
 * Show customization modal
 */
export function showCustomizationModal() {
    const customization = getCustomization();

    const modal = document.createElement('div');
    modal.className = 'timeline-custom-modal-overlay';
    modal.innerHTML = `
        <div class="timeline-custom-modal">
            <button class="timeline-custom-close">&times;</button>
            <div class="timeline-custom-content">
                <h2>🎨 Customize Timeline Icons</h2>
                <p style="color: #666; margin-bottom: 24px;">
                    Choose skin tones for your family members in the timeline
                </p>

                <div class="timeline-custom-grid">
                    <!-- Grandparents -->
                    <div class="timeline-custom-group">
                        <h3>👵👴 Grandparents (1950)</h3>
                        <div class="timeline-custom-row">
                            <div class="timeline-custom-item">
                                <label>Grandma</label>
                                <div class="timeline-custom-options">
                                    ${Object.keys(SKIN_TONES).map(tone => `
                                        <button class="timeline-custom-btn ${customization.grandma === tone ? 'selected' : ''}"
                                                data-person="grandma"
                                                data-tone="${tone}"
                                                title="${tone}">
                                            ${getCustomizedEmoji('grandma', tone)}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="timeline-custom-item">
                                <label>Grandpa</label>
                                <div class="timeline-custom-options">
                                    ${Object.keys(SKIN_TONES).map(tone => `
                                        <button class="timeline-custom-btn ${customization.grandpa === tone ? 'selected' : ''}"
                                                data-person="grandpa"
                                                data-tone="${tone}"
                                                title="${tone}">
                                            ${getCustomizedEmoji('grandpa', tone)}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Parents -->
                    <div class="timeline-custom-group">
                        <h3>👨👩 Parents (1980)</h3>
                        <div class="timeline-custom-row">
                            <div class="timeline-custom-item">
                                <label>Father</label>
                                <div class="timeline-custom-options">
                                    ${Object.keys(SKIN_TONES).map(tone => `
                                        <button class="timeline-custom-btn ${customization.father === tone ? 'selected' : ''}"
                                                data-person="father"
                                                data-tone="${tone}"
                                                title="${tone}">
                                            ${getCustomizedEmoji('father', tone)}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="timeline-custom-item">
                                <label>Mother</label>
                                <div class="timeline-custom-options">
                                    ${Object.keys(SKIN_TONES).map(tone => `
                                        <button class="timeline-custom-btn ${customization.mother === tone ? 'selected' : ''}"
                                                data-person="mother"
                                                data-tone="${tone}"
                                                title="${tone}">
                                            ${getCustomizedEmoji('mother', tone)}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Child -->
                    <div class="timeline-custom-group">
                        <h3>🧒 You (2016)</h3>
                        <div class="timeline-custom-row">
                            <div class="timeline-custom-item">
                                <label>Child</label>
                                <div class="timeline-custom-options">
                                    ${Object.keys(SKIN_TONES).map(tone => `
                                        <button class="timeline-custom-btn ${customization.child === tone ? 'selected' : ''}"
                                                data-person="child"
                                                data-tone="${tone}"
                                                title="${tone}">
                                            ${getCustomizedEmoji('child', tone)}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="timeline-custom-actions">
                    <button class="timeline-custom-save">Save & Apply</button>
                    <button class="timeline-custom-reset">Reset to Default</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Current selection state
    let currentCustomization = { ...customization };

    // Handle icon selection
    modal.querySelectorAll('.timeline-custom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const person = btn.dataset.person;
            const tone = btn.dataset.tone;

            // Update selection
            currentCustomization[person] = tone;

            // Update UI
            modal.querySelectorAll(`[data-person="${person}"]`).forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
        });
    });

    // Save button
    modal.querySelector('.timeline-custom-save').addEventListener('click', () => {
        saveCustomization(currentCustomization);
        applyCustomization();
        modal.remove();

        // Show success notification
        showNotification('✅ Timeline customization saved!', 'success');
    });

    // Reset button
    modal.querySelector('.timeline-custom-reset').addEventListener('click', () => {
        const defaultCustomization = {
            grandma: 'medium',
            grandpa: 'medium',
            mother: 'medium',
            father: 'medium',
            child: 'medium'
        };

        saveCustomization(defaultCustomization);
        modal.remove();
        showCustomizationModal(); // Reopen with defaults
        applyCustomization();

        showNotification('🔄 Reset to default', 'success');
    });

    // Close button
    modal.querySelector('.timeline-custom-close').addEventListener('click', () => {
        modal.remove();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * Show simple notification
 * @param {string} message
 * @param {string} type
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `timeline-notification timeline-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Initialize timeline customization
 */
export function initializeTimelineCustomization() {
    // Apply saved customization on load
    applyCustomization();

    // Add customization button to the timeline slide if it exists
    setTimeout(() => {
        const firstSlide = document.querySelector('.carousel-slide');
        if (firstSlide && firstSlide.textContent.includes('Grandparents')) {
            addCustomizationButton();
        }
    }, 1000);

    console.log('🎨 Timeline customization initialized');
}

/**
 * Add customization button to the page
 */
function addCustomizationButton() {
    // Check if button already exists
    if (document.getElementById('timeline-customize-btn')) {
        return;
    }

    // Find the Learning Guide section
    const learningGuide = document.querySelector('.learning-guide');
    if (!learningGuide) return;

    // Create button
    const button = document.createElement('button');
    button.id = 'timeline-customize-btn';
    button.className = 'timeline-customize-trigger';
    button.innerHTML = '🎨 Customize Timeline Icons';
    button.title = 'Customize skin tones for family emojis in the timeline';

    button.addEventListener('click', showCustomizationModal);

    // Insert before the first carousel
    const firstCarousel = learningGuide.querySelector('.carousel');
    if (firstCarousel) {
        firstCarousel.parentNode.insertBefore(button, firstCarousel);
    }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initializeTimelineCustomization();
    });
}
