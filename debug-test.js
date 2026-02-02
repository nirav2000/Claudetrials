/**
 * Debug Test Script
 * Tests if the app initializes correctly
 */

// Simulate the page load sequence
async function debugTest() {
    console.log('=== DEBUG TEST START ===');

    try {
        // Step 1: Import CONFIG
        console.log('1. Loading CONFIG...');
        const { CONFIG } = await import('./js/core/config.js');
        console.log('✓ CONFIG loaded:', CONFIG);

        // Step 2: Import DOM helpers
        console.log('2. Loading DOM helpers...');
        const domHelpers = await import('./js/core/domHelpers.js');
        console.log('✓ DOM helpers loaded');

        // Step 3: Import problem generator
        console.log('3. Loading problem generator...');
        const { generateProblems } = await import('./js/features/problemGenerator.js');
        console.log('✓ Problem generator loaded');

        // Step 4: Generate test problems
        console.log('4. Generating test problems...');
        const testProblems = generateProblems(5, [2, 4]);
        console.log('✓ Generated problems:', testProblems);

        // Step 5: Check if problems are valid
        if (testProblems && testProblems.length === 5) {
            console.log('✓ Problem generation working correctly!');
            console.log('Sample problem:', testProblems[0]);
        } else {
            console.error('✗ Problem generation failed or returned wrong number');
        }

        // Step 6: Try loading the app
        console.log('5. Loading main app...');
        const app = await import('./js/app.js');
        console.log('✓ Main app loaded successfully!');

        console.log('=== ALL TESTS PASSED ===');
        return true;
    } catch (error) {
        console.error('=== TEST FAILED ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run the test
debugTest().then(success => {
    if (success) {
        console.log('\n✅ All components loaded successfully!');
        console.log('If the worksheet is not displaying, check:');
        console.log('1. Browser console for runtime errors');
        console.log('2. Network tab for failed requests');
        console.log('3. DOM elements (#problems-container) exist');
    } else {
        console.log('\n❌ Component loading failed. Check errors above.');
    }
});
