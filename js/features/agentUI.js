/**
 * Agent UI Module
 * Provides user interface for Educational Agent and Testing Agent
 */

import { educationalAgent } from '../agents/educationalAgent.js';
import { testingAgent } from '../agents/testingAgent.js';
import { qs, createElement } from '../core/domHelpers.js';

/**
 * Initialize Agent UI
 */
export function initializeAgentUI() {
    createAgentPanel();
    attachAgentListeners();
}

/**
 * Create the agent control panel
 */
function createAgentPanel() {
    const container = qs('.container');
    if (!container) return;

    const agentPanel = createElement('div', {
        className: 'agent-panel',
        id: 'agent-panel'
    });

    agentPanel.innerHTML = `
        <div class="agent-panel-header">
            <h3>🤖 AI Agents</h3>
            <button id="toggle-agent-panel" class="icon-btn" title="Toggle Agent Panel">
                <span class="material-icons">expand_less</span>
            </button>
        </div>
        <div class="agent-panel-content">
            <div class="agent-section">
                <h4>📚 Educational Agent</h4>
                <p>Get intelligent hints and personalized learning guidance</p>
                <div class="agent-controls">
                    <button id="agent-gentle-hint" class="btn-secondary">Gentle Hint</button>
                    <button id="agent-detailed-hint" class="btn-secondary">Detailed Hint</button>
                    <button id="agent-step-by-step" class="btn-primary">Step-by-Step</button>
                </div>
                <div class="agent-controls">
                    <button id="agent-show-progress" class="btn-secondary">Show Progress</button>
                    <button id="agent-adaptive-practice" class="btn-secondary">Get Practice Plan</button>
                </div>
                <div id="educational-output" class="agent-output"></div>
            </div>

            <div class="agent-section">
                <h4>🧪 Testing Agent</h4>
                <p>Run automated tests to verify application functionality</p>
                <div class="agent-controls">
                    <button id="agent-run-tests" class="btn-primary">Run All Tests</button>
                    <button id="agent-test-problems" class="btn-secondary">Test Current Problems</button>
                    <button id="agent-export-report" class="btn-secondary">Export Report</button>
                </div>
                <div id="testing-output" class="agent-output"></div>
            </div>
        </div>
    `;

    container.appendChild(agentPanel);
}

/**
 * Attach event listeners for agent controls
 */
function attachAgentListeners() {
    // Toggle panel
    qs('#toggle-agent-panel')?.addEventListener('click', toggleAgentPanel);

    // Educational Agent buttons
    qs('#agent-gentle-hint')?.addEventListener('click', () => showHintForCurrentProblem(1));
    qs('#agent-detailed-hint')?.addEventListener('click', () => showHintForCurrentProblem(2));
    qs('#agent-step-by-step')?.addEventListener('click', () => showHintForCurrentProblem(3));
    qs('#agent-show-progress')?.addEventListener('click', showStudentProgress);
    qs('#agent-adaptive-practice')?.addEventListener('click', showAdaptivePractice);

    // Testing Agent buttons
    qs('#agent-run-tests')?.addEventListener('click', runAllTests);
    qs('#agent-test-problems')?.addEventListener('click', testCurrentProblems);
    qs('#agent-export-report')?.addEventListener('click', exportTestReport);
}

/**
 * Toggle agent panel visibility
 */
function toggleAgentPanel() {
    const panel = qs('#agent-panel');
    const content = qs('.agent-panel-content');
    const icon = qs('#toggle-agent-panel .material-icons');

    if (!panel || !content || !icon) return;

    const isCollapsed = content.style.display === 'none';

    if (isCollapsed) {
        content.style.display = 'block';
        icon.textContent = 'expand_less';
    } else {
        content.style.display = 'none';
        icon.textContent = 'expand_more';
    }
}

/**
 * Show hint for the first unanswered problem
 * @param {number} hintLevel - 1: gentle, 2: detailed, 3: step-by-step
 */
function showHintForCurrentProblem(hintLevel) {
    // Get current problems from window (set by app.js)
    const problems = window.currentProblems || [];

    // Find first unanswered or incorrect problem
    let targetProblem = problems.find(p => !p.userAnswer);

    if (!targetProblem) {
        targetProblem = problems[0]; // Default to first problem if all answered
    }

    if (!targetProblem) {
        displayEducationalOutput({
            type: 'error',
            message: 'No problems available. Generate a worksheet first!',
            icon: '⚠️'
        });
        return;
    }

    const hint = educationalAgent.getHint(targetProblem, hintLevel);
    displayEducationalOutput(hint);
}

/**
 * Display educational agent output
 * @param {Object} output
 */
function displayEducationalOutput(output) {
    const outputDiv = qs('#educational-output');
    if (!outputDiv) return;

    let html = `
        <div class="agent-message ${output.type}">
            <div class="agent-message-header">
                <span class="agent-icon">${output.icon || '💡'}</span>
                <strong>${output.message}</strong>
            </div>
    `;

    if (output.strategy) {
        html += `<div class="agent-strategy">📝 <strong>Strategy:</strong> ${output.strategy}</div>`;
    }

    if (output.steps && output.steps.length > 0) {
        html += '<div class="agent-steps"><strong>Steps:</strong><ol>';
        output.steps.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += '</ol></div>';
    }

    if (output.explanation) {
        html += `<div class="agent-explanation">${output.explanation}</div>`;
    }

    if (output.howToAvoid) {
        html += `<div class="agent-tip">💡 <strong>Tip:</strong> ${output.howToAvoid}</div>`;
    }

    html += '</div>';

    outputDiv.innerHTML = html;
    outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show student progress
 */
function showStudentProgress() {
    const problems = window.currentProblems || [];

    if (problems.length === 0) {
        displayEducationalOutput({
            type: 'error',
            message: 'No problems available to analyze.',
            icon: '⚠️'
        });
        return;
    }

    const progress = educationalAgent.updateStudentProfile(problems);

    const output = {
        type: 'gentle',
        icon: '📊',
        message: 'Your Progress Report',
        steps: [
            `Current Accuracy: ${progress.accuracy}`,
            `Overall Progress: ${progress.overallProgress}`,
            progress.strengths.length > 0 ? `💪 Strengths: ${progress.strengths.join(', ')}` : 'Keep practicing to build strengths!',
            progress.weaknesses.length > 0 ? `📚 Areas to improve: ${progress.weaknesses.join(', ')}` : 'Great job! No major weaknesses detected.'
        ],
        strategy: educationalAgent.getEncouragingMessage(
            problems.filter(p => p.userAnswer === p.correctAnswer).length,
            problems.length
        )
    };

    displayEducationalOutput(output);
}

/**
 * Show adaptive practice recommendations
 */
function showAdaptivePractice() {
    const recommendations = educationalAgent.generateAdaptivePractice(5);

    const output = {
        type: 'detailed',
        icon: '🎯',
        message: 'Personalized Practice Recommendations',
        steps: [
            `Recommended problem count: ${recommendations.recommendedCount}`,
            recommendations.focusAreas.length > 0
                ? `Focus areas: ${recommendations.focusAreas.join(', ')}`
                : 'Continue with mixed practice',
            recommendations.message
        ],
        strategy: 'Practice these specific problem types to improve your understanding!'
    };

    displayEducationalOutput(output);
}

/**
 * Run all tests
 */
async function runAllTests() {
    const outputDiv = qs('#testing-output');
    if (!outputDiv) return;

    outputDiv.innerHTML = `
        <div class="agent-message">
            <div class="agent-message-header">
                <span class="agent-icon">⏳</span>
                <strong>Running Tests...</strong>
            </div>
            <p>Please wait while the testing agent runs all tests.</p>
        </div>
    `;

    try {
        const report = await testingAgent.runAllTests();
        displayTestingOutput(report);
    } catch (error) {
        outputDiv.innerHTML = `
            <div class="agent-message error">
                <div class="agent-message-header">
                    <span class="agent-icon">❌</span>
                    <strong>Test Execution Failed</strong>
                </div>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * Test current problems
 */
function testCurrentProblems() {
    const problems = window.currentProblems || [];

    if (problems.length === 0) {
        const outputDiv = qs('#testing-output');
        if (outputDiv) {
            outputDiv.innerHTML = `
                <div class="agent-message error">
                    <div class="agent-message-header">
                        <span class="agent-icon">⚠️</span>
                        <strong>No Problems to Test</strong>
                    </div>
                    <p>Generate a worksheet first!</p>
                </div>
            `;
        }
        return;
    }

    const results = testingAgent.testProblemBatch(problems);
    displayProblemTestResults(results);
}

/**
 * Display testing agent output
 * @param {Object} report
 */
function displayTestingOutput(report) {
    const outputDiv = qs('#testing-output');
    if (!outputDiv) return;

    const passRate = parseFloat(report.summary.passRate);
    const statusIcon = passRate === 100 ? '✅' : passRate >= 80 ? '⚠️' : '❌';
    const statusClass = passRate === 100 ? 'success' : passRate >= 80 ? 'warning' : 'error';

    let html = `
        <div class="agent-message ${statusClass}">
            <div class="agent-message-header">
                <span class="agent-icon">${statusIcon}</span>
                <strong>Test Results</strong>
            </div>
            <div class="test-summary">
                <div class="test-stat">
                    <span class="stat-label">Total:</span>
                    <span class="stat-value">${report.summary.total}</span>
                </div>
                <div class="test-stat">
                    <span class="stat-label">Passed:</span>
                    <span class="stat-value passed">${report.summary.passed}</span>
                </div>
                <div class="test-stat">
                    <span class="stat-label">Failed:</span>
                    <span class="stat-value failed">${report.summary.failed}</span>
                </div>
                <div class="test-stat">
                    <span class="stat-label">Pass Rate:</span>
                    <span class="stat-value">${report.summary.passRate}</span>
                </div>
            </div>
    `;

    if (report.summary.failed > 0) {
        html += '<div class="failed-tests"><strong>Failed Tests:</strong><ul>';
        report.results.filter(r => !r.passed).forEach(r => {
            html += `<li>${r.name}${r.message ? ': ' + r.message : ''}</li>`;
        });
        html += '</ul></div>';
    }

    html += '</div>';

    outputDiv.innerHTML = html;
}

/**
 * Display problem test results
 * @param {Object} results
 */
function displayProblemTestResults(results) {
    const outputDiv = qs('#testing-output');
    if (!outputDiv) return;

    const statusIcon = results.invalid === 0 ? '✅' : '⚠️';
    const statusClass = results.invalid === 0 ? 'success' : 'warning';

    let html = `
        <div class="agent-message ${statusClass}">
            <div class="agent-message-header">
                <span class="agent-icon">${statusIcon}</span>
                <strong>Problem Validation Results</strong>
            </div>
            <div class="test-summary">
                <div class="test-stat">
                    <span class="stat-label">Total:</span>
                    <span class="stat-value">${results.total}</span>
                </div>
                <div class="test-stat">
                    <span class="stat-label">Valid:</span>
                    <span class="stat-value passed">${results.valid}</span>
                </div>
                <div class="test-stat">
                    <span class="stat-label">Invalid:</span>
                    <span class="stat-value failed">${results.invalid}</span>
                </div>
            </div>
    `;

    if (results.errors.length > 0) {
        html += '<div class="failed-tests"><strong>Issues Found:</strong><ul>';
        results.errors.forEach(err => {
            html += `<li>Problem ${err.index + 1}: ${err.errors.join(', ')}</li>`;
        });
        html += '</ul></div>';
    } else {
        html += '<p>✨ All problems are valid and correctly generated!</p>';
    }

    html += '</div>';

    outputDiv.innerHTML = html;
}

/**
 * Export test report
 */
function exportTestReport() {
    const html = testingAgent.exportHTMLReport();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const outputDiv = qs('#testing-output');
    if (outputDiv) {
        outputDiv.innerHTML = `
            <div class="agent-message success">
                <div class="agent-message-header">
                    <span class="agent-icon">✅</span>
                    <strong>Report Exported</strong>
                </div>
                <p>Test report has been downloaded as an HTML file.</p>
            </div>
        `;
    }
}

/**
 * Show mistake analysis for a specific problem
 * @param {Object} problem
 * @param {string} userAnswer
 */
export function showMistakeAnalysis(problem, userAnswer) {
    if (userAnswer === problem.correctAnswer) return;

    const feedback = educationalAgent.analyzeMistake(problem, userAnswer);
    displayEducationalOutput(feedback);
}

/**
 * Get encouraging message after checking answers
 * @param {number} score
 * @param {number} total
 * @returns {string}
 */
export function getEncouragingMessage(score, total) {
    return educationalAgent.getEncouragingMessage(score, total);
}
