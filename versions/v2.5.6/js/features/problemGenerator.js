/**
 * Problem Generator Module
 * Generates fraction comparison problems
 */

import { randomInt, randomElement, compareFractions } from '../core/utils.js';
import { CONFIG } from '../core/config.js';

/**
 * Generate random fraction
 * @param {Array} denominators - Available denominators
 * @returns {Object} Fraction {numerator, denominator}
 */
function generateFraction(denominators) {
    const denominator = randomElement(denominators);
    const numerator = randomInt(1, denominator - 1);
    return { numerator, denominator };
}

/**
 * Generate regular worksheet problems
 * @param {number} count - Number of problems
 * @param {Array} denominators - Available denominators
 * @returns {Array} Problems array
 */
export function generateProblems(count, denominators) {
    const problems = [];

    for (let i = 0; i < count; i++) {
        const fraction1 = generateFraction(denominators);
        const fraction2 = generateFraction(denominators);

        // Ensure fractions are not identical
        if (fraction1.numerator === fraction2.numerator &&
            fraction1.denominator === fraction2.denominator) {
            i--;
            continue;
        }

        const correctAnswer = compareFractions(
            fraction1.numerator,
            fraction1.denominator,
            fraction2.numerator,
            fraction2.denominator
        );

        problems.push({
            num1: fraction1.numerator,
            denom1: fraction1.denominator,
            num2: fraction2.numerator,
            denom2: fraction2.denominator,
            correctAnswer,
            userAnswer: null,
            mistakeType: null
        });
    }

    return problems;
}

/**
 * Generate common mistakes problem
 * @param {string} mistakeType - Type of mistake
 * @param {Array} denominators - Available denominators
 * @returns {Object} Problem object
 */
function generateMistakeProblem(mistakeType, denominators) {
    let num1, denom1, num2, denom2;

    switch (mistakeType) {
        case CONFIG.MISTAKE_TYPES.HIGHER_DENOMINATOR: {
            // Higher denominator but smaller value
            const largeDenoms = denominators.filter(d => d > 4);
            if (largeDenoms.length === 0) {
                // Fallback: use largest and smallest available denominators
                const sorted = [...denominators].sort((a, b) => b - a);
                denom1 = sorted[0];
                denom2 = sorted[sorted.length - 1];
            } else {
                denom1 = randomElement(largeDenoms);
                const smallerDenoms = denominators.filter(d => d < denom1 && d > 2);
                if (smallerDenoms.length === 0) {
                    // Fallback: use any smaller denominator
                    const fallbackDenoms = denominators.filter(d => d < denom1);
                    denom2 = fallbackDenoms.length > 0 ? randomElement(fallbackDenoms) : denominators[0];
                } else {
                    denom2 = randomElement(smallerDenoms);
                }
            }
            num1 = randomInt(1, Math.max(1, Math.floor(denom1 / 2)));
            num2 = randomInt(Math.max(1, Math.ceil(denom2 / 2)), Math.max(1, denom2 - 1));
            break;
        }

        case CONFIG.MISTAKE_TYPES.BOTH_HIGHER: {
            // Both numerator and denominator higher
            const largeDenoms = denominators.filter(d => d > 4);
            if (largeDenoms.length === 0) {
                // Fallback: use two different denominators
                denom1 = randomElement(denominators);
                const otherDenoms = denominators.filter(d => d !== denom1);
                denom2 = otherDenoms.length > 0 ? randomElement(otherDenoms) : denominators[0];
            } else {
                denom1 = randomElement(largeDenoms);
                const smallerDenoms = denominators.filter(d => d < denom1 - 2);
                if (smallerDenoms.length === 0) {
                    const fallbackDenoms = denominators.filter(d => d < denom1);
                    denom2 = fallbackDenoms.length > 0 ? randomElement(fallbackDenoms) : denominators[0];
                } else {
                    denom2 = randomElement(smallerDenoms);
                }
            }
            num1 = randomInt(Math.max(1, Math.ceil(denom1 * 0.6)), Math.max(1, denom1 - 1));
            num2 = randomInt(1, Math.max(1, Math.floor(denom2 * 0.4)));
            break;
        }

        case CONFIG.MISTAKE_TYPES.UNIT_FRACTION: {
            // Unit fractions (numerator = 1)
            denom1 = randomElement(denominators);
            const otherDenoms = denominators.filter(d => d !== denom1);
            denom2 = otherDenoms.length > 0 ? randomElement(otherDenoms) : denominators[0];
            num1 = 1;
            num2 = 1;
            break;
        }

        case CONFIG.MISTAKE_TYPES.NEAR_WHOLE: {
            // Fractions close to 1
            const largeDenoms = denominators.filter(d => d > 3);
            if (largeDenoms.length < 2) {
                // Fallback: use any two different denominators
                denom1 = randomElement(denominators);
                const otherDenoms = denominators.filter(d => d !== denom1);
                denom2 = otherDenoms.length > 0 ? randomElement(otherDenoms) : denominators[0];
            } else {
                denom1 = randomElement(largeDenoms);
                const otherLargeDenoms = largeDenoms.filter(d => d !== denom1);
                denom2 = otherLargeDenoms.length > 0 ? randomElement(otherLargeDenoms) : largeDenoms[0];
            }
            num1 = Math.max(1, denom1 - randomInt(1, 2));
            num2 = Math.max(1, denom2 - randomInt(1, 2));
            break;
        }

        case CONFIG.MISTAKE_TYPES.EQUIVALENT: {
            // Equivalent fractions
            const largeDenoms = denominators.filter(d => d > 3);
            const baseDenom = largeDenoms.length > 0 ? randomElement(largeDenoms) : randomElement(denominators);
            const baseNum = randomInt(1, Math.max(1, baseDenom - 1));
            const multiplier = randomInt(2, 3);

            num1 = baseNum;
            denom1 = baseDenom;
            num2 = baseNum * multiplier;
            denom2 = baseDenom * multiplier;

            // Ensure denom2 is in available denominators
            if (!denominators.includes(denom2)) {
                denom2 = baseDenom;
                num2 = baseNum;
            }
            break;
        }

        default: {
            const frac1 = generateFraction(denominators);
            const frac2 = generateFraction(denominators);
            num1 = frac1.numerator;
            denom1 = frac1.denominator;
            num2 = frac2.numerator;
            denom2 = frac2.denominator;
        }
    }

    const correctAnswer = compareFractions(num1, denom1, num2, denom2);

    return {
        num1,
        denom1,
        num2,
        denom2,
        correctAnswer,
        userAnswer: null,
        mistakeType
    };
}

/**
 * Generate common mistakes problems
 * @param {number} count - Number of problems
 * @param {Array} denominators - Available denominators
 * @param {Array} enabledMistakes - Enabled mistake types
 * @returns {Array} Problems array
 */
export function generateMistakesProblems(count, denominators, enabledMistakes) {
    const problems = [];
    const mistakeTypes = enabledMistakes.length > 0
        ? enabledMistakes
        : Object.values(CONFIG.MISTAKE_TYPES);

    for (let i = 0; i < count; i++) {
        const mistakeType = randomElement(mistakeTypes);
        const problem = generateMistakeProblem(mistakeType, denominators);
        problems.push(problem);
    }

    return problems;
}
