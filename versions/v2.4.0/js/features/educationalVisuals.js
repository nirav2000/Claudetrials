/**
 * Educational Visuals Module
 * Dynamically generates SVG circle diagrams for educational content
 */

import { createCircleChart, createCircleChartWithLabel, COLOR_SCHEMES } from '../utils/circleChart.js';

/**
 * Initialize all educational visual elements
 */
export function initializeEducationalVisuals() {
    populateFractionBasicsVisuals();
    populateMoreExamplesVisuals();
    populatePizzaTimeVisuals();
    populateTimeManagementVisuals();
    populateCookingVisuals();
    populateMoneyVisuals();
    populateSportsVisuals();
    populateMisconceptionsVisuals();
}

/**
 * Populate "What Are Fractions" section visuals
 */
function populateFractionBasicsVisuals() {
    // Main 3/4 demonstration (large circle)
    const mainCircleContainer = document.getElementById('fraction-basics-main-circle');
    if (mainCircleContainer) {
        const svg = createCircleChart({
            numerator: 3,
            denominator: 4,
            size: 120
        });
        mainCircleContainer.appendChild(svg);
    }
}

/**
 * Populate "More Examples" section visuals
 */
function populateMoreExamplesVisuals() {
    const examplesContainer = document.getElementById('more-examples-circles');
    if (!examplesContainer) return;

    const examples = [
        { numerator: 1, denominator: 4, label: '1/4', sublabel: 'one fourth' },
        { numerator: 1, denominator: 2, label: '1/2', sublabel: 'one half' },
        { numerator: 3, denominator: 4, label: '3/4', sublabel: 'three fourths' },
        { numerator: 4, denominator: 4, label: '4/4 = 1', sublabel: 'one whole' }
    ];

    examples.forEach(ex => {
        const container = createCircleChartWithLabel({
            numerator: ex.numerator,
            denominator: ex.denominator,
            size: 80,
            label: ex.label,
            sublabel: ex.sublabel
        });
        examplesContainer.appendChild(container);
    });
}

/**
 * Populate "Pizza Time" section visuals
 */
function populatePizzaTimeVisuals() {
    // You: 3/8
    const youContainer = document.getElementById('pizza-you');
    if (youContainer) {
        const svg = createCircleChart({
            numerator: 3,
            denominator: 8,
            size: 100
        });
        youContainer.appendChild(svg);
    }

    // Friend: 2/8
    const friendContainer = document.getElementById('pizza-friend');
    if (friendContainer) {
        const svg = createCircleChart({
            numerator: 2,
            denominator: 8,
            size: 100
        });
        friendContainer.appendChild(svg);
    }
}

/**
 * Populate "Time Management" section visuals
 */
function populateTimeManagementVisuals() {
    const timeContainer = document.getElementById('time-management-circles');
    if (!timeContainer) return;

    const activities = [
        { numerator: 1, denominator: 4, label: 'Homework', sublabel: '1/4 hour', color: 'green' },
        { numerator: 1, denominator: 2, label: 'Video games', sublabel: '1/2 hour', color: 'blue' },
        { numerator: 1, denominator: 4, label: 'Reading', sublabel: '1/4 hour', color: 'default' }
    ];

    activities.forEach(activity => {
        const container = createCircleChartWithLabel({
            numerator: activity.numerator,
            denominator: activity.denominator,
            size: 80,
            label: activity.sublabel,
            sublabel: activity.label,
            ...COLOR_SCHEMES[activity.color]
        });
        timeContainer.appendChild(container);
    });
}

/**
 * Populate "Cooking & Recipes" section visuals
 */
function populateCookingVisuals() {
    const cookingContainer = document.getElementById('cooking-circles');
    if (!cookingContainer) return;

    const ingredients = [
        { numerator: 3, denominator: 4, label: '3/4 cup', sublabel: 'flour', color: 'green' },
        { numerator: 1, denominator: 2, label: '1/2 cup', sublabel: 'sugar', color: 'red' },
        { numerator: 1, denominator: 3, label: '1/3 cup', sublabel: 'butter', color: 'yellow' }
    ];

    ingredients.forEach(ingredient => {
        const container = createCircleChartWithLabel({
            numerator: ingredient.numerator,
            denominator: ingredient.denominator,
            size: 60,
            label: ingredient.label,
            sublabel: ingredient.sublabel,
            ...COLOR_SCHEMES[ingredient.color]
        });
        cookingContainer.appendChild(container);
    });
}

/**
 * Populate "Money and Shopping" section visuals
 */
function populateMoneyVisuals() {
    const moneyContainer = document.getElementById('money-circles');
    if (!moneyContainer) return;

    const discounts = [
        { numerator: 1, denominator: 2, label: '50% OFF', sublabel: '= 1/2 off', color: 'pink' },
        { numerator: 1, denominator: 4, label: '25% OFF', sublabel: '= 1/4 off', color: 'purple' }
    ];

    discounts.forEach(discount => {
        const container = createCircleChartWithLabel({
            numerator: discount.numerator,
            denominator: discount.denominator,
            size: 80,
            label: discount.label,
            sublabel: discount.sublabel,
            ...COLOR_SCHEMES[discount.color]
        });
        moneyContainer.appendChild(container);
    });
}

/**
 * Populate "Sports and Measurements" section visuals
 */
function populateSportsVisuals() {
    const sportsContainer = document.getElementById('sports-circles');
    if (!sportsContainer) return;

    const container = createCircleChartWithLabel({
        numerator: 3,
        denominator: 8,
        size: 80,
        label: '3/8 mile',
        sublabel: 'track distance',
        ...COLOR_SCHEMES.cyan
    });
    sportsContainer.appendChild(container);
}

/**
 * Populate "Common Misconceptions" carousel visuals
 */
function populateMisconceptionsVisuals() {
    // Misconception 1: Bigger Denominator = Bigger Fraction (1/8 vs 1/4)
    const misconception1 = document.getElementById('misconception-1-visual');
    if (misconception1) {
        const circle1 = createCircleChartWithLabel({
            numerator: 1,
            denominator: 8,
            size: 100,
            label: '1/8',
            sublabel: 'smaller!',
            ...COLOR_SCHEMES.red
        });
        const circle2 = createCircleChartWithLabel({
            numerator: 1,
            denominator: 4,
            size: 100,
            label: '1/4',
            sublabel: 'larger!',
            ...COLOR_SCHEMES.green
        });
        misconception1.appendChild(circle1);
        misconception1.appendChild(document.createTextNode(' < '));
        misconception1.appendChild(circle2);
    }

    // Misconception 2: Just Compare Numerators (3/8 vs 2/3)
    const misconception2 = document.getElementById('misconception-2-visual');
    if (misconception2) {
        const circle1 = createCircleChartWithLabel({
            numerator: 3,
            denominator: 8,
            size: 100,
            label: '3/8',
            sublabel: 'smaller',
            ...COLOR_SCHEMES.red
        });
        const circle2 = createCircleChartWithLabel({
            numerator: 2,
            denominator: 3,
            size: 100,
            label: '2/3',
            sublabel: 'larger',
            ...COLOR_SCHEMES.green
        });
        misconception2.appendChild(circle1);
        misconception2.appendChild(document.createTextNode(' < '));
        misconception2.appendChild(circle2);
    }

    // Misconception 3: Both Numbers Bigger = Fraction Bigger (7/10 vs 2/3)
    const misconception3 = document.getElementById('misconception-3-visual');
    if (misconception3) {
        const circle1 = createCircleChartWithLabel({
            numerator: 7,
            denominator: 10,
            size: 100,
            label: '7/10',
            sublabel: 'slightly larger',
            ...COLOR_SCHEMES.green
        });
        const circle2 = createCircleChartWithLabel({
            numerator: 2,
            denominator: 3,
            size: 100,
            label: '2/3',
            sublabel: 'close!',
            ...COLOR_SCHEMES.blue
        });
        misconception3.appendChild(circle1);
        misconception3.appendChild(document.createTextNode(' > '));
        misconception3.appendChild(circle2);
    }

    // Misconception 4: Fractions Near 1 Are Hard (5/6 vs 7/8)
    const misconception4 = document.getElementById('misconception-4-visual');
    if (misconception4) {
        const circle1 = createCircleChartWithLabel({
            numerator: 5,
            denominator: 6,
            size: 100,
            label: '5/6',
            sublabel: 'missing 1/6',
            ...COLOR_SCHEMES.blue
        });
        const circle2 = createCircleChartWithLabel({
            numerator: 7,
            denominator: 8,
            size: 100,
            label: '7/8',
            sublabel: 'missing 1/8',
            ...COLOR_SCHEMES.green
        });
        misconception4.appendChild(circle1);
        misconception4.appendChild(document.createTextNode(' < '));
        misconception4.appendChild(circle2);
    }

    // Misconception 5: Equivalent Fractions Look Different (2/4 = 1/2 = 3/6)
    const misconception5 = document.getElementById('misconception-5-visual');
    if (misconception5) {
        const circle1 = createCircleChartWithLabel({
            numerator: 2,
            denominator: 4,
            size: 90,
            label: '2/4',
            sublabel: 'equivalent',
            ...COLOR_SCHEMES.purple
        });
        const circle2 = createCircleChartWithLabel({
            numerator: 1,
            denominator: 2,
            size: 90,
            label: '1/2',
            sublabel: 'equivalent',
            ...COLOR_SCHEMES.purple
        });
        const circle3 = createCircleChartWithLabel({
            numerator: 3,
            denominator: 6,
            size: 90,
            label: '3/6',
            sublabel: 'equivalent',
            ...COLOR_SCHEMES.purple
        });
        misconception5.appendChild(circle1);
        misconception5.appendChild(document.createTextNode(' = '));
        misconception5.appendChild(circle2);
        misconception5.appendChild(document.createTextNode(' = '));
        misconception5.appendChild(circle3);
    }
}
