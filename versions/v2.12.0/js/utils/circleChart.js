/**
 * Circle Chart Utility
 * Generates SVG-based circle/pie charts for visual fraction representation
 */

/**
 * Generate a circle chart (pie diagram) for fractions
 * @param {Object} options - Configuration options
 * @param {number} options.numerator - Number of filled slices
 * @param {number} options.denominator - Total number of slices
 * @param {number} [options.size=80] - SVG size in pixels
 * @param {string} [options.filledColor='#FFA726'] - Color for filled slices
 * @param {string} [options.emptyColor='#FFFFFF'] - Color for empty slices
 * @param {string} [options.borderColor='#333'] - Border color
 * @param {number} [options.borderWidth=2] - Border width
 * @param {number} [options.sliceBorderWidth=1] - Individual slice border width
 * @returns {SVGElement} SVG element
 */
export function createCircleChart({
    numerator,
    denominator,
    size = 80,
    filledColor = '#FFA726',
    emptyColor = '#FFFFFF',
    borderColor = '#333',
    borderWidth = 2,
    sliceBorderWidth = 1
}) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - borderWidth;

    // Draw outer circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', centerX);
    outerCircle.setAttribute('cy', centerY);
    outerCircle.setAttribute('r', radius);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', borderColor);
    outerCircle.setAttribute('stroke-width', borderWidth);
    svg.appendChild(outerCircle);

    // Draw slices
    const anglePerSlice = (2 * Math.PI) / denominator;

    for (let i = 0; i < denominator; i++) {
        // Start from top (12 o'clock position)
        const startAngle = i * anglePerSlice - Math.PI / 2;
        const endAngle = startAngle + anglePerSlice;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        // Create slice path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArc = anglePerSlice > Math.PI ? 1 : 0;

        const d = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        path.setAttribute('d', d);
        path.setAttribute('fill', i < numerator ? filledColor : emptyColor);
        path.setAttribute('stroke', borderColor);
        path.setAttribute('stroke-width', sliceBorderWidth);
        svg.appendChild(path);
    }

    return svg;
}

/**
 * Create a circle chart as an HTML string
 * @param {Object} options - Same as createCircleChart
 * @returns {string} SVG HTML string
 */
export function createCircleChartHTML(options) {
    const svg = createCircleChart(options);
    return svg.outerHTML;
}

/**
 * Create a circle chart with label
 * @param {Object} options - Configuration options (extends createCircleChart options)
 * @param {string} [options.label] - Label text to display below the chart
 * @param {string} [options.sublabel] - Sublabel text (smaller text below label)
 * @returns {HTMLElement} Container with SVG and label
 */
export function createCircleChartWithLabel(options) {
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.display = 'inline-block';

    // Create and append SVG
    const svg = createCircleChart(options);
    container.appendChild(svg);

    // Add label if provided
    if (options.label) {
        const labelDiv = document.createElement('div');
        labelDiv.innerHTML = `<strong>${options.label}</strong>`;
        if (options.sublabel) {
            labelDiv.innerHTML += `<br><small>${options.sublabel}</small>`;
        }
        labelDiv.style.marginTop = '10px';
        container.appendChild(labelDiv);
    }

    return container;
}

/**
 * Common fraction presets for quick generation
 */
export const FRACTION_PRESETS = {
    oneHalf: { numerator: 1, denominator: 2 },
    oneThird: { numerator: 1, denominator: 3 },
    twoThirds: { numerator: 2, denominator: 3 },
    oneFourth: { numerator: 1, denominator: 4 },
    threeFourths: { numerator: 3, denominator: 4 },
    oneFifth: { numerator: 1, denominator: 5 },
    twoFifths: { numerator: 2, denominator: 5 },
    threeFifths: { numerator: 3, denominator: 5 },
    fourFifths: { numerator: 4, denominator: 5 },
    oneEighth: { numerator: 1, denominator: 8 },
    threeEighths: { numerator: 3, denominator: 8 },
    fiveEighths: { numerator: 5, denominator: 8 },
    sevenEighths: { numerator: 7, denominator: 8 },
    whole: { numerator: 4, denominator: 4 }
};

/**
 * Color schemes for different contexts
 */
export const COLOR_SCHEMES = {
    default: {
        filledColor: '#FFA726',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    green: {
        filledColor: '#8BC34A',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    blue: {
        filledColor: '#2196F3',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    red: {
        filledColor: '#FF5722',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    yellow: {
        filledColor: '#FFD54F',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    purple: {
        filledColor: '#9C27B0',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    pink: {
        filledColor: '#E91E63',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    },
    cyan: {
        filledColor: '#00BCD4',
        emptyColor: '#FFFFFF',
        borderColor: '#333'
    }
};
