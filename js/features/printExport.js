/**
 * Print & Export Module
 * Handles printing and PDF export functionality
 */

import { qs, qsa, addClass, removeClass } from '../core/domHelpers.js';

/**
 * Print worksheet
 */
export function printWorksheet() {
    // Hide collapsible sections before printing
    hideCollapsibleSections();

    // Trigger print
    window.print();
}

/**
 * Download worksheet as PDF
 */
export async function downloadPDF() {
    if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please check your internet connection.');
        return;
    }

    try {
        // Hide collapsible sections
        hideCollapsibleSections();

        const element = qs('.container');
        if (!element) {
            throw new Error('Container element not found');
        }

        const opt = {
            margin: 10,
            filename: `fraction-worksheet-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();

        // Restore sections after PDF generation
        setTimeout(restoreCollapsibleSections, 1000);
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
        restoreCollapsibleSections();
    }
}

/**
 * Hide collapsible sections for printing
 */
function hideCollapsibleSections() {
    // Hide Learning Guide unless print option is checked
    const printLearningGuide = qs('#print-learning-guide');
    if (!printLearningGuide || !printLearningGuide.checked) {
        const educationalContent = qsa('.educational-content');
        educationalContent.forEach(section => {
            addClass(section, 'hidden-for-print');
        });
    }

    // Hide visual aids unless print option is checked
    const printVisualAids = qs('#print-visual-aids');
    if (!printVisualAids || !printVisualAids.checked) {
        const visualAids = qsa('.visual-aids');
        visualAids.forEach(aid => {
            addClass(aid, 'hidden-for-print');
        });
    }

    // Hide controls and buttons
    const controls = qs('.controls');
    if (controls) {
        controls.style.display = 'none';
    }

    const buttonGroups = qsa('.button-group');
    buttonGroups.forEach(group => {
        group.style.display = 'none';
    });

    // Hide version info
    const versionInfo = qs('.header-version');
    if (versionInfo) {
        versionInfo.style.display = 'none';
    }

    // Hide instructions
    const instructions = qs('.instructions');
    if (instructions) {
        instructions.style.display = 'none';
    }

    // Hide score
    const score = qs('.score');
    if (score) {
        score.style.display = 'none';
    }
}

/**
 * Restore collapsible sections after printing
 */
function restoreCollapsibleSections() {
    // Restore educational content
    const educationalContent = qsa('.educational-content');
    educationalContent.forEach(section => {
        removeClass(section, 'hidden-for-print');
    });

    // Restore visual aids
    const visualAids = qsa('.visual-aids');
    visualAids.forEach(aid => {
        removeClass(aid, 'hidden-for-print');
    });

    // Restore controls and buttons
    const controls = qs('.controls');
    if (controls) {
        controls.style.display = '';
    }

    const buttonGroups = qsa('.button-group');
    buttonGroups.forEach(group => {
        group.style.display = '';
    });

    // Restore version info
    const versionInfo = qs('.header-version');
    if (versionInfo) {
        versionInfo.style.display = '';
    }

    // Restore instructions
    const instructions = qs('.instructions');
    if (instructions) {
        instructions.style.display = '';
    }

    // Restore score
    const score = qs('.score');
    if (score && score.classList.contains('show')) {
        score.style.display = '';
    }
}

/**
 * Setup print event listeners
 */
export function setupPrintListeners() {
    window.addEventListener('beforeprint', hideCollapsibleSections);
    window.addEventListener('afterprint', restoreCollapsibleSections);
}
