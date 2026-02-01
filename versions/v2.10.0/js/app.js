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
import { registerServiceWorker, initializeOfflineDetection } from './core/offline-support.js';
import { initializeTimelineCustomization } from './features/timelineCustomization.js';

// Import auth module (optional - app continues without it)
let fractionAppAuth = null;
try {
    const authModule = await import('./auth-integration.js');
    fractionAppAuth = authModule.default;
} catch (error) {
    console.warn('Authentication module not available:', error.message);
}

// Application State
let problems = [];
let currentInputMethod = CONFIG.DEFAULT_INPUT_METHOD;
let problemTimers = {}; // Track timers for hint timeout
let currentWorksheetId = null; // Current worksheet unique ID
let worksheetStartTime = null; // When worksheet was generated

/**
 * Generate a simple UUID for worksheet tracking
 * @returns {string} UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get current worksheet settings
 * @returns {Object} Current settings
 */
function getCurrentSettings() {
    const problemCount = parseInt(qs('#problem-count')?.value || CONFIG.DEFAULT_PROBLEM_COUNT);
    const denominatorSet = qs('#denominator-set')?.value || 'easiest';
    const inputMethod = qs('#input-method')?.value || CONFIG.DEFAULT_INPUT_METHOD;
    const useCommonMistakes = qs('#common-mistakes')?.checked || false;
    const hintTimeout = parseInt(qs('#hint-timeout')?.value || 0);

    const settings = {
        problemCount,
        denominatorSet,
        inputMethod,
        useCommonMistakes,
        hintTimeout
    };

    if (useCommonMistakes) {
        settings.enabledMistakeTypes = Array.from(qsa('.mistake-type-checkbox:checked'))
            .map(cb => cb.value);
    }

    return settings;
}

/**
 * Initialize application
 */
async function init() {
    try {
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

        // Initialize offline support (service worker and offline detection)
        registerServiceWorker().catch(error => {
            console.warn('Service Worker registration failed:', error);
            // App continues without offline support
        });
        initializeOfflineDetection();

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

        // Initialize timeline customization
        initializeTimelineCustomization();

        // Attach event listeners
        attachEventListeners();

        // Setup collapsible sections
        setupCollapsibleSections();

        // Generate initial worksheet
        generateWorksheet();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Application initialization failed:', error);

        // Show error on page
        const container = qs('#problems-container');
        if (container) {
            container.innerHTML = `
                <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #c62828; margin-top: 0;">App Initialization Error</h3>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Please refresh the page. If this continues, there may be a JavaScript error.</p>
                </div>
            `;
        }
        throw error;
    }
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

    // Initialize worksheet tracking
    currentWorksheetId = generateUUID();
    worksheetStartTime = Date.now();

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
async function handleCheckAnswers() {
    const score = checkAnswers(problems);
    updateScoreDisplay(score, problems.length);

    // Save worksheet results if user is authenticated
    if (fractionAppAuth && fractionAppAuth.isAuthenticated()) {
        const timeSpent = worksheetStartTime ? Math.floor((Date.now() - worksheetStartTime) / 1000) : 0;

        const worksheetData = {
            worksheetId: currentWorksheetId,
            createdAt: worksheetStartTime ? new Date(worksheetStartTime).toISOString() : new Date().toISOString(),
            problems: problems.map(p => ({
                num1: p.num1,
                denom1: p.denom1,
                num2: p.num2,
                denom2: p.denom2,
                correctAnswer: p.correctAnswer,
                userAnswer: p.userAnswer,
                mistakeType: p.mistakeType || null
            })),
            score: {
                correct: score.correct,
                incorrect: score.incorrect,
                unanswered: score.unanswered,
                total: problems.length,
                percentage: Math.round((score.correct / problems.length) * 100)
            },
            settings: getCurrentSettings(),
            timeSpent: timeSpent,
            completedAt: new Date().toISOString()
        };

        try {
            await fractionAppAuth.saveWorksheetResults(worksheetData);
            console.log('✅ Worksheet results saved successfully');
        } catch (error) {
            console.error('❌ Failed to save worksheet results:', error);
        }
    }
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
