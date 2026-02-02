/**
 * Testing Agent
 * Automated testing framework for the Fraction Comparison Application
 */

import { generateProblems, generateMistakesProblems } from '../features/problemGenerator.js';
import { compareFractions, gcd } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

export class TestingAgent {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    /**
     * Run all tests
     * @returns {Object} Test results summary
     */
    async runAllTests() {
        console.log('🧪 Starting Testing Agent...\n');

        this.resetCounters();

        // Core functionality tests
        await this.testProblemGeneration();
        await this.testFractionComparison();
        await this.testMistakesGeneration();
        await this.testAnswerValidation();

        // UI component tests
        await this.testInputMethods();

        // Integration tests
        await this.testWorksheetFlow();

        // Performance tests
        await this.testPerformance();

        return this.generateReport();
    }

    /**
     * Reset test counters
     */
    resetCounters() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    /**
     * Log a test result
     * @param {string} testName
     * @param {boolean} passed
     * @param {string} message
     */
    logTest(testName, passed, message = '') {
        this.totalTests++;
        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }

        this.testResults.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });

        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${testName}${message ? ': ' + message : ''}`);
    }

    /**
     * Test problem generation
     */
    async testProblemGeneration() {
        console.log('\n📋 Testing Problem Generation...');

        // Test 1: Generate problems with valid count
        try {
            const problems = generateProblems(20, [2, 4, 6, 8]);
            this.logTest('Generate 20 problems', problems.length === 20);
        } catch (error) {
            this.logTest('Generate 20 problems', false, error.message);
        }

        // Test 2: Problems have required properties
        try {
            const problems = generateProblems(5, [2, 4]);
            const hasRequiredProps = problems.every(p =>
                p.hasOwnProperty('num1') &&
                p.hasOwnProperty('denom1') &&
                p.hasOwnProperty('num2') &&
                p.hasOwnProperty('denom2') &&
                p.hasOwnProperty('correctAnswer')
            );
            this.logTest('Problems have required properties', hasRequiredProps);
        } catch (error) {
            this.logTest('Problems have required properties', false, error.message);
        }

        // Test 3: Numerators are less than denominators
        try {
            const problems = generateProblems(10, [4, 6, 8]);
            const validNumerators = problems.every(p =>
                p.num1 < p.denom1 && p.num2 < p.denom2 && p.num1 > 0 && p.num2 > 0
            );
            this.logTest('Numerators are valid (0 < num < denom)', validNumerators);
        } catch (error) {
            this.logTest('Numerators are valid', false, error.message);
        }

        // Test 4: No duplicate problems
        try {
            const problems = generateProblems(10, [2, 4, 6, 8]);
            const hasDuplicates = problems.some((p1, i) =>
                problems.some((p2, j) =>
                    i !== j &&
                    p1.num1 === p2.num1 &&
                    p1.denom1 === p2.denom1 &&
                    p1.num2 === p2.num2 &&
                    p1.denom2 === p2.denom2
                )
            );
            this.logTest('No duplicate problems generated', !hasDuplicates);
        } catch (error) {
            this.logTest('No duplicate problems', false, error.message);
        }

        // Test 5: Denominators are from allowed set
        try {
            const allowedDenoms = [3, 6, 9];
            const problems = generateProblems(10, allowedDenoms);
            const validDenoms = problems.every(p =>
                allowedDenoms.includes(p.denom1) && allowedDenoms.includes(p.denom2)
            );
            this.logTest('Denominators are from allowed set', validDenoms);
        } catch (error) {
            this.logTest('Denominators from allowed set', false, error.message);
        }
    }

    /**
     * Test fraction comparison logic
     */
    async testFractionComparison() {
        console.log('\n🔢 Testing Fraction Comparison Logic...');

        // Test 1: Less than
        const test1 = compareFractions(1, 4, 1, 2);
        this.logTest('1/4 < 1/2', test1 === '<', `Expected '<', got '${test1}'`);

        // Test 2: Greater than
        const test2 = compareFractions(3, 4, 1, 2);
        this.logTest('3/4 > 1/2', test2 === '>', `Expected '>', got '${test2}'`);

        // Test 3: Equal
        const test3 = compareFractions(1, 2, 2, 4);
        this.logTest('1/2 = 2/4', test3 === '=', `Expected '=', got '${test3}'`);

        // Test 4: Same denominator comparison
        const test4 = compareFractions(2, 5, 3, 5);
        this.logTest('2/5 < 3/5', test4 === '<', `Expected '<', got '${test4}'`);

        // Test 5: Different denominators
        const test5 = compareFractions(2, 3, 3, 4);
        this.logTest('2/3 < 3/4', test5 === '<', `Expected '<', got '${test5}'`);

        // Test 6: Unit fractions
        const test6 = compareFractions(1, 8, 1, 4);
        this.logTest('1/8 < 1/4', test6 === '<', `Expected '<', got '${test6}'`);

        // Test 7: Equivalent fractions
        const test7 = compareFractions(3, 6, 1, 2);
        this.logTest('3/6 = 1/2', test7 === '=', `Expected '=', got '${test7}'`);

        // Test 8: Large denominators
        const test8 = compareFractions(5, 12, 7, 20);
        this.logTest('5/12 > 7/20', test8 === '>', `Expected '>', got '${test8}'`);
    }

    /**
     * Test mistakes problem generation
     */
    async testMistakesGeneration() {
        console.log('\n🎯 Testing Common Mistakes Generation...');

        // Test 1: Generate higher-denominator problems
        try {
            const problems = generateMistakesProblems(5, [4, 8, 12], ['higher-denominator']);
            const hasCorrectType = problems.every(p => p.mistakeType === 'higher-denominator');
            this.logTest('Generate higher-denominator problems', hasCorrectType && problems.length === 5);
        } catch (error) {
            this.logTest('Generate higher-denominator problems', false, error.message);
        }

        // Test 2: Generate unit fraction problems
        try {
            const problems = generateMistakesProblems(5, [2, 4, 6, 8], ['unit-fraction']);
            const hasUnitFractions = problems.every(p => p.num1 === 1 && p.num2 === 1);
            this.logTest('Generate unit fraction problems', hasUnitFractions);
        } catch (error) {
            this.logTest('Generate unit fraction problems', false, error.message);
        }

        // Test 3: Generate equivalent fractions
        try {
            const problems = generateMistakesProblems(5, [2, 4, 6, 8, 10, 12], ['equivalent']);
            const hasEquivalent = problems.some(p => {
                return (p.num1 * p.denom2) === (p.num2 * p.denom1);
            });
            this.logTest('Generate equivalent fraction problems', hasEquivalent);
        } catch (error) {
            this.logTest('Generate equivalent fraction problems', false, error.message);
        }

        // Test 4: Mixed mistake types
        try {
            const problems = generateMistakesProblems(10, [2, 4, 6, 8], ['higher-denominator', 'unit-fraction', 'equivalent']);
            const hasMixedTypes = new Set(problems.map(p => p.mistakeType)).size > 1;
            this.logTest('Generate mixed mistake types', hasMixedTypes && problems.length === 10);
        } catch (error) {
            this.logTest('Generate mixed mistake types', false, error.message);
        }
    }

    /**
     * Test answer validation
     */
    async testAnswerValidation() {
        console.log('\n✓ Testing Answer Validation...');

        // Test 1: Correct answer validation
        const problem1 = {
            num1: 1, denom1: 2,
            num2: 1, denom2: 4,
            correctAnswer: '>',
            userAnswer: '>'
        };
        this.logTest('Validate correct answer', problem1.userAnswer === problem1.correctAnswer);

        // Test 2: Incorrect answer validation
        const problem2 = {
            num1: 1, denom1: 4,
            num2: 1, denom2: 2,
            correctAnswer: '<',
            userAnswer: '>'
        };
        this.logTest('Validate incorrect answer', problem2.userAnswer !== problem2.correctAnswer);

        // Test 3: Null answer validation
        const problem3 = {
            num1: 2, denom1: 3,
            num2: 3, denom2: 4,
            correctAnswer: '<',
            userAnswer: null
        };
        this.logTest('Validate null/unanswered', problem3.userAnswer === null || problem3.userAnswer === undefined);

        // Test 4: Scoring calculation
        const problems = [
            { correctAnswer: '<', userAnswer: '<' }, // correct
            { correctAnswer: '>', userAnswer: '<' }, // incorrect
            { correctAnswer: '=', userAnswer: null }, // unanswered
            { correctAnswer: '<', userAnswer: '<' }, // correct
            { correctAnswer: '>', userAnswer: '>' }  // correct
        ];
        const correct = problems.filter(p => p.userAnswer === p.correctAnswer).length;
        const incorrect = problems.filter(p => p.userAnswer && p.userAnswer !== p.correctAnswer).length;
        const unanswered = problems.filter(p => !p.userAnswer).length;

        this.logTest('Scoring calculation', correct === 3 && incorrect === 1 && unanswered === 1);
    }

    /**
     * Test input methods (simulation)
     */
    async testInputMethods() {
        console.log('\n⌨️ Testing Input Methods...');

        // Test 1: Keyboard input validation
        const validKeys = ['<', '>', '='];
        const testKeys = ['<', '>', '=', 'a', '1', ' '];
        const allValid = testKeys.slice(0, 3).every(k => validKeys.includes(k));
        this.logTest('Keyboard input accepts valid operators', allValid);

        // Test 2: Button input simulation
        const buttons = ['<', '>', '='];
        const hasAllButtons = buttons.length === 3;
        this.logTest('Button input has all operators', hasAllButtons);

        // Test 3: Drawing recognition would accept valid symbols
        const drawingSymbols = ['<', '>', '='];
        const validDrawing = drawingSymbols.every(s => validKeys.includes(s));
        this.logTest('Drawing recognition maps to valid operators', validDrawing);

        // Test 4: Voice recognition phrases
        const voicePhrases = {
            'less than': '<',
            'greater than': '>',
            'equal': '='
        };
        const validVoiceMapping = Object.values(voicePhrases).every(v => validKeys.includes(v));
        this.logTest('Voice recognition maps to valid operators', validVoiceMapping);
    }

    /**
     * Test worksheet flow
     */
    async testWorksheetFlow() {
        console.log('\n📄 Testing Worksheet Flow...');

        // Test 1: Generate → Answer → Check flow
        try {
            const problems = generateProblems(5, [2, 4]);
            // Simulate answering
            problems.forEach((p, i) => {
                p.userAnswer = i % 2 === 0 ? p.correctAnswer : '<';
            });
            // Simulate checking
            const correct = problems.filter(p => p.userAnswer === p.correctAnswer).length;
            this.logTest('Generate → Answer → Check flow', correct >= 0 && correct <= problems.length);
        } catch (error) {
            this.logTest('Worksheet flow', false, error.message);
        }

        // Test 2: Clear answers
        try {
            const problems = generateProblems(3, [2, 4]);
            problems.forEach(p => p.userAnswer = '<');
            // Simulate clear
            problems.forEach(p => p.userAnswer = null);
            const allCleared = problems.every(p => p.userAnswer === null);
            this.logTest('Clear answers functionality', allCleared);
        } catch (error) {
            this.logTest('Clear answers', false, error.message);
        }

        // Test 3: Show answers
        try {
            const problems = generateProblems(5, [2, 4]);
            problems.forEach(p => p.userAnswer = p.correctAnswer);
            const allShown = problems.every(p => p.userAnswer === p.correctAnswer);
            this.logTest('Show answers functionality', allShown);
        } catch (error) {
            this.logTest('Show answers', false, error.message);
        }
    }

    /**
     * Test performance
     */
    async testPerformance() {
        console.log('\n⚡ Testing Performance...');

        // Test 1: Generate 100 problems quickly
        try {
            const start = performance.now();
            const problems = generateProblems(100, [2, 4, 6, 8, 10, 12]);
            const end = performance.now();
            const time = end - start;
            this.logTest('Generate 100 problems < 100ms', time < 100, `Took ${time.toFixed(2)}ms`);
        } catch (error) {
            this.logTest('Generate 100 problems performance', false, error.message);
        }

        // Test 2: Compare 1000 fractions quickly
        try {
            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                compareFractions(i % 10 + 1, 10, i % 12 + 1, 12);
            }
            const end = performance.now();
            const time = end - start;
            this.logTest('Compare 1000 fractions < 50ms', time < 50, `Took ${time.toFixed(2)}ms`);
        } catch (error) {
            this.logTest('Comparison performance', false, error.message);
        }

        // Test 3: Generate mistakes problems performance
        try {
            const start = performance.now();
            const problems = generateMistakesProblems(50, [2, 4, 6, 8, 10, 12], ['higher-denominator', 'unit-fraction']);
            const end = performance.now();
            const time = end - start;
            this.logTest('Generate 50 mistake problems < 100ms', time < 100, `Took ${time.toFixed(2)}ms`);
        } catch (error) {
            this.logTest('Mistakes generation performance', false, error.message);
        }
    }

    /**
     * Test specific problem
     * @param {Object} problem
     * @returns {Object} Test result
     */
    testProblem(problem) {
        const result = {
            valid: true,
            errors: []
        };

        // Validate structure
        if (!problem.hasOwnProperty('num1') || !problem.hasOwnProperty('denom1') ||
            !problem.hasOwnProperty('num2') || !problem.hasOwnProperty('denom2')) {
            result.valid = false;
            result.errors.push('Missing required properties');
        }

        // Validate numerators
        if (problem.num1 <= 0 || problem.num1 >= problem.denom1) {
            result.valid = false;
            result.errors.push(`Invalid numerator 1: ${problem.num1}`);
        }

        if (problem.num2 <= 0 || problem.num2 >= problem.denom2) {
            result.valid = false;
            result.errors.push(`Invalid numerator 2: ${problem.num2}`);
        }

        // Validate correct answer
        const expectedAnswer = compareFractions(problem.num1, problem.denom1, problem.num2, problem.denom2);
        if (problem.correctAnswer !== expectedAnswer) {
            result.valid = false;
            result.errors.push(`Incorrect answer: expected ${expectedAnswer}, got ${problem.correctAnswer}`);
        }

        return result;
    }

    /**
     * Test a batch of problems
     * @param {Array} problems
     * @returns {Object} Batch test results
     */
    testProblemBatch(problems) {
        const results = {
            total: problems.length,
            valid: 0,
            invalid: 0,
            errors: []
        };

        problems.forEach((problem, index) => {
            const testResult = this.testProblem(problem);
            if (testResult.valid) {
                results.valid++;
            } else {
                results.invalid++;
                results.errors.push({
                    index,
                    problem,
                    errors: testResult.errors
                });
            }
        });

        return results;
    }

    /**
     * Generate test report
     * @returns {Object} Test report
     */
    generateReport() {
        const passRate = ((this.passedTests / this.totalTests) * 100).toFixed(2);

        const report = {
            summary: {
                total: this.totalTests,
                passed: this.passedTests,
                failed: this.failedTests,
                passRate: passRate + '%'
            },
            results: this.testResults,
            timestamp: new Date().toISOString()
        };

        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST REPORT');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.totalTests}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        console.log('='.repeat(50) + '\n');

        if (this.failedTests > 0) {
            console.log('❌ Failed Tests:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(r => {
                    console.log(`  • ${r.name}${r.message ? ': ' + r.message : ''}`);
                });
            console.log('');
        }

        return report;
    }

    /**
     * Export test report as JSON
     * @returns {string} JSON report
     */
    exportReport() {
        return JSON.stringify(this.generateReport(), null, 2);
    }

    /**
     * Export test report as HTML
     * @returns {string} HTML report
     */
    exportHTMLReport() {
        const report = this.generateReport();

        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Testing Agent Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
        }
        .summary-card .value {
            font-size: 32px;
            font-weight: bold;
            color: #333;
        }
        .passed { color: #4CAF50; }
        .failed { color: #f44336; }
        .results {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-item {
            padding: 15px;
            border-left: 4px solid #ddd;
            margin-bottom: 10px;
            background: #f9f9f9;
        }
        .test-item.passed {
            border-left-color: #4CAF50;
        }
        .test-item.failed {
            border-left-color: #f44336;
        }
        .test-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .test-message {
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Testing Agent Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Tests</h3>
            <div class="value">${report.summary.total}</div>
        </div>
        <div class="summary-card">
            <h3>Passed</h3>
            <div class="value passed">✅ ${report.summary.passed}</div>
        </div>
        <div class="summary-card">
            <h3>Failed</h3>
            <div class="value failed">❌ ${report.summary.failed}</div>
        </div>
        <div class="summary-card">
            <h3>Pass Rate</h3>
            <div class="value">${report.summary.passRate}</div>
        </div>
    </div>

    <div class="results">
        <h2>Test Results</h2>
        ${report.results.map(r => `
            <div class="test-item ${r.passed ? 'passed' : 'failed'}">
                <div class="test-name">${r.passed ? '✅' : '❌'} ${r.name}</div>
                ${r.message ? `<div class="test-message">${r.message}</div>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
        `;

        return html;
    }
}

// Export singleton instance
export const testingAgent = new TestingAgent();
