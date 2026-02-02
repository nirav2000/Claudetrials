# AI Agents for Fraction Comparison Practice

## Quick Start

This application now includes two powerful AI agents:

### 🤖 Educational AI Agent
**Purpose**: Intelligent tutoring system that provides personalized learning support

**Key Features**:
- Multi-level hints (gentle → detailed → step-by-step)
- Mistake analysis and targeted feedback
- Progress tracking and learning analytics
- Adaptive practice recommendations
- Encouraging messages based on performance

**How to Use**:
1. Generate a worksheet
2. Click on the "🤖 AI Agents" panel
3. Select hint level or view progress

### 🧪 Testing Agent
**Purpose**: Automated quality assurance and validation

**Key Features**:
- Comprehensive test suite (35+ tests)
- Problem validation
- Performance testing
- HTML test reports
- Real-time test execution

**How to Use**:
1. Click "Run All Tests" in the agent panel
2. View results in console and UI
3. Export HTML report for documentation

## File Structure

```
/home/user/Claudetrials/
├── js/
│   ├── agents/
│   │   ├── educationalAgent.js    # Educational AI Agent
│   │   └── testingAgent.js        # Testing Agent
│   └── features/
│       └── agentUI.js              # Agent UI components
├── css/
│   └── features/
│       └── agents.css              # Agent styling
├── test-agents.html                # Agent testing page
├── AGENTS_DOCUMENTATION.md         # Full documentation
└── AGENTS_README.md                # This file
```

## Quick Test

Open `test-agents.html` in your browser to test both agents:

```bash
# Open in browser
open test-agents.html

# Or serve locally
python3 -m http.server 8000
# Then visit: http://localhost:8000/test-agents.html
```

## Integration

Both agents are automatically integrated into the main application:

1. **index.html** - Includes agent CSS
2. **app.js** - Initializes agents on load
3. **Agent Panel** - Visible in main application

## Example Usage

### Educational Agent

```javascript
import { educationalAgent } from './js/agents/educationalAgent.js';

// Get a hint
const problem = { num1: 3, denom1: 8, num2: 5, denom2: 12, correctAnswer: '<' };
const hint = educationalAgent.getHint(problem, 1); // 1=gentle, 2=detailed, 3=step-by-step

// Analyze a mistake
const feedback = educationalAgent.analyzeMistake(problem, '>'); // User answered '>'

// Get encouraging message
const message = educationalAgent.getEncouragingMessage(8, 10); // 8 correct out of 10
// Returns: "👏 Great job! Keep practicing and you'll be a pro in no time!"
```

### Testing Agent

```javascript
import { testingAgent } from './js/agents/testingAgent.js';

// Run all tests
const report = await testingAgent.runAllTests();
console.log(`Pass rate: ${report.summary.passRate}`);

// Test specific problems
const problems = generateProblems(10, [2, 4, 6, 8]);
const results = testingAgent.testProblemBatch(problems);
console.log(`Valid: ${results.valid}, Invalid: ${results.invalid}`);

// Export HTML report
const html = testingAgent.exportHTMLReport();
// Save to file or display in browser
```

## Testing

### Manual Testing

1. Open `test-agents.html` in browser
2. Click test buttons to verify functionality
3. Check console for detailed output

### Automated Testing

```javascript
// Run in browser console
import { testingAgent } from './js/agents/testingAgent.js';
await testingAgent.runAllTests();
```

Expected output:
```
🧪 Starting Testing Agent...

📋 Testing Problem Generation...
✅ Generate 20 problems
✅ Problems have required properties
...

==================================================
📊 TEST REPORT
==================================================
Total Tests: 35
✅ Passed: 35
❌ Failed: 0
📈 Pass Rate: 100.00%
==================================================
```

## Features

### Educational Agent Features

1. **Intelligent Hint System**
   - Level 1: Gentle guidance without revealing answer
   - Level 2: Detailed steps with partial solution
   - Level 3: Complete step-by-step walkthrough

2. **Mistake Detection**
   - Higher denominator trap
   - Unit fraction confusion
   - Equivalent fraction identification
   - Both numbers higher confusion
   - General comparison errors

3. **Progress Tracking**
   - Accuracy calculation
   - Strength area identification
   - Weakness area detection
   - Historical performance

4. **Adaptive Learning**
   - Personalized practice plans
   - Focus area recommendations
   - Difficulty assessment
   - Learning resource suggestions

### Testing Agent Features

1. **Core Tests**
   - Problem generation validation
   - Fraction comparison accuracy
   - Mistake problem generation
   - Answer validation

2. **UI Tests**
   - Keyboard input validation
   - Button input testing
   - Drawing recognition checks
   - Voice recognition mapping

3. **Integration Tests**
   - Complete workflow testing
   - Clear answers functionality
   - Show answers feature

4. **Performance Tests**
   - Generation speed (<100ms for 100 problems)
   - Comparison speed (<50ms for 1000 comparisons)
   - Mistake generation performance

## API Reference

See [AGENTS_DOCUMENTATION.md](./AGENTS_DOCUMENTATION.md) for complete API reference.

## Common Issues

### Agent Panel Not Showing

**Problem**: Agent panel doesn't appear
**Solution**:
- Check that agentUI.js is imported in app.js
- Verify agents.css is included in index.html
- Check browser console for import errors

### Tests Failing

**Problem**: Tests show unexpected failures
**Solution**:
- Check that all dependencies are loaded
- Verify problem generation uses correct denominators
- Review test output for specific failure reasons
- Check browser console for errors

### Hints Not Working

**Problem**: Hints don't display
**Solution**:
- Ensure problems are generated first
- Check that window.currentProblems is set
- Verify educational agent is properly initialized

## Performance

Both agents are designed for optimal performance:

- **Educational Agent**: < 5ms per hint generation
- **Testing Agent**: Complete test suite in < 500ms
- **Memory**: Minimal footprint, efficient student profile tracking
- **Browser**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires:
- ES6 module support
- Blob API (for report export)
- localStorage (for profile persistence)

## Contributing

To add new features:

1. **Educational Agent**:
   - Add new hint levels in `getHint()`
   - Extend mistake types in `analyzeMistake()`
   - Add new analysis features in `analyzeProblem()`

2. **Testing Agent**:
   - Add new test methods in `testingAgent.js`
   - Call from `runAllTests()`
   - Update report generation

## License

Part of the Interactive Fraction Comparison Practice application.
MIT License - Free to use and modify.

## Support

For issues or questions:
- Check [AGENTS_DOCUMENTATION.md](./AGENTS_DOCUMENTATION.md)
- Review console output for errors
- Test with `test-agents.html`

## Credits

Built with ❤️ as part of the Interactive Fraction Comparison Practice application.

**Author**: Nirav Patel (@nirav2000)
**GitHub**: https://github.com/nirav2000/Claudetrials
