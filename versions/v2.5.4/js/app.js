/**
 * Main Application Entry Point
 * Orchestrates the Interactive Fraction Comparison Application
 */

import { CONFIG } from './core/config.js';
import { qs, qsa, createElement, createFractionElement, empty } from './core/domHelpers.js';
import { generateProblems, generateMistakesProblems } from './features/problemGenerator.js';
import { renderKeyboardInput, renderButtonInput, renderDrawingInput, renderVoiceInput } from './features/inputMethods.js';
import { checkAnswers, showAnswers, clearAnswers, updateScoreDisplay } from './features/checkAnswers.js';
import { initializeVoiceRecognition, startVoiceRecognition, isVoiceSupported } from './features/voiceRecognition.js';
import { printWorksheet, downloadPDF, setupPrintListeners } from './features/printExport.js';
import { showHint, toggleHint } from './features/visualAids.js';
import { Carousel } from './features/carousel.js';
import { historySlides, strategiesSlides, misconceptionsSlides } from './features/educationalContent.js';
import { initializeEducationalVisuals } from './features/educationalVisuals.js';
import fractionAppAuth from './auth-integration.js';

// Application State
let problems = [];
let currentInputMethod = CONFIG.DEFAULT_INPUT_METHOD;
let problemTimers = {}; // Track timers for hint timeout

/**
 * Initialize application
 */
async function init() {
    console.log('🚀 Starting application initialization...');

    // Initialize authentication system (non-blocking)
    // Run auth initialization but don't wait for it
    if (fractionAppAuth && fractionAppAuth.initialize) {
        fractionAppAuth.initialize().catch(error => {
            console.error('Authentication initialization failed:', error);
            // App continues regardless
        });
    } else {
        console.warn('⚠ Authentication module not available');
    }

    // Initialize voice recognition if supported
    if (isVoiceSupported()) {
        initializeVoiceRecognition();
    } else {
        // Hide voice option if not supported
        const voiceOption = qs('option[value="voice"]');
        if (voiceOption) voiceOption.remove();
    }

    // Setup print listeners
    setupPrintListeners();

    // Initialize carousels
    initializeCarousels();

    // Initialize educational visuals
    initializeEducationalVisuals();

    // Attach event listeners
    attachEventListeners();

    // Setup collapsible sections
    setupCollapsibleSections();

    // Generate initial worksheet
    generateWorksheet();

    console.log('✅ Application initialized successfully');
}

/**
 * Initialize carousels for educational content
 */
function initializeCarousels() {
    new Carousel('history-carousel', historySlides);
    new Carousel('strategies-carousel', strategiesSlides);
    new Carousel('misconceptions-carousel', misconceptionsSlides);
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Input method change
    qs('#input-method')?.addEventListener('change', (e) => {
        currentInputMethod = e.target.value;
        renderProblems();
    });

    // Common mistakes toggle
    qs('#common-mistakes')?.addEventListener('change', (e) => {
        const mistakeTypesSection = qs('#mistake-types-section');
        if (mistakeTypesSection) {
            mistakeTypesSection.classList.toggle('show', e.target.checked);
        }
    });

    // Button actions
    qs('#generate-btn')?.addEventListener('click', generateWorksheet);
    qs('#check-btn')?.addEventListener('click', handleCheckAnswers);
    qs('#show-answers-btn')?.addEventListener('click', handleShowAnswers);
    qs('#clear-btn')?.addEventListener('click', handleClearAnswers);
    qs('#print-btn')?.addEventListener('click', printWorksheet);
    qs('#pdf-btn')?.addEventListener('click', downloadPDF);

    // Operator selection events (event delegation)
    document.addEventListener('operatorSelected', (e) => {
        const { index, operator } = e.detail;
        if (problems[index]) {
            problems[index].userAnswer = operator;
            clearProblemTimer(index); // Clear timer when answer is selected
        }
    });

    // Voice start events
    document.addEventListener('voiceStart', (e) => {
        const { index } = e.detail;
        startVoiceRecognition(index);
    });

    // Keyboard input change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('operator-input')) {
            const index = parseInt(e.target.dataset.problemIndex);
            if (problems[index]) {
                problems[index].userAnswer = e.target.value;
                clearProblemTimer(index); // Clear timer when answer is entered
            }
        }
    });
}

/**
 * Generate worksheet
 */
function generateWorksheet() {
    const problemCount = parseInt(qs('#problem-count')?.value || CONFIG.DEFAULT_PROBLEM_COUNT);
    const denominatorSet = qs('#denominator-set')?.value || 'easiest';
    const denominators = CONFIG.DENOMINATOR_SETS[denominatorSet];
    const useCommonMistakes = qs('#common-mistakes')?.checked || false;

    // Clear existing timers
    clearAllTimers();

    if (useCommonMistakes) {
        const enabledMistakes = Array.from(qsa('.mistake-type-checkbox:checked'))
            .map(cb => cb.value);
        problems = generateMistakesProblems(problemCount, denominators, enabledMistakes);
    } else {
        problems = generateProblems(problemCount, denominators);
    }

    renderProblems();

    // Hide score
    qs('.score')?.classList.remove('show');

    // Start timers for hint timeout
    startAllTimers();
}

/**
 * Render problems to DOM
 */
function renderProblems() {
    const container = qs('#problems-container');
    if (!container) return;

    empty(container);

    problems.forEach((problem, index) => {
        const problemDiv = createElement('div', {
            className: 'problem',
            dataset: { problemIndex: index }
        });

        // Problem number (clickable for hint)
        const number = createElement('span', {
            className: 'problem-number',
            title: 'Click to toggle hint'
        }, `${index + 1}.`);

        number.addEventListener('click', () => {
            toggleHint(index, problem);
        });

        // First fraction
        const fraction1 = createFractionElement(problem.num1, problem.denom1);

        // Input area
        const inputArea = createElement('div', { className: 'input-area' });
        const input = renderInput(index, currentInputMethod, problem.userAnswer);
        inputArea.appendChild(input);

        // Second fraction
        const fraction2 = createFractionElement(problem.num2, problem.denom2);

        problemDiv.appendChild(number);
        problemDiv.appendChild(fraction1);
        problemDiv.appendChild(inputArea);
        problemDiv.appendChild(fraction2);

        container.appendChild(problemDiv);
    });
}

/**
 * Render input based on method
 */
function renderInput(index, method, value = '') {
    // Ensure value is never null or undefined
    const safeValue = value || '';

    switch (method) {
        case CONFIG.INPUT_METHODS.KEYBOARD:
            return renderKeyboardInput(index, safeValue);
        case CONFIG.INPUT_METHODS.BUTTONS:
            return renderButtonInput(index, safeValue);
        case CONFIG.INPUT_METHODS.DRAWING:
            return renderDrawingInput(index, safeValue);
        case CONFIG.INPUT_METHODS.VOICE:
            return renderVoiceInput(index);
        default:
            return renderKeyboardInput(index, safeValue);
    }
}

/**
 * Handle check answers
 */
function handleCheckAnswers() {
    const score = checkAnswers(problems);
    updateScoreDisplay(score, problems.length);
}

/**
 * Handle show answers
 */
function handleShowAnswers() {
    showAnswers(problems);
    const score = checkAnswers(problems);
    updateScoreDisplay(score, problems.length);
}

/**
 * Handle clear answers
 */
function handleClearAnswers() {
    clearAnswers(problems);
}

/**
 * Setup collapsible sections
 */
function setupCollapsibleSections() {
    qsa('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            if (content) {
                content.classList.toggle('show');
            }
        });
    });
}

/**
 * Start hint timeout timer for a specific problem
 * @param {number} index - Problem index
 */
function startProblemTimer(index) {
    const timeout = parseInt(qs('#hint-timeout')?.value || 0);
    if (timeout === 0) return; // Timer disabled

    // Clear existing timer if any
    if (problemTimers[index]) {
        clearTimeout(problemTimers[index]);
    }

    // Start new timer
    problemTimers[index] = setTimeout(() => {
        // Only show hint if problem hasn't been answered yet
        if (!problems[index]?.userAnswer) {
            showHint(index, problems[index]);
        }
    }, timeout * 1000); // Convert seconds to milliseconds
}

/**
 * Start timers for all problems
 */
function startAllTimers() {
    const timeout = parseInt(qs('#hint-timeout')?.value || 0);
    if (timeout === 0) return; // Timer disabled

    problems.forEach((_, index) => {
        startProblemTimer(index);
    });
}

/**
 * Clear timer for a specific problem
 * @param {number} index - Problem index
 */
function clearProblemTimer(index) {
    if (problemTimers[index]) {
        clearTimeout(problemTimers[index]);
        delete problemTimers[index];
    }
}

/**
 * Clear all timers
 */
function clearAllTimers() {
    Object.keys(problemTimers).forEach(index => {
        clearTimeout(problemTimers[index]);
    });
    problemTimers = {};
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
