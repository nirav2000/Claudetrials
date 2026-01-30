/**
 * Voice Recognition Module
 * Handles voice input for answering problems
 */

import { CONFIG } from '../core/config.js';
import { qs } from '../core/domHelpers.js';

let recognition = null;
let currentProblemIndex = null;

/**
 * Initialize voice recognition
 * @returns {boolean} True if supported, false otherwise
 */
export function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported in this browser');
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = handleVoiceResult;
    recognition.onerror = handleVoiceError;
    recognition.onend = handleVoiceEnd;

    return true;
}

/**
 * Start voice recognition for a problem
 * @param {number} problemIndex - Problem index
 */
export function startVoiceRecognition(problemIndex) {
    if (!recognition) {
        showVoiceStatus('Voice recognition not available', 'error');
        return;
    }

    currentProblemIndex = problemIndex;

    try {
        recognition.start();
        updateVoiceButton(problemIndex, true);
        showVoiceStatus('Listening... Say "less than", "greater than", or "equal"', 'success');
    } catch (error) {
        if (error.name === 'InvalidStateError') {
            // Recognition already started, stop and restart
            recognition.stop();
            setTimeout(() => startVoiceRecognition(problemIndex), 100);
        } else {
            console.error('Voice recognition error:', error);
            showVoiceStatus('Error starting voice recognition', 'error');
        }
    }
}

/**
 * Handle voice recognition result
 * @param {Event} event - Speech recognition event
 */
function handleVoiceResult(event) {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log('Voice transcript:', transcript);

    let operator = null;

    // Check keywords
    for (const [keyword, op] of Object.entries(CONFIG.VOICE_KEYWORDS)) {
        if (transcript.includes(keyword)) {
            operator = op;
            break;
        }
    }

    if (operator && currentProblemIndex !== null) {
        // Update voice result display
        const voiceResult = qs(`.voice-result[data-problem-index="${currentProblemIndex}"]`);
        if (voiceResult) {
            voiceResult.textContent = operator;
        }

        // Dispatch event to update problem
        const container = qs(`.voice-container[data-problem-index="${currentProblemIndex}"]`);
        if (container) {
            container.dispatchEvent(new CustomEvent('operatorSelected', {
                bubbles: true,
                detail: { index: currentProblemIndex, operator }
            }));
        }

        showVoiceStatus(`Recognized: "${transcript}" → ${operator}`, 'success');
    } else {
        showVoiceStatus(`Could not recognize operator from: "${transcript}"`, 'error');
    }

    updateVoiceButton(currentProblemIndex, false);
}

/**
 * Handle voice recognition error
 * @param {Event} event - Error event
 */
function handleVoiceError(event) {
    console.error('Voice recognition error:', event.error);

    const errorMessages = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not available.',
        'not-allowed': 'Microphone access denied.',
        'network': 'Network error occurred.',
        'aborted': 'Recognition aborted.'
    };

    const message = errorMessages[event.error] || 'Voice recognition error occurred.';
    showVoiceStatus(message, 'error');

    updateVoiceButton(currentProblemIndex, false);
}

/**
 * Handle voice recognition end
 */
function handleVoiceEnd() {
    updateVoiceButton(currentProblemIndex, false);
}

/**
 * Update voice button state
 * @param {number} problemIndex - Problem index
 * @param {boolean} isListening - Is currently listening
 */
function updateVoiceButton(problemIndex, isListening) {
    if (problemIndex === null) return;

    const button = qs(`.voice-container[data-problem-index="${problemIndex}"] .voice-btn`);
    if (button) {
        if (isListening) {
            button.classList.add('listening');
        } else {
            button.classList.remove('listening');
        }
    }
}

/**
 * Show voice status message
 * @param {string} message - Status message
 * @param {string} type - Message type ('success', 'error', or default)
 */
export function showVoiceStatus(message, type = '') {
    let statusElement = qs('.voice-status');

    // Create status element if it doesn't exist
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.className = 'voice-status';

        const container = qs('.container');
        if (container) {
            const firstChild = container.firstChild;
            container.insertBefore(statusElement, firstChild);
        }
    }

    statusElement.textContent = message;
    statusElement.className = `voice-status show ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 3000);
}

/**
 * Check if voice recognition is supported
 * @returns {boolean} True if supported
 */
export function isVoiceSupported() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
}
