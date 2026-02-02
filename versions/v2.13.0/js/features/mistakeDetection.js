/**
 * Dynamic Mistake Detection Module
 * Analyzes student answers to identify error patterns and provide targeted feedback
 */

/**
 * Detect which mistake pattern was used (if any)
 * @param {Object} problem - Problem object with num1, denom1, num2, denom2
 * @param {string} userAnswer - User's answer ('<', '=', '>')
 * @param {string} correctAnswer - Correct answer
 * @returns {Object|null} Mistake info or null if answer is correct
 */
export function detectMistake(problem, userAnswer, correctAnswer) {
    // If answer is correct, no mistake
    if (userAnswer === correctAnswer) {
        return null;
    }

    const { num1, denom1, num2, denom2 } = problem;

    // Calculate actual fraction values
    const frac1 = num1 / denom1;
    const frac2 = num2 / denom2;

    // Detect specific mistake patterns

    // 1. Higher Denominator Trap (assuming larger denominator = larger fraction)
    if (denom1 > denom2 && userAnswer === '<' && correctAnswer === '>') {
        return {
            type: 'higher_denominator',
            name: 'Higher Denominator Trap',
            description: 'You compared denominators instead of the actual fraction values',
            explanation: `You thought ${num1}/${denom1} < ${num2}/${denom2} because ${denom1} > ${denom2}. However, larger denominators actually mean SMALLER pieces! Think of pizza slices: 1/8 of a pizza is smaller than 1/4 of a pizza.`,
            correction: `To compare correctly, find a common denominator or convert to decimals. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '🍕'
        };
    }
    if (denom2 > denom1 && userAnswer === '>' && correctAnswer === '<') {
        return {
            type: 'higher_denominator',
            name: 'Higher Denominator Trap',
            description: 'You compared denominators instead of the actual fraction values',
            explanation: `You thought ${num1}/${denom1} > ${num2}/${denom2} because ${denom1} < ${denom2}. However, larger denominators actually mean SMALLER pieces! Think of pizza slices: 1/8 of a pizza is smaller than 1/4 of a pizza.`,
            correction: `To compare correctly, find a common denominator or convert to decimals. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '🍕'
        };
    }

    // 2. Both Numbers Higher Trap (comparing both numerators and denominators)
    if (num1 > num2 && denom1 > denom2 && userAnswer === '>' && correctAnswer === '<') {
        return {
            type: 'both_numbers_higher',
            name: 'Both Numbers Higher Trap',
            description: 'You thought both numbers being bigger means the fraction is bigger',
            explanation: `Just because ${num1} > ${num2} AND ${denom1} > ${denom2} doesn't mean ${num1}/${denom1} > ${num2}/${denom2}. The relationship between numerator and denominator matters more than their individual sizes.`,
            correction: `Convert to decimals: ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '⚖️'
        };
    }
    if (num2 > num1 && denom2 > denom1 && userAnswer === '<' && correctAnswer === '>') {
        return {
            type: 'both_numbers_higher',
            name: 'Both Numbers Higher Trap',
            description: 'You thought both numbers being bigger means the fraction is bigger',
            explanation: `Just because ${num2} > ${num1} AND ${denom2} > ${denom1} doesn't mean ${num2}/${denom2} > ${num1}/${denom1}. The relationship between numerator and denominator matters more than their individual sizes.`,
            correction: `Convert to decimals: ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '⚖️'
        };
    }

    // 3. Unit Fraction Confusion (comparing numerators when denominators match)
    if (num1 === 1 && num2 === 1 && denom1 !== denom2) {
        if ((denom1 < denom2 && userAnswer === '<') || (denom1 > denom2 && userAnswer === '>')) {
            return {
                type: 'unit_fraction',
                name: 'Unit Fraction Confusion',
                description: 'You compared denominators the wrong way for unit fractions',
                explanation: `For unit fractions (numerator = 1), the fraction with the SMALLER denominator is actually LARGER. 1/${denom1} and 1/${denom2}: think of cutting a pizza into ${denom1} vs ${denom2} pieces - fewer pieces means bigger slices!`,
                correction: `1/${Math.min(denom1, denom2)} > 1/${Math.max(denom1, denom2)} because fewer, larger pieces. So ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
                icon: '1️⃣'
            };
        }
    }

    // 4. Near-Whole Comparison (both fractions close to 1)
    const closeToOne1 = Math.abs(frac1 - 1) < 0.2;
    const closeToOne2 = Math.abs(frac2 - 1) < 0.2;
    if (closeToOne1 && closeToOne2) {
        return {
            type: 'near_whole',
            name: 'Near-Whole Comparison Error',
            description: 'You had trouble comparing fractions close to 1',
            explanation: `When fractions are close to 1 whole, it helps to think about how much is MISSING from 1. ${num1}/${denom1} is missing ${denom1 - num1}/${denom1}, and ${num2}/${denom2} is missing ${denom2 - num2}/${denom2}.`,
            correction: `The fraction missing LESS is actually LARGER. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '🎯'
        };
    }

    // 5. Equivalent Fraction Confusion (thought they were equal when they're not)
    if (userAnswer === '=' && correctAnswer !== '=') {
        const crossProduct1 = num1 * denom2;
        const crossProduct2 = num2 * denom1;
        return {
            type: 'equivalent_fraction',
            name: 'Equivalent Fraction Error',
            description: 'You thought these fractions were equivalent, but they\'re not',
            explanation: `To check if fractions are equivalent, use cross-multiplication: ${num1} × ${denom2} = ${crossProduct1}, and ${num2} × ${denom1} = ${crossProduct2}. Since ${crossProduct1} ≠ ${crossProduct2}, these fractions are NOT equal.`,
            correction: `${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '≠'
        };
    }

    // 6. General numerator comparison (ignoring denominators)
    if (num1 > num2 && userAnswer === '>' && correctAnswer !== '>') {
        return {
            type: 'numerator_only',
            name: 'Numerator-Only Comparison',
            description: 'You only compared the numerators (top numbers)',
            explanation: `You can't just compare numerators without considering denominators. ${num1} > ${num2}, but that doesn't mean ${num1}/${denom1} > ${num2}/${denom2}. The denominator (bottom number) tells you the size of each piece.`,
            correction: `Always consider both parts of the fraction. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '🔢'
        };
    }
    if (num2 > num1 && userAnswer === '<' && correctAnswer !== '<') {
        return {
            type: 'numerator_only',
            name: 'Numerator-Only Comparison',
            description: 'You only compared the numerators (top numbers)',
            explanation: `You can't just compare numerators without considering denominators. ${num2} > ${num1}, but that doesn't mean ${num2}/${denom2} > ${num1}/${denom1}. The denominator (bottom number) tells you the size of each piece.`,
            correction: `Always consider both parts of the fraction. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}, so ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
            icon: '🔢'
        };
    }

    // 7. Generic mistake (couldn't identify specific pattern)
    return {
        type: 'general',
        name: 'Comparison Error',
        description: 'Your answer was incorrect',
        explanation: `The correct comparison is ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}.`,
        correction: `Try converting to decimals or finding a common denominator. ${num1}/${denom1} = ${frac1.toFixed(3)} and ${num2}/${denom2} = ${frac2.toFixed(3)}.`,
        icon: '❌'
    };
}

/**
 * Analyze all problems to find patterns of repeated mistakes
 * @param {Array} problems - Array of problem objects with userAnswer field
 * @returns {Object} Summary of mistake patterns
 */
export function analyzeMistakePatterns(problems) {
    const mistakeCounts = {};
    const mistakeProblems = {};

    problems.forEach((problem, index) => {
        if (problem.userAnswer && problem.userAnswer !== problem.correctAnswer) {
            const mistake = detectMistake(problem, problem.userAnswer, problem.correctAnswer);

            if (mistake) {
                const type = mistake.type;

                // Count mistakes by type
                if (!mistakeCounts[type]) {
                    mistakeCounts[type] = {
                        count: 0,
                        name: mistake.name,
                        icon: mistake.icon,
                        problems: []
                    };
                }

                mistakeCounts[type].count++;
                mistakeCounts[type].problems.push(index);

                // Store which problems had which mistake
                if (!mistakeProblems[index]) {
                    mistakeProblems[index] = mistake;
                }
            }
        }
    });

    return {
        mistakeCounts,
        mistakeProblems
    };
}

/**
 * Generate feedback message for a specific mistake
 * @param {Object} mistake - Mistake object from detectMistake
 * @param {number} problemIndex - Index of the problem (1-based for display)
 * @param {Object} problem - Problem object with num1, denom1, num2, denom2
 * @returns {string} HTML string for feedback
 */
export function generateFeedbackHTML(mistake, problemIndex, problem = null) {
    if (!mistake) return '';

    // Generate original problem display if problem is provided
    let problemDisplay = '';
    if (problem) {
        const { num1, denom1, num2, denom2, userAnswer, correctAnswer } = problem;
        problemDisplay = `
            <div class="mistake-original-problem">
                <strong>Problem ${problemIndex}:</strong>
                <span class="fraction">${num1}/${denom1}</span>
                <span class="user-answer incorrect-answer">${userAnswer || '?'}</span>
                <span class="fraction">${num2}/${denom2}</span>
                <span class="correct-indicator">→ Correct: <strong>${correctAnswer}</strong></span>
            </div>
        `;
    }

    return `
        <div class="mistake-feedback" data-mistake-type="${mistake.type}">
            ${problemDisplay}
            <div class="mistake-feedback-header">
                <span class="mistake-icon">${mistake.icon}</span>
                <span class="mistake-name">${mistake.name}</span>
            </div>
            <div class="mistake-feedback-body">
                <p class="mistake-description"><strong>What happened:</strong> ${mistake.description}</p>
                <p class="mistake-explanation"><strong>Why this is wrong:</strong> ${mistake.explanation}</p>
                <p class="mistake-correction"><strong>How to fix it:</strong> ${mistake.correction}</p>
            </div>
        </div>
    `;
}

/**
 * Generate a summary of all mistake patterns found in the worksheet
 * @param {Object} analysis - Result from analyzeMistakePatterns
 * @returns {string} HTML string for pattern summary
 */
export function generatePatternSummaryHTML(analysis) {
    const { mistakeCounts } = analysis;
    const patterns = Object.entries(mistakeCounts).filter(([_, data]) => data.count > 1);

    if (patterns.length === 0) {
        return '';
    }

    const sortedPatterns = patterns.sort((a, b) => b[1].count - a[1].count);

    const patternHTML = sortedPatterns.map(([type, data]) => {
        const problemNumbers = data.problems.map(i => i + 1).join(', ');
        return `
            <div class="pattern-item" data-pattern-type="${type}">
                <div class="pattern-header">
                    <span class="pattern-icon">${data.icon}</span>
                    <span class="pattern-name">${data.name}</span>
                    <span class="pattern-count">${data.count} times</span>
                </div>
                <div class="pattern-problems">
                    Found in problems: <strong>${problemNumbers}</strong>
                </div>
                <button class="pattern-review-btn" data-problems="${data.problems.join(',')}">
                    Review These Problems
                </button>
            </div>
        `;
    }).join('');

    return `
        <div class="pattern-summary">
            <h3>📊 Mistake Patterns Detected</h3>
            <p>We noticed you made the same type of mistake multiple times:</p>
            <div class="pattern-list">
                ${patternHTML}
            </div>
        </div>
    `;
}
