/**
 * Educational AI Agent
 * Provides intelligent tutoring, hints, and step-by-step guidance for fraction problems
 */

import { compareFractions, gcd } from '../core/utils.js';

export class EducationalAgent {
    constructor() {
        this.studentProfile = {
            mistakeHistory: [],
            strengthAreas: [],
            weaknessAreas: [],
            totalAttempts: 0,
            correctAttempts: 0
        };
    }

    /**
     * Analyze a problem and provide intelligent hints
     * @param {Object} problem - The fraction problem
     * @param {number} hintLevel - 1: gentle hint, 2: detailed hint, 3: step-by-step
     * @returns {Object} Hint information
     */
    getHint(problem, hintLevel = 1) {
        const { num1, denom1, num2, denom2, correctAnswer, mistakeType } = problem;

        // Analyze the problem type
        const analysis = this.analyzeProblem(problem);

        switch (hintLevel) {
            case 1:
                return this.getGentleHint(analysis, problem);
            case 2:
                return this.getDetailedHint(analysis, problem);
            case 3:
                return this.getStepByStep(analysis, problem);
            default:
                return this.getGentleHint(analysis, problem);
        }
    }

    /**
     * Analyze a fraction problem to understand its characteristics
     * @param {Object} problem
     * @returns {Object} Analysis
     */
    analyzeProblem(problem) {
        const { num1, denom1, num2, denom2 } = problem;

        // Check if denominators are the same
        const sameDenominator = denom1 === denom2;

        // Check if fractions are equivalent
        const equivalent = (num1 * denom2) === (num2 * denom1);

        // Check if either is a unit fraction
        const isUnitFraction1 = num1 === 1;
        const isUnitFraction2 = num2 === 1;

        // Check if denominators are multiples
        const denom1MultipleOf2 = denom1 % denom2 === 0;
        const denom2MultipleOf1 = denom2 % denom1 === 0;
        const hasCommonMultiple = denom1MultipleOf2 || denom2MultipleOf1;

        // Calculate decimal values
        const value1 = num1 / denom1;
        const value2 = num2 / denom2;

        // Check if close to whole numbers
        const nearWhole1 = value1 > 0.8;
        const nearWhole2 = value2 > 0.8;

        // Find least common denominator
        const lcd = this.findLCD(denom1, denom2);

        return {
            sameDenominator,
            equivalent,
            isUnitFraction1,
            isUnitFraction2,
            hasCommonMultiple,
            nearWhole1,
            nearWhole2,
            value1,
            value2,
            lcd,
            difficulty: this.assessDifficulty(problem)
        };
    }

    /**
     * Provide a gentle hint that guides without giving away the answer
     */
    getGentleHint(analysis, problem) {
        const { num1, denom1, num2, denom2 } = problem;

        if (analysis.equivalent) {
            return {
                type: 'gentle',
                message: 'These fractions might look different, but could they represent the same amount?',
                strategy: 'Try simplifying both fractions or cross-multiplying to check if they\'re equal.',
                icon: '🤔'
            };
        }

        if (analysis.sameDenominator) {
            return {
                type: 'gentle',
                message: 'Both fractions have the same denominator! This makes comparison easier.',
                strategy: 'When denominators are the same, you can just compare the numerators.',
                icon: '✨'
            };
        }

        if (analysis.isUnitFraction1 && analysis.isUnitFraction2) {
            return {
                type: 'gentle',
                message: 'Both fractions have 1 on top (unit fractions).',
                strategy: 'With unit fractions, the larger the denominator, the smaller the fraction!',
                icon: '🎯'
            };
        }

        if (analysis.hasCommonMultiple) {
            return {
                type: 'gentle',
                message: 'Notice that one denominator is a multiple of the other!',
                strategy: 'You can convert one fraction to have the same denominator as the other.',
                icon: '🔄'
            };
        }

        return {
            type: 'gentle',
            message: 'To compare fractions with different denominators, find a common denominator.',
            strategy: 'Try finding the least common multiple of ' + denom1 + ' and ' + denom2 + '.',
            icon: '💡'
        };
    }

    /**
     * Provide a detailed hint with more specific guidance
     */
    getDetailedHint(analysis, problem) {
        const { num1, denom1, num2, denom2 } = problem;
        const { lcd } = analysis;

        if (analysis.equivalent) {
            return {
                type: 'detailed',
                message: `Let's check if ${num1}/${denom1} and ${num2}/${denom2} are equivalent!`,
                steps: [
                    'Cross-multiply: ' + num1 + ' × ' + denom2 + ' = ' + (num1 * denom2),
                    'And: ' + num2 + ' × ' + denom1 + ' = ' + (num2 * denom1),
                    (num1 * denom2) === (num2 * denom1) ? 'They\'re equal! So the fractions are equivalent.' : 'They\'re different, so the fractions are not equal.'
                ],
                icon: '🔍'
            };
        }

        if (analysis.sameDenominator) {
            const comparison = num1 > num2 ? 'greater than' : num1 < num2 ? 'less than' : 'equal to';
            return {
                type: 'detailed',
                message: `Both fractions have denominator ${denom1}.`,
                steps: [
                    'When denominators are the same, compare numerators.',
                    `${num1} is ${comparison} ${num2}`,
                    `Therefore, ${num1}/${denom1} is ${comparison} ${num2}/${denom2}`
                ],
                icon: '✨'
            };
        }

        return {
            type: 'detailed',
            message: `Let's find a common denominator to compare these fractions.`,
            steps: [
                `The least common denominator (LCD) of ${denom1} and ${denom2} is ${lcd}.`,
                `Convert ${num1}/${denom1} to have denominator ${lcd}.`,
                `Convert ${num2}/${denom2} to have denominator ${lcd}.`,
                'Now you can compare the numerators!'
            ],
            icon: '📐'
        };
    }

    /**
     * Provide complete step-by-step solution
     */
    getStepByStep(analysis, problem) {
        const { num1, denom1, num2, denom2, correctAnswer } = problem;
        const { lcd } = analysis;

        const steps = [];
        const visualSteps = [];

        steps.push(`Problem: Compare ${num1}/${denom1} and ${num2}/${denom2}`);

        if (analysis.equivalent) {
            steps.push('Step 1: Check if fractions are equivalent');
            steps.push(`Cross-multiply: ${num1} × ${denom2} = ${num1 * denom2}`);
            steps.push(`And: ${num2} × ${denom1} = ${num2 * denom1}`);
            steps.push(`${(num1 * denom2) === (num2 * denom1) ? 'The products are equal!' : 'The products are different.'}`);

            if ((num1 * denom2) === (num2 * denom1)) {
                steps.push(`Answer: ${num1}/${denom1} = ${num2}/${denom2}`);
            }
        }

        if (!analysis.equivalent) {
            if (analysis.sameDenominator) {
                steps.push('Step 1: Notice both fractions have the same denominator');
                steps.push('Step 2: Compare the numerators');
                steps.push(`${num1} ${correctAnswer === '<' ? '<' : correctAnswer === '>' ? '>' : '='} ${num2}`);
                steps.push(`Step 3: Therefore, ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}`);
            } else {
                steps.push(`Step 1: Find the least common denominator (LCD) of ${denom1} and ${denom2}`);
                steps.push(`LCD = ${lcd}`);

                const multiplier1 = lcd / denom1;
                const multiplier2 = lcd / denom2;
                const newNum1 = num1 * multiplier1;
                const newNum2 = num2 * multiplier2;

                steps.push(`Step 2: Convert ${num1}/${denom1} to denominator ${lcd}`);
                steps.push(`Multiply numerator and denominator by ${multiplier1}: (${num1} × ${multiplier1})/(${denom1} × ${multiplier1}) = ${newNum1}/${lcd}`);

                steps.push(`Step 3: Convert ${num2}/${denom2} to denominator ${lcd}`);
                steps.push(`Multiply numerator and denominator by ${multiplier2}: (${num2} × ${multiplier2})/(${denom2} × ${multiplier2}) = ${newNum2}/${lcd}`);

                steps.push(`Step 4: Compare ${newNum1}/${lcd} and ${newNum2}/${lcd}`);
                steps.push(`${newNum1} ${correctAnswer === '<' ? '<' : correctAnswer === '>' ? '>' : '='} ${newNum2}`);
                steps.push(`Step 5: Therefore, ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}`);
            }
        }

        return {
            type: 'step-by-step',
            message: 'Here is the complete solution:',
            steps: steps,
            answer: correctAnswer,
            icon: '📚'
        };
    }

    /**
     * Analyze a student's mistake and provide targeted feedback
     * @param {Object} problem
     * @param {string} userAnswer
     * @returns {Object} Feedback
     */
    analyzeMistake(problem, userAnswer) {
        const { num1, denom1, num2, denom2, correctAnswer, mistakeType } = problem;

        // Record mistake
        this.studentProfile.mistakeHistory.push({
            problem,
            userAnswer,
            mistakeType,
            timestamp: Date.now()
        });

        const feedback = {
            message: '',
            explanation: '',
            commonMistake: '',
            howToAvoid: '',
            icon: '❌'
        };

        // Identify the type of mistake
        if (mistakeType === 'higher-denominator' && userAnswer !== correctAnswer) {
            feedback.commonMistake = 'Higher Denominator Trap';
            feedback.explanation = `It looks like you might have thought the fraction with the bigger denominator (${Math.max(denom1, denom2)}) is larger. But remember: when comparing fractions, a larger denominator means smaller pieces!`;
            feedback.howToAvoid = 'Think of pizza slices: 1/8 of a pizza is smaller than 1/4 of a pizza because the pizza is cut into more pieces.';
        } else if (mistakeType === 'unit-fraction' && userAnswer !== correctAnswer) {
            feedback.commonMistake = 'Unit Fraction Confusion';
            feedback.explanation = `With unit fractions (fractions with 1 on top), the larger the bottom number, the smaller the fraction!`;
            feedback.howToAvoid = '1/8 < 1/4 < 1/2 - The more slices you cut something into, the smaller each slice becomes.';
        } else if (mistakeType === 'equivalent' && userAnswer !== '=') {
            feedback.commonMistake = 'Missed Equivalent Fractions';
            feedback.explanation = `These fractions are actually equal! ${num1}/${denom1} = ${num2}/${denom2}`;
            feedback.howToAvoid = 'Try cross-multiplying or simplifying both fractions to check if they\'re equivalent.';
        } else if (mistakeType === 'both-higher' && userAnswer !== correctAnswer) {
            feedback.commonMistake = 'Both Numbers Higher Confusion';
            feedback.explanation = `Just because both the numerator and denominator are larger doesn't mean the fraction is larger!`;
            feedback.howToAvoid = 'Convert both fractions to have the same denominator, then compare the numerators.';
        } else {
            feedback.commonMistake = 'Comparison Error';
            feedback.explanation = `The correct answer is ${num1}/${denom1} ${correctAnswer} ${num2}/${denom2}`;
            feedback.howToAvoid = 'Try converting both fractions to have a common denominator before comparing.';
        }

        return feedback;
    }

    /**
     * Generate personalized practice problems based on student's weak areas
     * @param {number} count
     * @returns {Array} Recommended problem types
     */
    generateAdaptivePractice(count = 5) {
        const recentMistakes = this.studentProfile.mistakeHistory.slice(-10);
        const mistakeFrequency = {};

        recentMistakes.forEach(mistake => {
            const type = mistake.mistakeType || 'general';
            mistakeFrequency[type] = (mistakeFrequency[type] || 0) + 1;
        });

        // Find most common mistake types
        const sortedMistakes = Object.entries(mistakeFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([type]) => type);

        return {
            recommendedTypes: sortedMistakes,
            recommendedCount: count,
            focusAreas: sortedMistakes.slice(0, 3),
            message: 'Based on recent performance, focusing on these problem types will help improve understanding.'
        };
    }

    /**
     * Assess difficulty of a problem
     * @param {Object} problem
     * @returns {string} 'easy', 'medium', 'hard'
     */
    assessDifficulty(problem) {
        const { num1, denom1, num2, denom2 } = problem;

        // Easy: same denominator or very simple
        if (denom1 === denom2) return 'easy';
        if ((num1 === 1 && num2 === 1) || (denom1 <= 4 && denom2 <= 4)) return 'easy';

        // Hard: large denominators, no common factors, close values
        const gcdValue = gcd(denom1, denom2);
        const valueDiff = Math.abs((num1 / denom1) - (num2 / denom2));

        if (denom1 > 10 || denom2 > 10) return 'hard';
        if (gcdValue === 1 && valueDiff < 0.1) return 'hard';

        return 'medium';
    }

    /**
     * Find least common denominator
     * @param {number} a
     * @param {number} b
     * @returns {number} LCD
     */
    findLCD(a, b) {
        return (a * b) / gcd(a, b);
    }

    /**
     * Update student profile with results
     * @param {Array} problems - Completed problems
     */
    updateStudentProfile(problems) {
        const correct = problems.filter(p => p.userAnswer === p.correctAnswer).length;
        const total = problems.length;

        this.studentProfile.totalAttempts += total;
        this.studentProfile.correctAttempts += correct;

        // Analyze performance by mistake type
        const mistakeTypePerformance = {};
        problems.forEach(p => {
            if (p.mistakeType) {
                if (!mistakeTypePerformance[p.mistakeType]) {
                    mistakeTypePerformance[p.mistakeType] = { correct: 0, total: 0 };
                }
                mistakeTypePerformance[p.mistakeType].total++;
                if (p.userAnswer === p.correctAnswer) {
                    mistakeTypePerformance[p.mistakeType].correct++;
                }
            }
        });

        // Identify strengths and weaknesses
        this.studentProfile.strengthAreas = [];
        this.studentProfile.weaknessAreas = [];

        Object.entries(mistakeTypePerformance).forEach(([type, stats]) => {
            const accuracy = stats.correct / stats.total;
            if (accuracy >= 0.8) {
                this.studentProfile.strengthAreas.push(type);
            } else if (accuracy < 0.5) {
                this.studentProfile.weaknessAreas.push(type);
            }
        });

        return {
            accuracy: (correct / total * 100).toFixed(1) + '%',
            strengths: this.studentProfile.strengthAreas,
            weaknesses: this.studentProfile.weaknessAreas,
            overallProgress: (this.studentProfile.correctAttempts / this.studentProfile.totalAttempts * 100).toFixed(1) + '%'
        };
    }

    /**
     * Generate an encouraging message based on performance
     * @param {number} score - Number correct
     * @param {number} total - Total problems
     * @returns {string} Encouraging message
     */
    getEncouragingMessage(score, total) {
        const percentage = (score / total) * 100;

        if (percentage === 100) {
            return '🎉 Perfect score! You\'re a fraction master!';
        } else if (percentage >= 90) {
            return '🌟 Excellent work! You\'re really getting the hang of fractions!';
        } else if (percentage >= 80) {
            return '👏 Great job! Keep practicing and you\'ll be a pro in no time!';
        } else if (percentage >= 70) {
            return '💪 Good effort! Review the problems you missed and try again!';
        } else if (percentage >= 60) {
            return '📚 You\'re making progress! Focus on understanding the concepts and keep practicing!';
        } else {
            return '🌱 Don\'t give up! Fractions can be tricky, but with practice you\'ll improve. Try the step-by-step hints!';
        }
    }

    /**
     * Get learning resources based on difficulty
     * @param {Object} problem
     * @returns {Object} Resource recommendations
     */
    getLearningResources(problem) {
        const difficulty = this.assessDifficulty(problem);
        const analysis = this.analyzeProblem(problem);

        const resources = {
            difficulty,
            strategies: [],
            practice: []
        };

        if (analysis.sameDenominator) {
            resources.strategies.push('Comparing fractions with like denominators');
            resources.practice.push('Practice more problems with the same denominators');
        } else if (analysis.hasCommonMultiple) {
            resources.strategies.push('Using common multiples to compare fractions');
            resources.practice.push('Practice converting fractions with related denominators');
        } else {
            resources.strategies.push('Finding least common denominators');
            resources.practice.push('Practice finding LCD and converting fractions');
        }

        if (analysis.isUnitFraction1 || analysis.isUnitFraction2) {
            resources.strategies.push('Understanding unit fractions');
        }

        return resources;
    }
}

// Export singleton instance
export const educationalAgent = new EducationalAgent();
