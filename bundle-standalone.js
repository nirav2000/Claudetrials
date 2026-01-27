#!/usr/bin/env node

/**
 * Bundle modular version into standalone HTML file
 * Uses esbuild to properly bundle ES6 modules
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// CSS files in order
const cssFiles = [
    // Layout
    'css/layout/base.css',
    'css/layout/header.css',
    'css/layout/main-container.css',
    // Components
    'css/components/buttons.css',
    'css/components/forms.css',
    'css/components/modals.css',
    'css/components/cards.css',
    // Features
    'css/features/problem-grid.css',
    'css/features/input-methods.css',
    'css/features/visual-aids.css',
    'css/features/carousel.css',
    'css/features/educational-content.css',
];

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}

function bundleCSS() {
    const combined = cssFiles.map(file => {
        if (fs.existsSync(file)) {
            return `/* ===== ${file} ===== */\n${readFile(file)}`;
        }
        return '';
    }).join('\n\n');
    return combined;
}

async function bundleJS() {
    // Use esbuild to bundle the ES6 modules
    const result = await esbuild.build({
        entryPoints: ['js/app.js'],
        bundle: true,
        format: 'iife',
        write: false,
        minify: false,
        target: 'es2020',
    });

    return result.outputFiles[0].text;
}

async function createStandaloneHTML(outputFile) {
    console.log(`Creating standalone HTML file: ${outputFile}`);

    // Read the base HTML
    let html = readFile('index.html');

    // Bundle CSS
    console.log('  - Bundling CSS files...');
    const bundledCSS = bundleCSS();

    // Bundle JS
    console.log('  - Bundling JavaScript with esbuild...');
    const bundledJS = await bundleJS();

    // Replace CSS links with inline styles
    const cssLinkPattern = /<!-- Modular CSS -->[\s\S]*?(?=<\/head>)/;
    const inlineCSS = `<style>\n${bundledCSS}\n    </style>\n    `;
    html = html.replace(cssLinkPattern, inlineCSS);

    // Replace JS module script with inline script
    const jsScriptPattern = /<!-- Main Application Script -->[\s\S]*?<script.*?src="js\/app\.js".*?><\/script>/;
    const inlineJS = `<!-- Main Application Script (Bundled with esbuild) -->\n    <script>\n${bundledJS}\n    </script>`;
    html = html.replace(jsScriptPattern, inlineJS);

    // Write output file
    fs.writeFileSync(outputFile, html, 'utf-8');

    console.log(`✓ Created ${outputFile}`);
    console.log(`  - Bundled ${bundledCSS.split('\n').length} lines of CSS`);
    console.log(`  - Bundled ${bundledJS.split('\n').length} lines of JavaScript`);
}

// Main execution
const outputFile = process.argv[2];
if (!outputFile) {
    console.error('Usage: node bundle-standalone.js <output-file>');
    process.exit(1);
}

createStandaloneHTML(outputFile).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
