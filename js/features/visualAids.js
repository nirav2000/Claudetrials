/**
 * Visual Aids Module
 * Generates and displays pizza diagrams and hints
 */

import { createElement } from '../core/domHelpers.js';
import { getOperatorName } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

/**
 * Generate SVG pizza diagram
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @param {number} size - SVG size in pixels
 * @returns {SVGElement} SVG element
 */
export function generatePizzaDiagram(numerator, denominator, size = 80) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 2;

    // Draw outer circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', centerX);
    outerCircle.setAttribute('cy', centerY);
    outerCircle.setAttribute('r', radius);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', CONFIG.PIZZA_COLORS.BORDER);
    outerCircle.setAttribute('stroke-width', '2');
    svg.appendChild(outerCircle);

    // Draw slices
    const anglePerSlice = (2 * Math.PI) / denominator;

    for (let i = 0; i < denominator; i++) {
        const startAngle = i * anglePerSlice - Math.PI / 2;
        const endAngle = startAngle + anglePerSlice;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        // Create slice path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArc = anglePerSlice > Math.PI ? 1 : 0;

        const d = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        path.setAttribute('d', d);
        path.setAttribute('fill', i < numerator ? CONFIG.PIZZA_COLORS.FILLED : CONFIG.PIZZA_COLORS.EMPTY);
        path.setAttribute('stroke', CONFIG.PIZZA_COLORS.BORDER);
        path.setAttribute('stroke-width', '1');
        svg.appendChild(path);
    }

    return svg;
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
 * Show hint for a specific problem
 * @param {number} index - Problem index
 * @param {Object} problem - Problem object
 */
export function showHint(index, problem) {
    const problemElement = document.querySelector(`[data-problem-index="${index}"]`);
    if (!problemElement) return;

    // Check if hint already exists
    let existingHint = problemElement.querySelector('.visual-aids');
    if (existingHint) {
        existingHint.remove();
    }

    // Create and append new hint
    const hint = createVisualAid(problem);
    problemElement.appendChild(hint);
}

/**
 * Hide all hints
 */
export function hideAllHints() {
    const hints = document.querySelectorAll('.visual-aids');
    hints.forEach(hint => hint.remove());
}
