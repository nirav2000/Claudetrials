# Fraction Worksheet App - Features TODO

## High Priority Features

### 1. Conditional Visual Aids Display ⏳
**Status:** Planned
**Description:** Visual aids in Common Mistakes mode should only appear when:
- User answers incorrectly
- User takes too long (configurable timeout)
- User manually clicks the question number to request a hint

**Rationale:** Encourages students to attempt problems independently first, allowing us to identify where they struggle.

**Implementation Notes:**
- Add timer for each problem
- Track answer attempts
- Make question number clickable as hint button
- Add settings toggle to enable/disable time-based hints

---

### 2. Hint System with Pictorial Representation ⏳
**Status:** Not started
**Description:** Add hint button/system for regular (non-Common Mistakes) mode:
- Show pictorial representation when hint is requested
- Similar visual aids as Common Mistakes mode
- Available for all problems, not just targeted ones

**Rationale:** Provides on-demand help without reducing the learning challenge.

---

### 3. Dynamic Mistake Detection and Feedback 🤖
**Status:** Not started
**Description:** Real-time analysis of student answers:
- Detect common mistake patterns as worksheet is completed
- Show feedback explaining:
  - What mistake was made
  - Why that mistake might have occurred
  - Why it's incorrect
  - How to do it properly
- Suggest revisiting earlier questions with the same error pattern

**Rationale:** Provides immediate corrective feedback to prevent reinforcing incorrect patterns.

**Implementation Notes:**
- Requires answer tracking and pattern recognition
- Need to identify which error pattern was used (if any)
- Could use heuristics based on the fractions and incorrect answer given

---

### 4. Print Visual Aids Option 🖨️
**Status:** Planned
**Description:** Add checkbox to include visual aids when printing worksheets in Common Mistakes mode.

**Implementation Notes:**
- Add "Include Visual Aids in Print" checkbox
- Toggle visibility of visual aids for print media

---

### 5. Auto-Switch Input Method for Printing 🖨️
**Status:** Planned
**Description:** Automatically switch to keyboard input method when printing (to show answer boxes), then restore original method after printing.

**Implementation Notes:**
- Use beforeprint event to save current method and switch to keyboard
- Use afterprint event to restore original method

---

### 6. Selective Common Mistake Types 🎯
**Status:** Planned
**Description:** Allow users to select which specific common mistake patterns to include:
- Higher Denominator trap
- Both Numbers Higher trap
- Unit Fraction confusion
- Near-Whole comparison
- Equivalent Fractions

**Implementation Notes:**
- Add checkboxes for each mistake type
- Modify generateCommonMistakesProblems() to filter based on selection
- Default to all selected

---

## UI/UX Improvements

### 7. Collapsible "How to Use" Section ✅
**Status:** Planned
**Description:** Make "How to Use" section collapsible with default state collapsed.

**Rationale:** Reduces initial visual clutter for returning users.

---

### 8. Collapsible "Version History" Section ✅
**Status:** Planned
**Description:** Make "Version History" section collapsible.

**Rationale:** Reduces scroll length for users not interested in version details.

---

## Future Enhancements

### 9. Progress Tracking 📊
**Status:** Idea phase
**Description:** Track student progress over time:
- Save completion history
- Track accuracy by mistake type
- Show improvement over sessions

---

### 10. Adaptive Difficulty 🎓
**Status:** Idea phase
**Description:** Adjust problem difficulty based on student performance:
- Start with easier denominators
- Increase difficulty as accuracy improves
- Focus on areas of weakness

---

### 11. Multiple Choice Mode 🔘
**Status:** Idea phase
**Description:** Add multiple choice input option:
- Present 3-4 operator choices
- Include common wrong answers based on error patterns
- Good for touchscreen devices

---

### 12. Gamification Elements 🎮
**Status:** Idea phase
**Description:** Add game-like elements to increase engagement:
- Scoring system
- Badges/achievements
- Streak tracking
- Time challenges

---

### 13. Parent/Teacher Dashboard 👨‍🏫
**Status:** Idea phase
**Description:** Separate view for adults to:
- Review student progress
- Identify struggling areas
- Generate custom worksheets targeting weaknesses
- Export reports

---

### 14. Mobile-Optimized Layout 📱
**Status:** Idea phase
**Description:** Responsive design improvements for small screens:
- Single-column layout for mobile
- Touch-optimized buttons
- Simplified controls

---

### 15. Offline Support 💾
**Status:** Idea phase
**Description:** Make app work offline:
- Service worker implementation
- Local storage for progress
- PWA installation support

---

## Recently Completed ✅

### Common Mistakes Mode with Visual Aids (v1.4.4)
- ✅ Generates targeted problem sets for 5 common error patterns
- ✅ Pizza/circle diagrams for visual representation
- ✅ Explanations for each mistake type
- ✅ Side-by-side visual comparison

### Print Functionality Improvements (v1.4.1-1.4.3)
- ✅ Fixed print bug with beforeprint/afterprint events
- ✅ Proper header on first page with version
- ✅ Icon-only print/PDF buttons
- ✅ Learning Guide toggle for cleaner view

### Ease of Use Improvements (v1.4.3)
- ✅ Easier default denominators (2,4 instead of 12,20)
- ✅ Ordered denominators by difficulty with labels
- ✅ Material Design icons

### Version Management (v1.4.0)
- ✅ Working version switcher
- ✅ All versions saved as separate files
- ✅ Can switch between versions seamlessly

---

## Legend
- ⏳ Planned for next version
- 🤖 Requires AI/pattern recognition
- 🖨️ Print-related feature
- 🎯 Educational targeting
- ✅ Completed
- 📊 Analytics/tracking
- 🎓 Adaptive learning
- 🎮 Gamification
- 👨‍🏫 Teacher tools
- 📱 Mobile optimization
- 💾 Offline capability

---

Last Updated: 2026-01-22
Current Version: 1.4.4
