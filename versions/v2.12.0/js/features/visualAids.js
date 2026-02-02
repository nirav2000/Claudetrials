/**
 * Visual Aids Module
 * Generates and displays pizza diagrams and hints
 */

import { createElement } from '../core/domHelpers.js';
import { getOperatorName } from '../core/utils.js';
import { CONFIG } from '../core/config.js';
import { createCircleChart } from '../utils/circleChart.js';

/**
 * Generate SVG pizza diagram
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @param {number} size - SVG size in pixels
 * @returns {SVGElement} SVG element
 */
export function generatePizzaDiagram(numerator, denominator, size = 80) {
    return createCircleChart({
        numerator,
        denominator,
        size,
        filledColor: CONFIG.PIZZA_COLORS.FILLED,
        emptyColor: CONFIG.PIZZA_COLORS.EMPTY,
        borderColor: CONFIG.PIZZA_COLORS.BORDER
    });
}

/**
 * Get mistake explanation text
 * @param {string} mistakeType - Type of mistake
 * @returns {string} Explanation text
 */
function getMistakeExplanation(mistakeType) {
    const explanations = {
        [CONFIG.MISTAKE_TYPES.HIGHER_DENOMINATOR]:
            'Higher denominator means smaller pieces! More slices = smaller slices.',
        [CONFIG.MISTAKE_TYPES.BOTH_HIGHER]:
            'Both numbers are higher, but what matters is the portion of the whole.',
        [CONFIG.MISTAKE_TYPES.UNIT_FRACTION]:
            'When numerator is 1, the fraction with the larger denominator is smaller.',
        [CONFIG.MISTAKE_TYPES.NEAR_WHOLE]:
            'Compare how far each fraction is from 1 whole.',
        [CONFIG.MISTAKE_TYPES.EQUIVALENT]:
            'These fractions represent the same amount - they are equivalent!'
    };

    return explanations[mistakeType] || 'Compare the visual representations to see the difference.';
}

/**
 * Create visual aid element
 * @param {Object} problem - Problem object
 * @returns {HTMLElement} Visual aid element
 */
export function createVisualAid(problem) {
    const { num1, denom1, num2, denom2, correctAnswer, mistakeType } = problem;

    const container = createElement('div', { className: 'visual-aids' });

    // Title
    const title = createElement('div', { className: 'hint-title' }, 'Visual Aid:');
    container.appendChild(title);

    // Content wrapper
    const content = createElement('div', { className: 'hint-content' });

    // Fraction display with pizzas
    const fractionDisplay = createElement('div', { className: 'hint-fraction-display' });

    // First pizza
    const pizza1Container = createElement('div', { className: 'pizza-diagram' });
    const pizza1 = generatePizzaDiagram(num1, denom1);
    const label1 = createElement('div', { className: 'pizza-label' }, `${num1}/${denom1}`);
    pizza1Container.appendChild(pizza1);
    pizza1Container.appendChild(label1);
    fractionDisplay.appendChild(pizza1Container);

    // Operator
    const operatorSpan = createElement('span', { style: 'font-size: 1.5em; font-weight: bold;' }, correctAnswer);
    fractionDisplay.appendChild(operatorSpan);

    // Second pizza
    const pizza2Container = createElement('div', { className: 'pizza-diagram' });
    const pizza2 = generatePizzaDiagram(num2, denom2);
    const label2 = createElement('div', { className: 'pizza-label' }, `${num2}/${denom2}`);
    pizza2Container.appendChild(pizza2);
    pizza2Container.appendChild(label2);
    fractionDisplay.appendChild(pizza2Container);

    content.appendChild(fractionDisplay);

    // Explanation
    const explanation = createElement('div', { className: 'hint-explanation' });
    const correctText = createElement('strong', {}, `Correct answer: ${num1}/${denom1} ${getOperatorName(correctAnswer)} ${num2}/${denom2}`);
    explanation.appendChild(correctText);

    if (mistakeType) {
        const mistakeText = createElement('p', {}, getMistakeExplanation(mistakeType));
        explanation.appendChild(mistakeText);
    }

    const generalHint = createElement('p', {},
        `${num1}/${denom1} = ${(num1 / denom1).toFixed(3)} and ${num2}/${denom2} = ${(num2 / denom2).toFixed(3)}`
    );
    explanation.appendChild(generalHint);

    content.appendChild(explanation);
    container.appendChild(content);

    return container;
}

/**
 * Show hint in a modal popup
 * @param {number} index - Problem index
 * @param {Object} problem - Problem object
 */
export function showHint(index, problem) {
    showHintModal(index, problem);
}

/**
 * Hide all hints
 */
export function hideAllHints() {
    const hints = document.querySelectorAll('.visual-aids');
    hints.forEach(hint => hint.remove());

    // Also close any open modal
    const modal = document.querySelector('.hint-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * Toggle hint visibility for a specific problem
 * @param {number} index - Problem index
 * @param {Object} problem - Problem object
 */
export function toggleHint(index, problem) {
    // Check if modal already exists
    const existingModal = document.querySelector('.hint-modal-overlay');
    if (existingModal) {
        // Modal exists, close it
        existingModal.remove();
    } else {
        // Modal doesn't exist, show it
        showHintModal(index, problem);
    }
}

/**
 * Show hint in a modal overlay
 * @param {number} index - Problem index
 * @param {Object} problem - Problem object
 */
function showHintModal(index, problem) {
    const { num1, denom1, num2, denom2, correctAnswer, mistakeType } = problem;

    // Create modal overlay
    const overlay = createElement('div', { className: 'hint-modal-overlay' });

    // Create modal content
    const modal = createElement('div', { className: 'hint-modal' });

    // Close button
    const closeBtn = createElement('button', {
        className: 'hint-modal-close',
        innerHTML: '&times;',
        title: 'Close hint'
    });

    // Header
    const header = createElement('div', { className: 'hint-modal-header' });
    const title = createElement('h3', {}, `Problem ${index + 1} - Visual Aid`);
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', { className: 'hint-modal-body' });

    // Fraction display with pizzas
    const fractionDisplay = createElement('div', { className: 'hint-fraction-display' });

    // First pizza
    const pizza1Container = createElement('div', { className: 'pizza-diagram' });
    const pizza1 = generatePizzaDiagram(num1, denom1, 120);
    const label1 = createElement('div', { className: 'pizza-label' }, `${num1}/${denom1}`);
    pizza1Container.appendChild(pizza1);
    pizza1Container.appendChild(label1);
    fractionDisplay.appendChild(pizza1Container);

    // Operator
    const operatorSpan = createElement('div', {
        className: 'hint-operator',
        style: 'font-size: 2.5em; font-weight: bold; color: #6200EA;'
    }, correctAnswer);
    fractionDisplay.appendChild(operatorSpan);

    // Second pizza
    const pizza2Container = createElement('div', { className: 'pizza-diagram' });
    const pizza2 = generatePizzaDiagram(num2, denom2, 120);
    const label2 = createElement('div', { className: 'pizza-label' }, `${num2}/${denom2}`);
    pizza2Container.appendChild(pizza2);
    pizza2Container.appendChild(label2);
    fractionDisplay.appendChild(pizza2Container);

    body.appendChild(fractionDisplay);

    // Explanation section
    const explanation = createElement('div', { className: 'hint-explanation' });

    const correctText = createElement('div', { className: 'hint-correct-answer' },
        `${num1}/${denom1} ${getOperatorName(correctAnswer)} ${num2}/${denom2}`
    );
    explanation.appendChild(correctText);

    if (mistakeType) {
        const mistakeBox = createElement('div', { className: 'hint-mistake-box' });
        const mistakeTitle = createElement('strong', {}, 'Common Mistake Pattern:');
        const mistakeText = createElement('p', {}, getMistakeExplanation(mistakeType));
        mistakeBox.appendChild(mistakeTitle);
        mistakeBox.appendChild(mistakeText);
        explanation.appendChild(mistakeBox);
    }

    const decimalHint = createElement('div', { className: 'hint-decimal' },
        `${num1}/${denom1} = ${(num1 / denom1).toFixed(3)} and ${num2}/${denom2} = ${(num2 / denom2).toFixed(3)}`
    );
    explanation.appendChild(decimalHint);

    body.appendChild(explanation);

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);

    // Event listeners
    closeBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Add to DOM
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => overlay.classList.add('show'), 10);
}
