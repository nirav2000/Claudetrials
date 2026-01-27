# AI Project Guide - Fraction Worksheet Application

**Project:** Interactive Fraction Comparison Practice Worksheet
**Repository:** nirav2000/Claudetrials
**Current Version:** 2.3.1
**Last Updated:** 2026-01-27

---

## 🎯 Project Purpose

This is an **educational web application** for teaching 9-year-olds fraction comparison. It's a single-page application with multiple input methods (keyboard, buttons, drawing, voice), visual aids, and comprehensive learning guides.

**Key Point:** This is NOT just a simple worksheet - it's a sophisticated educational platform with 2+ years of development and 30+ versions.

---

## 📁 Critical Architecture Understanding

### Two Parallel Structures

**IMPORTANT:** The project has TWO architectures:

1. **Modular Architecture (v2.x - CURRENT)**
   - Location: Root directory
   - Entry: `index.html`
   - CSS: Organized in `css/layout/`, `css/components/`, `css/features/`, `css/utilities/`
   - JS: ES6 modules in `js/core/`, `js/features/`, `js/utils/`
   - **This is what you should work on**

2. **Legacy Standalone Files (v1.x - ARCHIVED)**
   - Location: `fraction-worksheet-v1.x.x.html` files in root
   - Single-file HTML with embedded CSS and JS
   - Archived versions in `versions/archived/`
   - **DO NOT modify these**

### Version System Architecture

```
Claudetrials/
├── index.html                          # Current working version (modular)
├── version-system/                     # Auto-versioning system
│   ├── config.js                       # Version configuration (READ ONLY)
│   ├── ui/version-component.js         # Version display component
│   └── core/auto-versioner.js          # Automatic versioning (runs on commit)
├── versions/
│   ├── version-manifest.json           # Version registry (AUTO-UPDATED)
│   ├── changelogs/                     # Markdown changelogs for each version
│   │   ├── v2.3.1.md
│   │   ├── v2.3.0.md
│   │   └── ...
│   └── v2.3.1/                         # Snapshot of version 2.3.1
│       ├── index.html
│       ├── js/
│       ├── css/
│       └── README.md
├── js/                                 # Modular JavaScript (ES6)
├── css/                                # Modular CSS
├── templates/                          # Reusable templates (NEW!)
└── FIXES_AND_IMPROVEMENTS.md           # Recent changes summary
```

---

## 🚨 CRITICAL RULES - READ FIRST

### 1. Version System is Automatic
- **DO NOT manually edit `version-system/config.js`**
- **DO NOT manually edit `versions/version-manifest.json`**
- The auto-versioner runs on git commit via hooks
- It reads your commit message and auto-increments version
- It creates snapshots in `versions/v{VERSION}/`
- It generates changelogs automatically

### 2. Git Workflow
**Branch:** `claude/fraction-worksheet-app-dg98y`
- ALL work must be on this branch
- Commit message format determines version bump:
  - `feat:` → Minor version bump (2.3.0 → 2.4.0)
  - `fix:` → Patch version bump (2.3.0 → 2.3.1)
  - `refactor:` → Patch version bump
  - `docs:` → Patch version bump
  - BREAKING CHANGE in footer → Major version bump (2.3.0 → 3.0.0)

**Push command:**
```bash
git push -u origin claude/fraction-worksheet-app-dg98y
```

**IMPORTANT:** Push WILL fail if branch doesn't start with 'claude/' and end with the session ID. The current branch is correct.

### 3. DO NOT Create/Modify These Files
- `version-system/config.js` (auto-updated)
- `versions/version-manifest.json` (auto-updated)
- Any file in `versions/v{VERSION}/` (snapshots, read-only)
- Legacy `fraction-worksheet-v1.x.x.html` files

### 4. DO Modify When Needed
- `index.html` (main application)
- Files in `js/` directory
- Files in `css/` directory
- Changelogs in `versions/changelogs/` (for formatting improvements)
- Documentation files (README.md, TODO.md, etc.)

---

## 📦 Modular Architecture (v2.x)

### CSS Organization

```
css/
├── layout/
│   ├── base.css              # Global styles, CSS variables, resets
│   ├── header.css            # Header and title
│   └── main-container.css    # Main container and sections
├── components/
│   ├── buttons.css           # All button styles
│   ├── forms.css             # Form controls and inputs
│   ├── modals.css            # Modal dialogs
│   └── cards.css             # Card components, boxes, collapsibles
├── features/
│   ├── problem-grid.css      # Problem display grid
│   ├── input-methods.css     # Input method controls
│   ├── visual-aids.css       # Visual aids and hints
│   ├── carousel.css          # Carousel UI
│   └── educational-content.css  # Learning guide styles
└── utilities/
    └── utilities.css         # NEW! Common utility classes
```

**CSS Variables (defined in base.css):**
```css
--md-primary: #6200EA;        /* Purple */
--md-secondary: #03DAC6;      /* Teal */
--md-success: #4CAF50;        /* Green */
--md-danger: #F44336;         /* Red */
--md-warning: #FF9800;        /* Orange */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--transition-fast, --transition-normal
```

**Import Order in index.html:**
1. Layout CSS (base, header, main-container)
2. Utilities CSS (NEW - added in v2.3.1)
3. Components CSS
4. Features CSS

### JavaScript Organization

```
js/
├── app.js                    # Main entry point, initialization
├── core/
│   ├── config.js             # Application configuration
│   ├── utils.js              # Utility functions
│   └── domHelpers.js         # DOM manipulation helpers (qs, qsa, addClass, removeClass)
├── features/
│   ├── problemGenerator.js   # Fraction problem generation
│   ├── inputMethods.js       # Keyboard, buttons, drawing, voice
│   ├── checkAnswers.js       # Answer validation and scoring
│   ├── visualAids.js         # Hint system and visual representations
│   ├── carousel.js           # Carousel functionality
│   ├── educationalContent.js # Learning guide data
│   ├── educationalVisuals.js # Visual generation for learning guide
│   ├── printExport.js        # Print and PDF export
│   ├── drawingRecognition.js # Canvas drawing recognition
│   └── voiceRecognition.js   # Voice input (Chrome/Edge only)
└── utils/
    └── circleChart.js        # SVG circle/pie chart generation
```

**Module Pattern:**
- All JS files are ES6 modules
- Use `import`/`export` syntax
- Common imports from `domHelpers.js`: `qs, qsa, addClass, removeClass, setText, getValue`
- NO jQuery or other libraries

---

## 🎨 Recent Major Changes (v2.3.1)

### 1. Utilities CSS System (NEW!)
**File:** `css/utilities/utilities.css`

Created 100+ utility classes to reduce duplication:
- Shadow utilities: `.shadow-sm`, `.shadow-md`, `.shadow-lg`
- Box utilities: `.box-primary`, `.box-success`, `.box-warning`
- Transition utilities: `.transition-fast`, `.transition-normal`
- Focus utilities: `.focus-primary`
- Display utilities: `.hidden-default`, `.show`
- And many more (see file for full list)

**Usage:**
```html
<!-- Instead of inline styles or custom CSS -->
<div class="box-primary shadow-md transition-normal">
```

### 2. Educational Content Templates (NEW!)
**Directory:** `templates/educational-content/`

Modular HTML templates for creating learning guides for ANY math topic:
- `topic-introduction.html` - What are fractions?
- `history-carousel.html` - Historical context
- `strategies-carousel.html` - Learning strategies
- `misconceptions-carousel.html` - Common mistakes
- `step-by-step-guide.html` - Procedural instructions
- `real-world-examples.html` - Practical applications
- `why-it-matters.html` - Importance and relevance
- `full-learning-guide-template.html` - Complete guide
- `README.md` - Usage documentation

**Purpose:** Enable rapid creation of worksheets for addition, multiplication, division, etc.

**How to Use:**
1. Copy template files
2. Replace `{{TOPIC_NAME}}`, `{{TOPIC_LOWERCASE}}`, etc.
3. Customize visual aids and examples
4. Integrate into new worksheet HTML

### 3. Fixed Issues
- Removed duplicate `addClass`/`removeClass` functions in `checkAnswers.js`
- Removed duplicate "Why Fractions Matter" section in `index.html`
- Enhanced changelog formatting in `versions/changelogs/v2.3.0.md`

---

## 🎓 Educational Content System

### Carousel System
The app uses **tabbed carousels** for educational content:
- History of Fractions (4 tabs: Ancient Egypt, Ancient Rome, Medieval, Modern)
- Comparison Strategies (6 strategies)
- Common Misconceptions (5 misconceptions)

**How it Works:**
1. Content defined in `js/features/educationalContent.js`
2. Carousel UI in HTML with class `carousel-container`
3. Initialized by `js/features/carousel.js`
4. Styles in `css/features/carousel.css`

### Visual Aids System
**Dynamic SVG Generation:**
- Circle/pie charts generated by `js/utils/circleChart.js`
- Called by `js/features/educationalVisuals.js`
- Used throughout learning guide for visual fraction representations

**Key Function:**
```javascript
createFractionCircle(numerator, denominator, options)
```

---

## 🔧 Common Development Tasks

### Adding a New Feature
1. Create new JS module in `js/features/` if needed
2. Create new CSS file in `css/features/` if needed
3. Import CSS in `index.html` (after utilities, before closing head)
4. Import/initialize JS in `js/app.js`
5. Test thoroughly
6. Commit with appropriate prefix (`feat:`, `fix:`, etc.)

### Modifying Existing Code

**IMPORTANT PATTERNS TO FOLLOW:**

1. **Use imported utilities, don't redefine:**
```javascript
// GOOD
import { addClass, removeClass } from '../core/domHelpers.js';
addClass(element, 'active');

// BAD - Don't shadow imports
const addClass = (el, cls) => { ... };  // NO!
```

2. **Use utility CSS classes:**
```html
<!-- GOOD -->
<div class="box-primary shadow-md">

<!-- AVOID -->
<div style="background: #E8EAF6; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
```

3. **Follow established patterns:**
- Look at similar existing code
- Use the same function names and patterns
- Maintain consistent indentation (4 spaces)

### Updating Changelogs

**Location:** `versions/changelogs/vX.X.X.md`

**Format (v2.x style):**
```markdown
# Version X.X.X - Short Title

**Date:** 2026-01-27
**Type:** Minor Release | Patch Release | Major Release

## Summary

1-2 paragraph description of the changes.

## Features

### Feature Category
- 🎯 Bullet point with emoji
- Feature description
- User-facing benefit

### User Benefits
- Why this matters
- What users gain

## Technical Details

- Implementation notes
- Architecture changes
- Performance improvements

## Future Plans

- Potential enhancements
- Ideas for future versions
```

**Use emojis liberally** - v1.4.x style had great emoji usage, v2.3.0 was too sparse initially (now fixed).

---

## 🧪 Testing Checklist

Before committing major changes:

1. **Functionality:**
   - [ ] Generate problems works
   - [ ] All 4 input methods work (keyboard, buttons, drawing, voice)
   - [ ] Check answers validates correctly
   - [ ] Visual aids display properly
   - [ ] Carousels navigate correctly

2. **Visual/CSS:**
   - [ ] No layout breaks
   - [ ] Print preview looks good
   - [ ] Mobile responsive (768px breakpoint)
   - [ ] All utility classes work

3. **JavaScript:**
   - [ ] No console errors
   - [ ] All imports resolve
   - [ ] Event listeners work
   - [ ] No duplicate function definitions

4. **Version System:**
   - [ ] Commit message follows convention
   - [ ] Auto-versioner runs successfully
   - [ ] New version snapshot created
   - [ ] Changelog generated

---

## 🚫 Common Pitfalls to Avoid

### 1. Don't Edit Archived Versions
Files in `versions/v{VERSION}/` are **snapshots**, not working files. They're created automatically and should never be manually edited.

### 2. Don't Shadow Imported Functions
```javascript
// This was a bug in checkAnswers.js (now fixed)
import { addClass } from '../core/domHelpers.js';

function foo() {
    const addClass = (el, cls) => { ... };  // BAD! Shadows import
    addClass(element, 'class');
}
```

### 3. Don't Duplicate CSS
Before writing new CSS:
1. Check if utility class exists in `css/utilities/utilities.css`
2. Check if similar style exists in component CSS
3. Consider if it should be a utility class instead

### 4. Don't Commit Without Testing
The auto-versioner will create a new version on every commit. Make sure your code works before committing.

### 5. Don't Modify version-system/config.js Manually
The auto-versioner updates this file. Manual edits will be overwritten.

### 6. Don't Create Duplicate Content
- Check for existing content before adding new sections
- Search the codebase first (`grep` or `Grep` tool)
- Recent fix: Removed duplicate "Why Fractions Matter" section

---

## 📚 Key Files Reference

### Must-Read Files
1. **README.md** - Complete feature list and project overview
2. **FEATURES_TODO.md** - Feature roadmap and progress
3. **FIXES_AND_IMPROVEMENTS.md** - Recent changes summary (v2.3.1)
4. **project-guidelines.md** - Development standards
5. **AI_PROJECT_GUIDE.md** - This file

### Configuration Files
- `version-system/config.js` - Current version (auto-updated)
- `versions/version-manifest.json` - Version registry (auto-updated)
- `js/core/config.js` - Application configuration

### Main Application Files
- `index.html` - Entry point
- `js/app.js` - Initialization
- `js/features/problemGenerator.js` - Core logic

---

## 🎯 Feature Highlights

### Input Methods (4 modes)
1. **Keyboard:** Type <, >, = directly
2. **Buttons:** Click symbol buttons
3. **Drawing:** Draw on canvas (ML recognition)
4. **Voice:** Speech recognition (Chrome/Edge only)

### Visual Aids
- Automatic hints after configurable timeout
- Click problem numbers to reveal hints
- Pizza/circle diagrams for visualization
- Decimal equivalents for comparison

### Educational Content
- Comprehensive learning guide with 3 carousels
- Real-world examples (pizza, cooking, time, money, sports)
- Historical context (Ancient Egypt to Modern times)
- Common misconceptions with explanations

### Print/Export
- Print with optional learning guide and visual aids
- PDF export via html2pdf.js
- Clean print styles (no interactive elements)

### Common Mistakes Mode
Target specific error patterns:
- Higher denominator trap
- Both numbers higher confusion
- Unit fraction confusion
- Near-whole comparison
- Equivalent fractions

---

## 🔍 Debugging Tips

### Common Issues

1. **Module not loading:**
   - Check import path is correct
   - Verify file exists
   - Check for typos in filename
   - Ensure browser supports ES6 modules

2. **CSS not applying:**
   - Check specificity
   - Verify CSS file is imported in index.html
   - Check for typos in class names
   - Inspect element in DevTools

3. **Function not defined:**
   - Check if imported correctly
   - Verify export in source file
   - Look for shadowing (local function overriding import)

4. **Version system not running:**
   - Check git hooks are installed
   - Verify commit message format
   - Check auto-versioner.js for errors

### DevTools Console
The app logs important events. Check console for:
- Initialization messages
- Module loading
- Event listeners attached
- Errors and warnings

---

## 🤖 AI-Specific Guidance

### When Starting a New Session

1. **Read this file first** - All critical info is here
2. **Check recent commits** - `git log --oneline -10`
3. **Read FIXES_AND_IMPROVEMENTS.md** - Recent changes context
4. **Review open issues** - Check TODO.md and FEATURES_TODO.md
5. **Understand the version system** - It's automatic, don't fight it

### Before Making Changes

1. **Search for duplicates** - Use `Grep` tool extensively
2. **Check templates** - New templates system might already have what you need
3. **Review similar code** - Look at patterns in existing features
4. **Consider utilities** - Can you use a utility class instead of new CSS?

### Making Commits

```bash
# Good commit messages
git commit -m "feat: Add multiplication worksheet template"
git commit -m "fix: Correct circle chart rendering for denominators > 12"
git commit -m "refactor: Consolidate duplicate box-shadow styles"
git commit -m "docs: Update AI guide with new patterns"

# Push to the correct branch
git push -u origin claude/fraction-worksheet-app-dg98y
```

### Asking User Questions

Use `AskUserQuestion` tool when:
- Unclear about feature scope
- Multiple implementation approaches available
- Design decisions needed
- Potentially breaking changes

### Task Management

Use `TodoWrite` for:
- Complex multi-step tasks (3+ steps)
- Non-trivial operations
- User provides multiple tasks
- Tracking progress over time

**Don't use TodoWrite for:**
- Single simple tasks
- Trivial operations
- Quick fixes

---

## 📊 Project Stats (as of v2.3.1)

- **Total Versions:** 33 (v1.0.0 to v2.3.1)
- **Architecture:** Modular ES6 (v2.x)
- **Lines of Code:** ~6,850 (in main application)
- **CSS Files:** 14 files (organized by purpose)
- **JS Modules:** 16 files (ES6 modules)
- **Features:** 10+ major features
- **Input Methods:** 4 modes
- **Educational Content:** 15+ sections
- **Template Files:** 9 reusable templates

---

## 🎬 Quick Start for New Sessions

```bash
# 1. Check current state
git status
git log --oneline -5

# 2. Read key files
# - AI_PROJECT_GUIDE.md (this file)
# - FIXES_AND_IMPROVEMENTS.md
# - TODO.md or FEATURES_TODO.md

# 3. Understand current version
cat version-system/config.js

# 4. Review recent changelog
cat versions/changelogs/v2.3.1.md

# 5. Ready to code!
```

---

## 💡 Pro Tips

1. **Search before creating** - The codebase is mature, similar patterns likely exist
2. **Use utilities liberally** - The new utilities.css has 100+ classes ready to use
3. **Template first** - Check templates/ directory for reusable components
4. **Commit often** - Auto-versioner makes it safe
5. **Test on mobile** - Responsive design is important (768px breakpoint)
6. **Check print preview** - Print functionality is heavily used
7. **Emojis in changelogs** - Users like them, use them generously
8. **ES6 all the way** - No var, use const/let, arrow functions, modules
9. **CSS organization matters** - Keep files focused and organized
10. **Version system is your friend** - Don't fear it, embrace it

---

## 🆘 Emergency Procedures

### If Version System Breaks
1. Check `git log` for what happened
2. Review auto-versioner output
3. Manual fix if needed:
   - Edit `version-system/config.js`
   - Edit `versions/version-manifest.json`
   - Create missing changelog manually
4. Commit with `docs:` prefix to avoid another version bump

### If Push Fails
- Verify branch name: `claude/fraction-worksheet-app-dg98y`
- Check network: `git fetch origin`
- Retry with exponential backoff (2s, 4s, 8s, 16s)
- Max 4 retries

### If CSS Breaks
1. Check utility imports in index.html
2. Verify CSS file paths
3. Check for duplicate selectors
4. Inspect element specificity in DevTools
5. Review recent changes: `git diff HEAD~1`

### If JS Breaks
1. Check console for errors
2. Verify all imports resolve
3. Check for shadowed functions
4. Review module initialization in app.js
5. Test with simple console.log statements

---

## 📝 Final Notes

This is a **well-architected, mature project** with:
- Comprehensive educational content
- Multiple input methods
- Advanced version management
- Modular architecture
- Extensive documentation

**Treat it with respect:**
- Don't rush changes
- Test thoroughly
- Follow established patterns
- Read existing code before modifying
- Keep documentation updated

**You are working on an educational tool** that helps children learn. Quality matters. Take your time, do it right.

---

**Last Updated:** 2026-01-27
**For:** Future AI sessions working on Claudetrials project
**By:** AI Agent (Session: claude/fraction-worksheet-app-dg98y)

**Good luck! You've got all the info you need. Now go build something amazing!** 🚀
