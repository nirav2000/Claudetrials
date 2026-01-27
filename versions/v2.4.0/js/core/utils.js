/**
 * Utility Functions
 * General helper functions used throughout the application
 */

/**
 * Compare two fractions
 * @param {number} num1 - First numerator
 * @param {number} denom1 - First denominator
 * @param {number} num2 - Second numerator
 * @param {number} denom2 - Second denominator
 * @returns {string} Comparison operator ('<', '>', '=')
 */
export function compareFractions(num1, denom1, num2, denom2) {
    const val1 = num1 / denom1;
    const val2 = num2 / denom2;

    if (Math.abs(val1 - val2) < 0.0001) return '=';
    return val1 < val2 ? '<' : '>';
}

/**
 * Get greatest common divisor
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} GCD
 */
export function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Simplify a fraction
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @returns {Object} Simplified fraction {numerator, denominator}
 */
export function simplifyFraction(numerator, denominator) {
    const divisor = gcd(numerator, denominator);
    return {
        numerator: numerator / divisor,
        denominator: denominator / divisor
    };
}

/**
 * Check if two fractions are equivalent
 * @param {number} num1 - First numerator
 * @param {number} denom1 - First denominator
 * @param {number} num2 - Second numerator
 * @param {number} denom2 - Second denominator
 * @returns {boolean} True if equivalent
 */
export function areEquivalent(num1, denom1, num2, denom2) {
    return num1 * denom2 === num2 * denom1;
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random element from array
 * @param {Array} array - Input array
 * @returns {*} Random element
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Get operator name for display
 * @param {string} operator - Operator symbol
 * @returns {string} Operator name
 */
export function getOperatorName(operator) {
    const names = {
        '<': 'less than',
        '>': 'greater than',
        '=': 'equal to'
    };
    return names[operator] || operator;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
