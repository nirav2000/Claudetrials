/**
 * Answer Checking Module
 * Handles answer validation and scoring
 */

import { qs, qsa, addClass, removeClass } from '../core/domHelpers.js';
import { showHint } from './visualAids.js';
import { detectMistake, analyzeMistakePatterns, generateFeedbackHTML, generatePatternSummaryHTML } from './mistakeDetection.js';

/**
 * Check all answers
 * @param {Array} problems - Problems array
 * @returns {Object} Score {correct, incorrect, unanswered} plus mistake analysis
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
            // Remove any existing mistake feedback
            removeMistakeFeedback(index);
        } else {
            incorrect++;
            applyFeedback(index, 'incorrect');

            // Detect and show mistake feedback
            const mistake = detectMistake(problem, problem.userAnswer, problem.correctAnswer);
            if (mistake) {
                problem.detectedMistake = mistake;
                showMistakeFeedback(index, mistake, problem);
            }

            // Show hint for incorrect answers
            showHint(index, problem);
        }
    });

    // Analyze mistake patterns and show summary if patterns detected
    const analysis = analyzeMistakePatterns(problems);
    if (Object.keys(analysis.mistakeCounts).length > 0) {
        showPatternSummary(analysis);
    } else {
        // Remove pattern summary if it exists
        removePatternSummary();
    }

    return {
        correct,
        incorrect,
        unanswered,
        mistakeAnalysis: analysis
    };
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
        problem.detectedMistake = null;

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

        // Remove mistake feedback
        removeMistakeFeedback(index);
    });

    // Hide score display
    const scoreElement = qs('.score');
    if (scoreElement) {
        scoreElement.classList.remove('show');
    }

    // Remove pattern summary
    removePatternSummary();
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

/**
 * Show mistake feedback for a specific problem
 * @param {number} index - Problem index
 * @param {Object} mistake - Mistake object from detectMistake
 * @param {Object} problem - Problem object
 */
function showMistakeFeedback(index, mistake, problem) {
    const problemElement = qs(`[data-problem-index="${index}"]`);
    if (!problemElement) return;

    // Remove any existing feedback
    removeMistakeFeedback(index);

    // Generate and insert feedback HTML (pass problem for original problem display)
    const feedbackHTML = generateFeedbackHTML(mistake, index + 1, problem);
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'mistake-feedback-container';
    feedbackContainer.innerHTML = feedbackHTML;

    // Insert after the problem
    problemElement.appendChild(feedbackContainer);
}

/**
 * Remove mistake feedback for a specific problem
 * @param {number} index - Problem index
 */
function removeMistakeFeedback(index) {
    const problemElement = qs(`[data-problem-index="${index}"]`);
    if (!problemElement) return;

    const existingFeedback = problemElement.querySelector('.mistake-feedback-container');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

/**
 * Show pattern summary after all answers are checked
 * @param {Object} analysis - Analysis from analyzeMistakePatterns
 */
function showPatternSummary(analysis) {
    // Remove existing summary
    removePatternSummary();

    // Generate summary HTML
    const summaryHTML = generatePatternSummaryHTML(analysis);
    if (!summaryHTML) return;

    // Create container
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'pattern-summary-container';
    summaryContainer.innerHTML = summaryHTML;

    // Insert after score display
    const scoreElement = qs('.score');
    if (scoreElement && scoreElement.parentNode) {
        scoreElement.parentNode.insertBefore(summaryContainer, scoreElement.nextSibling);
    } else {
        // Fallback: insert at top of problems container
        const container = qs('#problems-container');
        if (container) {
            container.insertBefore(summaryContainer, container.firstChild);
        }
    }

    // Attach event listeners to review buttons
    qsa('.pattern-review-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const problemIndices = e.target.dataset.problems.split(',').map(Number);
            highlightProblems(problemIndices);
            // Scroll to first problem
            if (problemIndices.length > 0) {
                const firstProblem = qs(`[data-problem-index="${problemIndices[0]}"]`);
                if (firstProblem) {
                    firstProblem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

/**
 * Remove pattern summary
 */
function removePatternSummary() {
    const existing = qs('#pattern-summary-container');
    if (existing) {
        existing.remove();
    }
}

/**
 * Highlight specific problems for review
 * @param {Array<number>} indices - Array of problem indices
 */
function highlightProblems(indices) {
    // Remove existing highlights
    qsa('.problem.highlighted').forEach(el => {
        el.classList.remove('highlighted');
    });

    // Add highlight to specified problems
    indices.forEach(index => {
        const problemElement = qs(`[data-problem-index="${index}"]`);
        if (problemElement) {
            problemElement.classList.add('highlighted');
            // Remove highlight after 3 seconds
            setTimeout(() => {
                problemElement.classList.remove('highlighted');
            }, 3000);
        }
    });
}
