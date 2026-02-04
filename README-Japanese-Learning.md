# Japanese Learning App - Spaced Repetition

A comprehensive Japanese language learning application that uses spaced repetition to help you master Hiragana, Katakana, Kanji, common words, and sentences.

## Features

### Learning Modes
- **Hiragana**: Learn all 46 basic Hiragana characters
- **Katakana**: Learn all 46 basic Katakana characters
- **Kanji**: Study 50 most common Kanji characters (JLPT N5 level)
- **Words**: Practice 20 essential Japanese words
- **Sentences**: Master 10 common Japanese sentences

### Spaced Repetition System
- Implements the SM-2 (SuperMemo 2) algorithm for optimal learning
- Automatically schedules reviews based on your performance
- Three difficulty ratings: Hard, Good, Easy
- Cards are shown more frequently if you find them difficult
- Mastered cards appear less often

### Progress Tracking
- **Learned Count**: Total number of cards you've learned
- **Review Count**: Number of cards due for review today
- **Streak**: Consecutive days you've studied
- All progress is saved locally in your browser

### Frequency-Based Learning
- Characters, words, and sentences are ordered by frequency
- Start with the most commonly used items
- Build practical vocabulary from day one

## How to Use

1. **Select a Learning Mode**: Click one of the five mode buttons (Hiragana, Katakana, Kanji, Words, or Sentences)

2. **Study the Character**: A character/word/sentence will be displayed in large text

3. **Show Answer**: Click "Show Answer" to reveal:
   - Romaji (pronunciation)
   - English meaning
   - Example usage (for kanji, words, and sentences)

4. **Rate Your Knowledge**:
   - **Hard**: You struggled to remember - card will appear again soon
   - **Good**: You remembered with some effort - normal spacing
   - **Easy**: You knew it instantly - longer spacing before next review

5. **Complete Session**: Review all due cards for the session

6. **Return Daily**: Come back each day to review cards that are due

## Technology Stack

- **HTML5**: Structure and layout
- **CSS3**: Modern, responsive design with gradient backgrounds
- **Vanilla JavaScript**: No frameworks required
- **Local Storage**: Progress saved in browser

## Files

- `index.html` - Main application interface
- `styles.css` - Beautiful, responsive styling
- `data.js` - Complete Japanese character, word, and sentence data
- `app.js` - Spaced repetition algorithm and app logic

## Spaced Repetition Algorithm (SM-2)

The app uses the proven SM-2 algorithm:

1. **New cards**: Start with 1-day interval
2. **Second review**: 6-day interval if correct
3. **Subsequent reviews**: Interval multiplied by ease factor
4. **Ease factor**: Adjusts based on your ratings (1.3 to 2.5+)
5. **Failed cards**: Reset to 1-day interval

This ensures you review items just before you're about to forget them, maximizing retention while minimizing study time.

## Learning Path

### Recommended Order:
1. **Start with Hiragana** (most fundamental)
2. **Progress to Katakana** (used for foreign words)
3. **Learn Common Words** (practice reading)
4. **Study Basic Kanji** (essential characters)
5. **Master Sentences** (put it all together)

### Study Tips:
- Study daily for best results
- Maintain your streak for motivation
- Be honest with your ratings
- Review regularly, don't cram
- Practice writing characters separately

## Data Included

### Hiragana & Katakana
- All 46 basic characters
- Romaji pronunciation for each
- Ordered by usage frequency

### Kanji (50 most common)
- Essential JLPT N5 level characters
- Multiple readings (kun/on)
- Common word examples
- Frequency-ranked

### Words (20 essential)
- Common greetings and verbs
- Basic daily vocabulary
- Example sentences
- Practical phrases

### Sentences (10 common)
- Everyday conversational sentences
- Complete with romaji and translations
- Real-world usage examples

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Works offline after initial load
- Mobile-responsive design
- No installation required

## Privacy

- All data stored locally in your browser
- No server communication
- No tracking or analytics
- Your progress stays private

## Future Enhancements

Potential additions:
- Audio pronunciation
- Writing practice mode
- More Kanji (JLPT N4/N3)
- Grammar lessons
- Export/import progress
- Statistics dashboard
- Custom card creation

## License

This is an educational project. Feel free to use and modify for personal learning.

## Getting Started

Simply open `index.html` in your web browser and start learning!

---

**Study consistently, review regularly, and master Japanese! 🇯🇵**
