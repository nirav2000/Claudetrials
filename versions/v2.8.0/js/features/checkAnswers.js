/**
 * Answer Checking Module
 * Handles answer validation and scoring
 */

import { qs, qsa, addClass, removeClass } from '../core/domHelpers.js';
import { showHint } from './visualAids.js';

/**
 * Check all answers
 * @param {Array} problems - Problems array
 * @returns {Object} Score {correct, incorrect, unanswered}
 */
export function checkAnswers(problems) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    problems.forEach((problem, index) => {
        if (!problem.userAnswer) {
            unanswered++;
            return;
        }

        const isCorrect = problem.userAnswer === problem.correctAnswer;

        if (isCorrect) {
            correct++;
            applyFeedback(index, 'correct');
        } else {
            incorrect++;
            applyFeedback(index, 'incorrect');

            // Show hint for incorrect answers
            showHint(index, problem);
        }
    });

    return { correct, incorrect, unanswered };
}

/**
 * Apply visual feedback to problem
 * @param {number} index - Problem index
 * @param {string} feedbackType - 'correct' or 'incorrect'
 */
export function applyFeedback(index, feedbackType) {
    const problemElement = qs(`[data-problem-index="${index}"]`);
    if (!problemElement) return;

    // Find the input element (could be input, buttons, canvas, or voice result)
    const input = problemElement.querySelector('.operator-input');
    const buttons = problemElement.querySelector('.operator-buttons');
    const canvas = problemElement.querySelector('.drawing-canvas');
    const voiceResult = problemElement.querySelector('.voice-result');

    // Remove existing feedback classes
    const removeClass = (el, ...classes) => {
        if (el) el.classList.remove(...classes);
    };

    removeClass(input, 'correct', 'incorrect');
    removeClass(canvas, 'correct', 'incorrect');
    removeClass(voiceResult, 'correct', 'incorrect');

    // Remove from button children
    if (buttons) {
        buttons.querySelectorAll('.operator-btn').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
        });
    }

    // Add new feedback class
    const addClass = (el, className) => {
        if (el) el.classList.add(className);
    };

    addClass(input, feedbackType);
    addClass(canvas, feedbackType);
    addClass(voiceResult, feedbackType);

    // Add to selected button
    if (buttons) {
        const selectedBtn = buttons.querySelector('.operator-btn.selected');
        addClass(selectedBtn, feedbackType);
    }
}

/**
 * Show all correct answers
 * @param {Array} problems - Problems array
 */
export function showAnswers(problems) {
    problems.forEach((problem, index) => {
        const problemElement = qs(`[data-problem-index="${index}"]`);
        if (!problemElement) return;

        // Update display based on input method
        const input = problemElement.querySelector('.operator-input');
        const buttons = problemElement.querySelector('.operator-buttons');
        const voiceResult = problemElement.querySelector('.voice-result');

        if (input) {
            input.value = problem.correctAnswer;
            input.classList.add('correct');
        }

        if (buttons) {
            buttons.querySelectorAll('.operator-btn').forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                if (btn.dataset.operator === problem.correctAnswer) {
                    btn.classList.add('selected', 'correct');
                }
            });
        }

        if (voiceResult) {
            voiceResult.textContent = problem.correctAnswer;
            voiceResult.classList.add('correct');
        }

        // Show hint
        showHint(index, problem);

        // Update problem object
        problem.userAnswer = problem.correctAnswer;
    });
}

/**
 * Clear all answers
 * @param {Array} problems - Problems array
 */
export function clearAnswers(problems) {
    problems.forEach((problem, index) => {
        problem.userAnswer = null;

        const problemElement = qs(`[data-problem-index="${index}"]`);
        if (!problemElement) return;

        // Clear input
        const input = problemElement.querySelector('.operator-input');
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        }

        // Clear buttons
        const buttons = problemElement.querySelector('.operator-buttons');
        if (buttons) {
            buttons.querySelectorAll('.operator-btn').forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
            });
        }

        // Clear canvas
        const canvas = problemElement.querySelector('.drawing-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.classList.remove('correct', 'incorrect');
        }

        // Clear voice result
        const voiceResult = problemElement.querySelector('.voice-result');
        if (voiceResult) {
            voiceResult.textContent = '';
            voiceResult.classList.remove('correct', 'incorrect');
        }

        // Remove hints
        const hint = problemElement.querySelector('.visual-aids');
        if (hint) {
            hint.remove();
        }
    });

    // Hide score display
    const scoreElement = qs('.score');
    if (scoreElement) {
        scoreElement.classList.remove('show');
    }
}

/**
 * Update score display
 * @param {Object} score - Score object {correct, incorrect, unanswered}
 * @param {number} total - Total problems
 */
export function updateScoreDisplay(score, total) {
    const scoreElement = qs('.score');
    if (!scoreElement) return;

    scoreElement.innerHTML = `
        <span class="score-correct">Correct: ${score.correct}</span> |
        <span class="score-incorrect">Incorrect: ${score.incorrect}</span> |
        Unanswered: ${score.unanswered} |
        Total: ${total}
    `;

    scoreElement.classList.add('show');
}
