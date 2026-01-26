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
import { showHint } from './features/visualAids.js';
import { Carousel } from './features/carousel.js';
import { historySlides, strategiesSlides, misconceptionsSlides } from './features/educationalContent.js';
import { loadVersionManifest } from './version/versionManager.js';
import { initializeVersionUI } from './version/versionUI.js';

// Application State
let problems = [];
let currentInputMethod = CONFIG.DEFAULT_INPUT_METHOD;

/**
 * Initialize application
 */
async function init() {
    // Load version manifest
    await loadVersionManifest();
    initializeVersionUI();

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

    // Attach event listeners
    attachEventListeners();

    // Setup collapsible sections
    setupCollapsibleSections();

    // Generate initial worksheet
    generateWorksheet();
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
            }
        }
    });
}

/**
 * Generate worksheet
 */
function generateWorksheet() {
    const problemCount = parseInt(qs('#problem-count')?.value || CONFIG.DEFAULT_PROBLEM_COUNT);
    const denominatorSet = qs('#denominator-set')?.value || 'default';
    const denominators = CONFIG.DENOMINATOR_SETS[denominatorSet];
    const useCommonMistakes = qs('#common-mistakes')?.checked || false;

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
            title: 'Click for hint'
        }, `${index + 1}.`);

        number.addEventListener('click', () => {
            showHint(index, problem);
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
    switch (method) {
        case CONFIG.INPUT_METHODS.KEYBOARD:
            return renderKeyboardInput(index, value);
        case CONFIG.INPUT_METHODS.BUTTONS:
            return renderButtonInput(index, value);
        case CONFIG.INPUT_METHODS.DRAWING:
            return renderDrawingInput(index, value);
        case CONFIG.INPUT_METHODS.VOICE:
            return renderVoiceInput(index);
        default:
            return renderKeyboardInput(index, value);
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

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
