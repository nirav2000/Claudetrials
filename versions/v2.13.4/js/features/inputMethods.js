/**
 * Input Methods Module
 * Handles different input methods for answering problems
 */

import { createElement, qs } from '../core/domHelpers.js';
import { CONFIG } from '../core/config.js';
import { recognizeDrawing } from './drawingRecognition.js';

/**
 * Render keyboard input
 * @param {number} index - Problem index
 * @param {string} value - Current value
 * @returns {HTMLElement} Input element
 */
export function renderKeyboardInput(index, value = '') {
    const input = createElement('input', {
        type: 'text',
        className: 'operator-input',
        maxlength: '1',
        'data-problem-index': index,
        value
    });

    // Handle keyboard input
    input.addEventListener('keypress', (e) => {
        const key = e.key;
        const mappedKey = CONFIG.KEY_MAPPINGS[key];

        if (mappedKey) {
            e.preventDefault();
            input.value = mappedKey;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (![...Object.values(CONFIG.OPERATORS)].includes(key)) {
            e.preventDefault();
        }
    });

    return input;
}

/**
 * Render button input
 * @param {number} index - Problem index
 * @param {string} value - Current value
 * @returns {HTMLElement} Button group element
 */
export function renderButtonInput(index, value = '') {
    const container = createElement('div', { className: 'operator-buttons', 'data-problem-index': index });

    Object.values(CONFIG.OPERATORS).forEach(op => {
        const button = createElement('button', {
            className: `operator-btn ${value === op ? 'selected' : ''}`,
            type: 'button',
            'data-operator': op,
            'data-problem-index': index
        }, op);

        button.addEventListener('click', () => {
            // Remove selected class from siblings
            container.querySelectorAll('.operator-btn').forEach(btn => {
                btn.classList.remove('selected');
            });

            // Add selected class to clicked button
            button.classList.add('selected');

            // Dispatch change event
            container.dispatchEvent(new CustomEvent('operatorSelected', {
                bubbles: true,
                detail: { index, operator: op }
            }));
        });

        container.appendChild(button);
    });

    return container;
}

/**
 * Render drawing canvas input
 * @param {number} index - Problem index
 * @param {string} value - Current value
 * @returns {HTMLElement} Canvas container
 */
export function renderDrawingInput(index, value = '') {
    const container = createElement('div', {
        className: 'canvas-container',
        'data-problem-index': index
    });

    const canvas = createElement('canvas', {
        className: 'drawing-canvas',
        width: CONFIG.CANVAS.WIDTH,
        height: CONFIG.CANVAS.HEIGHT,
        'data-problem-index': index
    });

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let strokes = [];
    let currentStroke = [];

    // Drawing handlers
    const startDrawing = (x, y) => {
        isDrawing = true;
        currentStroke = [{ x, y }];
    };

    const draw = (x, y) => {
        if (!isDrawing) return;

        ctx.lineWidth = CONFIG.CANVAS.LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.strokeStyle = CONFIG.CANVAS.STROKE_COLOR;

        const lastPoint = currentStroke[currentStroke.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        currentStroke.push({ x, y });
    };

    const endDrawing = () => {
        if (isDrawing && currentStroke.length > 0) {
            strokes.push([...currentStroke]);
            isDrawing = false;

            // Recognize drawing after a short delay
            setTimeout(() => {
                const recognized = recognizeDrawing(strokes, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
                if (recognized) {
                    container.dispatchEvent(new CustomEvent('operatorSelected', {
                        bubbles: true,
                        detail: { index, operator: recognized }
                    }));
                }
            }, 300);
        }
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        startDrawing(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        draw(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseleave', endDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        draw(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        endDrawing();
    });

    // Clear button
    const clearBtn = createElement('button', {
        className: 'canvas-btn btn-secondary',
        type: 'button'
    }, 'Clear');

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes = [];
        currentStroke = [];
        canvas.classList.remove('correct', 'incorrect');
    });

    const controls = createElement('div', { className: 'canvas-controls' }, [clearBtn]);
    container.appendChild(canvas);
    container.appendChild(controls);

    return container;
}

/**
 * Initialize voice recognition for a problem
 * @param {number} index - Problem index
 * @returns {HTMLElement} Voice container
 */
export function renderVoiceInput(index) {
    const container = createElement('div', {
        className: 'voice-container',
        'data-problem-index': index
    });

    const button = createElement('button', {
        className: 'voice-btn',
        type: 'button',
        'aria-label': 'Start voice recognition'
    }, '🎤');

    const result = createElement('div', {
        className: 'voice-result',
        'data-problem-index': index
    }, '');

    button.addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('voiceStart', {
            bubbles: true,
            detail: { index }
        }));
    });

    container.appendChild(button);
    container.appendChild(result);

    return container;
}
