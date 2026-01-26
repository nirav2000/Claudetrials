# Fraction Worksheet Project Guidelines

## Project Overview
Interactive Fraction Comparison Worksheet Application - An educational tool for students (grades 3-8) to practice comparing fractions with multiple input methods and visual learning aids.

## Development Principles
- Keep explanations brief and focused on actionable information
- Prioritize code quality and maintainability over speed
- Test changes in browser before committing
- Always read this file before making changes to ensure consistency
- Keep context window manageable with small, focused files

## Code Standards

### File Size Requirements
- **Maximum 150-200 lines per file** (strict requirement)
- If a file exceeds 200 lines, split it into smaller modules
- Each file should have ONE clear responsibility
- Smaller files = easier debugging, clearer purpose, better maintainability

### Code Organization
- Use ES6 import/export syntax for all modules
- Group related features in subdirectories
- Main app.js should be minimal (50-100 lines) - just imports and initialization
- Use relative paths for all imports: `import { x } from './folder/module.js'`

### Naming Conventions
- Files: camelCase for JS (e.g., `problemGenerator.js`), kebab-case for CSS (e.g., `problem-grid.css`)
- Functions: camelCase with descriptive verbs (e.g., `generateProblems()`, `checkAnswers()`)
- Classes: PascalCase (e.g., `Carousel`, `VersionManager`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PROBLEMS`, `DEFAULT_INPUT_METHOD`)

### Documentation
- Include JSDoc comments for all exported functions
- Add brief comments explaining non-obvious logic
- Document function parameters and return values
- Include usage examples for complex functions

## CSS Organization

### Structure
- `css/layout/` - Structural layout files (header, main, footer, grid)
- `css/components/` - Reusable UI components (buttons, forms, modals, cards)
- `css/features/` - Feature-specific styling (problems, carousels, visual-aids)
- Maximum ~150 lines per CSS file

### Standards
- Use CSS custom properties for colors, spacing, and common values
- Follow mobile-first responsive design
- Use BEM-like naming for clarity (e.g., `.problem__fraction--incorrect`)
- Include media queries in the same file as the component
- Maintain accessibility with focus states and ARIA support

## JavaScript Organization

### Structure
- `js/core/` - Core utilities and configuration
  - `config.js` - App configuration and constants
  - `utils.js` - General utility functions
  - `domHelpers.js` - DOM manipulation helpers

- `js/features/` - Feature-specific modules
  - Each feature in its own file (e.g., `problemGenerator.js`, `inputMethods.js`)
  - Maximum ~200 lines per feature file

- `js/version/` - Version management system
  - `versionManager.js` - Core version logic
  - `versionUI.js` - UI for version display and changelog

### Standards
- Use ES6+ features (arrow functions, destructuring, template literals)
- Avoid global state - use module scope or state management pattern
- Export only what's needed - keep internals private
- Handle errors gracefully with try-catch and user feedback
- Use event delegation for dynamically created elements

## Version Control Rules

### Semantic Versioning (MAJOR.MINOR.PATCH)
- **MAJOR (X.0.0)**: Breaking changes, complete refactors, major architecture changes
- **MINOR (1.X.0)**: New features, significant enhancements
- **PATCH (1.0.X)**: Bug fixes, minor tweaks, documentation updates

### When to Create New Versions
**DO create new version for**:
- Intentional new features or functionality
- Completed enhancements
- Major refactors or architecture changes
- Significant UI/UX improvements

**DO NOT create new version for**:
- Bug fixes (fix in place, same version)
- Broken features (repair current version)
- Incomplete implementations
- Work in progress

### Bug Fix Protocol
When fixing bugs:
1. Identify the broken file(s)
2. Fix in place (keep same version number)
3. Test the fix thoroughly
4. Document the fix in code comments
5. Only create new version if fix introduces new functionality

### Version Archive Process
When creating a new version:
1. Copy ALL current files to `versions/archived/v[OLD_VERSION]/`
2. Create new markdown changelog in `versions/changelogs/v[NEW_VERSION].md`
3. Update `versions/version-manifest.json` with new entry
4. Increment version number following semantic versioning rules
5. Test to ensure archived version still works independently

## Feature-Specific Guidelines

### Input Methods
- Support 4 input methods: keyboard, buttons, drawing, voice
- Each method must work independently
- Provide clear visual feedback for user actions
- Handle edge cases (invalid input, recognition failures)
- Graceful degradation (e.g., voice not available in all browsers)

### Problem Generation
- Support multiple denominator sets
- Ensure variety in generated problems
- Common mistakes mode targets specific error patterns
- Problems should be educationally appropriate for grade level

### Visual Aids
- Pizza diagrams should be clear and accurate
- Display conditionally (wrong answer, timer expiration, on-demand)
- Ensure visual aids work in print mode
- SVG generation must be performant

### Carousel System
- Support touch/swipe, keyboard, and mouse navigation
- Provide clear navigation indicators
- Ensure accessibility with ARIA labels
- Smooth transitions between slides

### Print/Export
- Optimize for A4 layout (20 problems per page)
- Smart page break handling
- Optional visual aids in print
- PDF export via html2pdf.js library

### Accessibility
- Keyboard navigation for all interactive elements
- Proper ARIA labels and roles
- Focus indicators (2px solid outline)
- Support for reduced motion preferences
- Screen reader friendly content

## Custom Project Instructions

### Educational Content
- Keep language clear and age-appropriate (grades 3-8)
- Use engaging examples and visual aids
- Provide multiple learning strategies
- Address common misconceptions explicitly

### Design System
- **Primary Color**: Deep Purple (#6200EA)
- **Secondary Color**: Teal (#03DAC6)
- **Success**: Green (#4CAF50)
- **Error**: Red (#B00020)
- **Font**: Roboto from Google Fonts
- **Material Design**: Follow Material Design principles
- **Elevation**: Use 0-5 shadow levels

### Testing Checklist
Before committing changes, test:
- [ ] All 4 input methods work correctly
- [ ] Problem generation creates valid fractions
- [ ] Answer checking validates correctly
- [ ] Visual aids display properly
- [ ] Responsive design works (desktop, tablet, mobile)
- [ ] Print/PDF export functions correctly
- [ ] Version management system works
- [ ] No console errors
- [ ] Accessibility features work (keyboard nav, screen reader)

## Common Tasks

### Adding a New Feature
1. Plan the feature and identify affected files
2. Create new module file if needed (keep under 200 lines)
3. Write JSDoc comments for exported functions
4. Test feature thoroughly
5. Update relevant CSS files
6. Create new MINOR version
7. Document in changelog

### Fixing a Bug
1. Identify the bug and affected files
2. Fix in place (do not create new version)
3. Test fix thoroughly
4. Add comment explaining the fix
5. Commit with clear bug fix message

### Refactoring Code
1. Ensure tests pass before refactoring
2. Refactor incrementally
3. Test after each change
4. Keep same functionality (no behavior changes)
5. Document significant architectural changes
6. Create new MAJOR or MINOR version if appropriate

## Git Workflow

### Branch Strategy
- Main branch: Stable production-ready code
- Feature branches: Start with `claude/` prefix
- Use descriptive branch names (e.g., `claude/fraction-worksheet-refactor`)

### Commit Messages
- Use clear, descriptive commit messages
- Start with verb (Add, Fix, Refactor, Update, Remove)
- Reference version number when creating new version
- Examples:
  - "Add modular ES6 architecture for v2.0.0"
  - "Fix drawing recognition for multi-stroke inputs"
  - "Refactor problem generator into smaller modules"

### Before Pushing
- Run through testing checklist
- Verify no console errors
- Check that all files are under 200 lines
- Ensure version manifest is updated if new version
- Verify all imports/exports work correctly

## Maintenance Notes

### External Dependencies
- **html2pdf.js**: PDF generation (CDN)
- **marked.js**: Markdown to HTML conversion (CDN)
- **Google Fonts**: Roboto and Material Icons (CDN)
- Minimize external dependencies to maintain offline capability

### Browser Support
- Chrome/Edge: Full support (including voice recognition)
- Firefox: All features except voice recognition
- Safari: All features except voice recognition
- Mobile browsers: Touch-optimized interface

### Performance Considerations
- Keep problem generation under 100ms for 40 problems
- Canvas drawing recognition should feel instantaneous
- Lazy load educational content if needed
- Optimize SVG generation for visual aids
- Minimize reflows and repaints during rendering

## Questions or Issues?
If you encounter issues or need clarification:
1. Check this guidelines file first
2. Review existing code for patterns
3. Test in browser to verify behavior
4. Document any new patterns or decisions in this file
