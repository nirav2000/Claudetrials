/**
 * Application Configuration
 * Contains all constants and configuration settings
 */

export const CONFIG = {
    // App Information
    APP_NAME: 'Interactive Fraction Comparison Practice',
    VERSION: '2.0.0',

    // Problem Generation
    PROBLEM_COUNTS: [10, 20, 30, 40],
    DEFAULT_PROBLEM_COUNT: 20,

    // Denominator Sets
    DENOMINATOR_SETS: {
        'default': [12, 20],
        'basic': [10, 12, 20],
        'intermediate': [6, 8, 10, 12],
        'all': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },

    // Input Methods
    INPUT_METHODS: {
        KEYBOARD: 'keyboard',
        BUTTONS: 'buttons',
        DRAWING: 'drawing',
        VOICE: 'voice'
    },
    DEFAULT_INPUT_METHOD: 'keyboard',

    // Operators
    OPERATORS: {
        LESS_THAN: '<',
        GREATER_THAN: '>',
        EQUAL: '='
    },

    // Keyboard Key Mappings
    KEY_MAPPINGS: {
        '<': '<',
        ',': '<',
        'ArrowLeft': '<',
        '>': '>',
        '.': '>',
        'ArrowRight': '>',
        '=': '=',
        'ArrowUp': '=',
        'ArrowDown': '='
    },

    // Voice Recognition Keywords
    VOICE_KEYWORDS: {
        'less': '<',
        'less than': '<',
        'smaller': '<',
        'smaller than': '<',
        'lower': '<',
        'lower than': '<',
        'greater': '>',
        'greater than': '>',
        'bigger': '>',
        'bigger than': '>',
        'larger': '>',
        'larger than': '>',
        'more': '>',
        'more than': '>',
        'equal': '=',
        'equals': '=',
        'same': '=',
        'same as': '='
    },

    // Canvas Settings
    CANVAS: {
        WIDTH: 100,
        HEIGHT: 100,
        LINE_WIDTH: 3,
        STROKE_COLOR: '#000000'
    },

    // Timer Settings
    TIMER_OPTIONS: [
        { value: 0, label: 'Off' },
        { value: 30000, label: '30 seconds' },
        { value: 45000, label: '45 seconds' },
        { value: 60000, label: '60 seconds' },
        { value: 90000, label: '90 seconds' }
    ],
    DEFAULT_TIMER: 0,

    // Common Mistakes
    MISTAKE_TYPES: {
        HIGHER_DENOMINATOR: 'higher-denominator',
        BOTH_HIGHER: 'both-higher',
        UNIT_FRACTION: 'unit-fraction',
        NEAR_WHOLE: 'near-whole',
        EQUIVALENT: 'equivalent'
    },

    // Visual Settings
    PIZZA_COLORS: {
        FILLED: '#FFA726',
        EMPTY: '#FFFFFF',
        BORDER: '#333333'
    },

    // Animation Durations (ms)
    ANIMATIONS: {
        MODAL_FADE: 300,
        CAROUSEL_SLIDE: 300,
        BUTTON_RIPPLE: 600
    },

    // Print Settings
    PRINT: {
        PROBLEMS_PER_PAGE: 20,
        PAGE_ORIENTATION: 'portrait'
    }
};

export default CONFIG;
