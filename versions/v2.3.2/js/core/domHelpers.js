/**
 * DOM Helper Functions
 * Utilities for DOM manipulation and element creation
 */

/**
 * Create an element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Node|Array} content - Element content
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attributes = {}, content = null) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on')) {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });

    // Add content
    if (content !== null) {
        if (Array.isArray(content)) {
            content.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
        } else if (content instanceof Node) {
            element.appendChild(content);
        } else {
            element.textContent = String(content);
        }
    }

    return element;
}

/**
 * Create fraction display element
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @returns {HTMLElement} Fraction element
 */
export function createFractionElement(numerator, denominator) {
    const fraction = createElement('span', { className: 'fraction' });
    const num = createElement('span', { className: 'numerator' }, String(numerator));
    const denom = createElement('span', { className: 'denominator' }, String(denominator));

    fraction.appendChild(num);
    fraction.appendChild(denom);

    return fraction;
}

/**
 * Query selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {Element|null} Found element
 */
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {NodeList} Found elements
 */
export function qsa(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Add class to element
 * @param {Element} element - Target element
 * @param {...string} classes - Classes to add
 */
export function addClass(element, ...classes) {
    if (element) {
        element.classList.add(...classes);
    }
}

/**
 * Remove class from element
 * @param {Element} element - Target element
 * @param {...string} classes - Classes to remove
 */
export function removeClass(element, ...classes) {
    if (element) {
        element.classList.remove(...classes);
    }
}

/**
 * Toggle class on element
 * @param {Element} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} force - Force add/remove
 */
export function toggleClass(element, className, force) {
    if (element) {
        element.classList.toggle(className, force);
    }
}

/**
 * Show element
 * @param {Element} element - Element to show
 * @param {string} display - Display type (default: 'block')
 */
export function show(element, display = 'block') {
    if (element) {
        element.style.display = display;
    }
}

/**
 * Hide element
 * @param {Element} element - Element to hide
 */
export function hide(element) {
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Empty element (remove all children)
 * @param {Element} element - Element to empty
 */
export function empty(element) {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

/**
 * Set attributes on element
 * @param {Element} element - Target element
 * @param {Object} attributes - Attributes object
 */
export function setAttributes(element, attributes) {
    if (element) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
}
