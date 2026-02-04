// Japanese Learning App with Spaced Repetition
// SM-2 Algorithm Implementation

class SpacedRepetitionApp {
    constructor() {
        this.currentMode = null;
        this.currentData = [];
        this.reviewQueue = [];
        this.currentCard = null;
        this.currentIndex = 0;
        this.sessionCards = [];

        // Local storage keys
        this.STORAGE_KEY = 'japaneseLearningSRS';

        // Load saved progress
        this.loadProgress();

        // Initialize UI
        this.initializeUI();
    }

    initializeUI() {
        // Mode selection buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMode(e.target.dataset.mode);
            });
        });

        // Show answer button
        document.getElementById('showAnswerBtn').addEventListener('click', () => {
            this.showAnswer();
        });

        // Rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.rateCard(rating);
            });
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.selectMode(this.currentMode);
        });

        // View Chart button
        document.getElementById('viewChartBtn').addEventListener('click', () => {
            this.showReferenceChart();
        });

        // Close Chart button
        document.getElementById('closeChartBtn').addEventListener('click', () => {
            this.closeReferenceChart();
        });

        // View Progress button
        document.getElementById('viewProgressBtn').addEventListener('click', () => {
            this.showProgressScreen();
        });

        // Close Progress button
        document.getElementById('closeProgressBtn').addEventListener('click', () => {
            this.closeProgressScreen();
        });

        // Update stats display
        this.updateStats();
    }

    selectMode(mode) {
        // Remove active class from all buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const selectedBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        this.currentMode = mode;
        this.currentData = japaneseData[mode] || [];

        // Get due cards or new cards
        this.sessionCards = this.getSessionCards();
        this.currentIndex = 0;

        // Show learning area, hide other screens
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'none';
        document.getElementById('referenceChart').style.display = 'none';
        document.getElementById('learningArea').style.display = 'block';

        // Start the session
        this.showNextCard();
    }

    getSessionCards() {
        const cards = [];
        const now = Date.now();

        // Get cards that are due for review
        this.currentData.forEach((item, index) => {
            const cardId = `${this.currentMode}-${index}`;
            const cardData = this.progress[cardId];

            if (!cardData) {
                // New card
                if (cards.length < 10) {
                    cards.push({
                        ...item,
                        id: cardId,
                        isNew: true
                    });
                }
            } else if (cardData.nextReview <= now) {
                // Due for review
                cards.push({
                    ...item,
                    id: cardId,
                    isNew: false,
                    ...cardData
                });
            }
        });

        // If no cards available, add some new ones
        if (cards.length === 0) {
            for (let i = 0; i < Math.min(10, this.currentData.length); i++) {
                const item = this.currentData[i];
                const cardId = `${this.currentMode}-${i}`;
                if (!this.progress[cardId]) {
                    cards.push({
                        ...item,
                        id: cardId,
                        isNew: true
                    });
                }
            }
        }

        // Sort by frequency (lower frequency number = more common)
        return cards.sort((a, b) => a.frequency - b.frequency);
    }

    showNextCard() {
        if (this.currentIndex >= this.sessionCards.length) {
            this.showCompletion();
            return;
        }

        this.currentCard = this.sessionCards[this.currentIndex];

        // Update character display with individual character hover
        const charDisplay = document.getElementById('characterDisplay');
        charDisplay.innerHTML = ''; // Clear previous content

        // For words and sentences, create hoverable individual characters
        if (this.currentMode === 'words' || this.currentMode === 'sentences') {
            const chars = this.currentCard.char.split('');
            chars.forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'hoverable-char';
                const romaji = charToRomaji[char] || char;
                span.setAttribute('data-char-romaji', romaji);
                charDisplay.appendChild(span);
            });
        } else {
            // For single characters (hiragana, katakana, kanji), show normally
            charDisplay.textContent = this.currentCard.char;
            charDisplay.setAttribute('data-romaji', this.currentCard.romaji);
        }

        document.getElementById('hint').style.display = 'none';
        document.getElementById('answerSection').style.display = 'none';
        document.getElementById('showAnswerBtn').style.display = 'block';

        // Track start time for statistics
        this.cardStartTime = Date.now();

        // Update progress bar
        const progress = (this.currentIndex / this.sessionCards.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `${this.currentIndex} / ${this.sessionCards.length}`;
    }

    showAnswer() {
        document.getElementById('showAnswerBtn').style.display = 'none';
        document.getElementById('answerSection').style.display = 'block';

        // Display answer information
        document.getElementById('romaji').textContent = this.currentCard.romaji;
        document.getElementById('meaning').textContent = this.currentCard.meaning;

        if (this.currentCard.example) {
            document.getElementById('example').textContent = this.currentCard.example;
            document.getElementById('example').style.display = 'block';
        } else {
            document.getElementById('example').style.display = 'none';
        }
    }

    rateCard(rating) {
        // Calculate study time for this card
        const studyTime = this.cardStartTime ? (Date.now() - this.cardStartTime) / 1000 : 0;

        // Update card using SM-2 algorithm
        const cardId = this.currentCard.id;
        const cardData = this.progress[cardId] || {
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReview: Date.now(),
            mistakes: 0,
            studyTime: 0
        };

        // SM-2 Algorithm
        let { easeFactor, interval, repetitions, mistakes, studyTime: totalStudyTime } = cardData;

        if (rating >= 3) {
            // Correct response
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        } else {
            // Incorrect response
            mistakes = (mistakes || 0) + 1;
            repetitions = 0;
            interval = 1;
        }

        // Update ease factor
        easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor

        // Calculate next review time
        const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

        // Save progress
        this.progress[cardId] = {
            easeFactor,
            interval,
            repetitions,
            nextReview,
            lastReview: Date.now(),
            mistakes,
            studyTime: (totalStudyTime || 0) + studyTime
        };

        this.saveProgress();
        this.updateStats();

        // Move to next card
        this.currentIndex++;
        this.showNextCard();
    }

    showCompletion() {
        document.getElementById('learningArea').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'block';

        const message = `Great job! You reviewed ${this.sessionCards.length} ${this.currentMode} cards. Keep up the good work!`;
        document.getElementById('completionMessage').textContent = message;

        this.updateStats();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            this.progress = data.progress || {};
            this.streak = data.streak || 0;
            this.lastStudyDate = data.lastStudyDate || null;
        } else {
            this.progress = {};
            this.streak = 0;
            this.lastStudyDate = null;
        }

        // Update streak
        this.updateStreak();
    }

    saveProgress() {
        const data = {
            progress: this.progress,
            streak: this.streak,
            lastStudyDate: this.lastStudyDate
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.lastStudyDate ? new Date(this.lastStudyDate).toDateString() : null;

        if (lastDate !== today) {
            if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
                // Studied yesterday, increment streak
                this.streak++;
            } else if (lastDate !== today) {
                // Missed a day, reset streak
                this.streak = 1;
            }
            this.lastStudyDate = Date.now();
            this.saveProgress();
        }
    }

    updateStats() {
        // Count learned cards (cards with repetitions > 0)
        let learnedCount = 0;
        let reviewCount = 0;
        const now = Date.now();

        Object.keys(this.progress).forEach(key => {
            const card = this.progress[key];
            if (card.repetitions > 0) {
                learnedCount++;
            }
            if (card.nextReview <= now) {
                reviewCount++;
            }
        });

        document.getElementById('learnedCount').textContent = learnedCount;
        document.getElementById('reviewCount').textContent = reviewCount;
        document.getElementById('streakCount').textContent = this.streak;
    }

    showReferenceChart() {
        // Determine which data to show
        let title = 'Reference Chart';

        if (this.currentMode && japaneseData[this.currentMode]) {
            title = `${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)} Reference Chart`;
        } else {
            title = 'Choose a learning mode to see its reference chart';
        }

        // Update title
        document.getElementById('chartTitle').textContent = title;

        // Clear previous chart
        const chartGrid = document.getElementById('chartGrid');
        chartGrid.innerHTML = '';

        // Different layouts based on mode
        if (this.currentMode === 'hiragana' || this.currentMode === 'katakana') {
            this.renderKanaChart(chartGrid, this.currentMode);
        } else if (this.currentMode === 'kanji' || this.currentMode === 'words' || this.currentMode === 'sentences') {
            this.renderListChart(chartGrid);
        }

        // Hide other screens, show chart
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('learningArea').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'none';
        document.getElementById('referenceChart').style.display = 'block';
    }

    renderKanaChart(container, mode) {
        // Traditional kana chart layout
        const kanaChart = mode === 'hiragana' ? [
            ['あ', 'い', 'う', 'え', 'お'],
            ['か', 'き', 'く', 'け', 'こ'],
            ['さ', 'し', 'す', 'せ', 'そ'],
            ['た', 'ち', 'つ', 'て', 'と'],
            ['な', 'に', 'ぬ', 'ね', 'の'],
            ['は', 'ひ', 'ふ', 'へ', 'ほ'],
            ['ま', 'み', 'む', 'め', 'も'],
            ['や', '', 'ゆ', '', 'よ'],
            ['ら', 'り', 'る', 'れ', 'ろ'],
            ['わ', '', '', '', 'を'],
            ['ん', '', '', '', '']
        ] : [
            ['ア', 'イ', 'ウ', 'エ', 'オ'],
            ['カ', 'キ', 'ク', 'ケ', 'コ'],
            ['サ', 'シ', 'ス', 'セ', 'ソ'],
            ['タ', 'チ', 'ツ', 'テ', 'ト'],
            ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
            ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
            ['マ', 'ミ', 'ム', 'メ', 'モ'],
            ['ヤ', '', 'ユ', '', 'ヨ'],
            ['ラ', 'リ', 'ル', 'レ', 'ロ'],
            ['ワ', '', '', '', 'ヲ'],
            ['ン', '', '', '', '']
        ];

        // Add vowel headers
        const headerRow = document.createElement('div');
        headerRow.className = 'chart-header-row';
        ['', 'A', 'I', 'U', 'E', 'O'].forEach(vowel => {
            const header = document.createElement('div');
            header.className = 'chart-header';
            header.textContent = vowel;
            headerRow.appendChild(header);
        });
        container.appendChild(headerRow);

        // Add consonant rows
        const consonants = ['', 'K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N'];
        kanaChart.forEach((row, index) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'chart-row';

            // Add consonant label
            const consonantLabel = document.createElement('div');
            consonantLabel.className = 'chart-consonant';
            consonantLabel.textContent = consonants[index];
            rowDiv.appendChild(consonantLabel);

            row.forEach(char => {
                const cell = document.createElement('div');
                cell.className = 'chart-cell';
                if (char) {
                    const charDiv = document.createElement('div');
                    charDiv.className = 'chart-character';
                    charDiv.textContent = char;

                    const romajiDiv = document.createElement('div');
                    romajiDiv.className = 'chart-romaji';
                    romajiDiv.textContent = charToRomaji[char] || '';

                    cell.appendChild(charDiv);
                    cell.appendChild(romajiDiv);
                }
                rowDiv.appendChild(cell);
            });
            container.appendChild(rowDiv);
        });
    }

    renderListChart(container) {
        const chartData = japaneseData[this.currentMode] || [];

        chartData.forEach(item => {
            const chartItem = document.createElement('div');
            chartItem.className = 'chart-list-item';

            const character = document.createElement('div');
            character.className = 'chart-list-character';
            character.textContent = item.char;

            const details = document.createElement('div');
            details.className = 'chart-list-details';

            const romaji = document.createElement('div');
            romaji.className = 'chart-list-romaji';
            romaji.textContent = item.romaji;

            const meaning = document.createElement('div');
            meaning.className = 'chart-list-meaning';
            meaning.textContent = item.meaning;

            details.appendChild(romaji);
            details.appendChild(meaning);

            chartItem.appendChild(character);
            chartItem.appendChild(details);

            container.appendChild(chartItem);
        });
    }

    closeReferenceChart() {
        document.getElementById('referenceChart').style.display = 'none';

        // Show appropriate screen based on state
        if (this.currentMode && this.sessionCards.length > 0 && this.currentIndex < this.sessionCards.length) {
            document.getElementById('learningArea').style.display = 'block';
        } else if (this.currentMode && this.currentIndex >= this.sessionCards.length) {
            document.getElementById('completionScreen').style.display = 'block';
        } else {
            document.getElementById('welcomeScreen').style.display = 'block';
        }
    }

    showProgressScreen() {
        const now = Date.now();

        // Calculate total learned
        let totalLearned = 0;
        let totalStudyTime = 0;
        const modeStats = {
            hiragana: { learned: 0, total: japaneseData.hiragana.length },
            katakana: { learned: 0, total: japaneseData.katakana.length },
            kanji: { learned: 0, total: japaneseData.kanji.length },
            words: { learned: 0, total: japaneseData.words.length },
            sentences: { learned: 0, total: japaneseData.sentences.length }
        };
        const upcomingCards = [];
        const mistakeCards = [];

        Object.keys(this.progress).forEach(key => {
            const card = this.progress[key];
            const [mode, index] = key.split('-');

            if (card.repetitions > 0) {
                totalLearned++;
                if (modeStats[mode]) {
                    modeStats[mode].learned++;
                }
            }

            if (card.studyTime) {
                totalStudyTime += card.studyTime;
            }

            // Cards due soon
            if (card.nextReview && card.nextReview <= now + 24 * 60 * 60 * 1000) {
                const modeData = japaneseData[mode];
                if (modeData && modeData[parseInt(index)]) {
                    upcomingCards.push({
                        ...modeData[parseInt(index)],
                        mode,
                        nextReview: card.nextReview
                    });
                }
            }

            // Cards with mistakes (low repetitions or short intervals)
            if (card.repetitions < 3 && card.lastReview) {
                const modeData = japaneseData[mode];
                if (modeData && modeData[parseInt(index)]) {
                    mistakeCards.push({
                        ...modeData[parseInt(index)],
                        mode,
                        mistakes: card.mistakes || 0
                    });
                }
            }
        });

        // Update progress summary
        document.getElementById('progressTotalLearned').textContent = totalLearned;
        document.getElementById('progressStreak').textContent = `${this.streak} days`;
        document.getElementById('progressStudyTime').textContent = `${Math.round(totalStudyTime / 60)} min`;

        // Populate mode progress
        const modesList = document.getElementById('progressModesList');
        modesList.innerHTML = '';
        Object.keys(modeStats).forEach(mode => {
            const stats = modeStats[mode];
            const percentage = stats.total > 0 ? (stats.learned / stats.total * 100) : 0;

            const modeItem = document.createElement('div');
            modeItem.className = 'progress-mode-item';
            modeItem.innerHTML = `
                <div>
                    <div class="progress-mode-name">${mode.charAt(0).toUpperCase() + mode.slice(1)}</div>
                    <div class="progress-mode-stats">${stats.learned} / ${stats.total} learned (${Math.round(percentage)}%)</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
            modesList.appendChild(modeItem);
        });

        // Populate upcoming reviews
        const upcomingList = document.getElementById('progressUpcoming');
        upcomingList.innerHTML = '';
        const sortedUpcoming = upcomingCards.sort((a, b) => a.nextReview - b.nextReview).slice(0, 10);
        if (sortedUpcoming.length === 0) {
            upcomingList.innerHTML = '<p style="color: #888; text-align: center;">No cards due for review</p>';
        } else {
            sortedUpcoming.forEach(card => {
                const timeUntil = this.formatTimeUntil(card.nextReview - now);
                const upcomingItem = document.createElement('div');
                upcomingItem.className = 'progress-upcoming-item';
                upcomingItem.innerHTML = `
                    <div class="progress-upcoming-char">${card.char} - ${card.romaji}</div>
                    <div class="progress-upcoming-time">Due in ${timeUntil}</div>
                `;
                upcomingList.appendChild(upcomingItem);
            });
        }

        // Populate mistake cards
        const mistakesList = document.getElementById('progressMistakes');
        mistakesList.innerHTML = '';
        const sortedMistakes = mistakeCards.sort((a, b) => (b.mistakes || 0) - (a.mistakes || 0)).slice(0, 10);
        if (sortedMistakes.length === 0) {
            mistakesList.innerHTML = '<p style="color: #888; text-align: center;">No cards needing practice</p>';
        } else {
            sortedMistakes.forEach(card => {
                const mistakeItem = document.createElement('div');
                mistakeItem.className = 'progress-mistake-item';
                mistakeItem.innerHTML = `
                    <div class="progress-mistake-char">${card.char} - ${card.romaji}</div>
                    <div class="progress-mistake-count">${card.mistakes || 0} mistakes</div>
                `;
                mistakesList.appendChild(mistakeItem);
            });
        }

        // Hide other screens, show progress
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('learningArea').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'none';
        document.getElementById('referenceChart').style.display = 'none';
        document.getElementById('progressScreen').style.display = 'block';
    }

    closeProgressScreen() {
        document.getElementById('progressScreen').style.display = 'none';

        // Show appropriate screen based on state
        if (this.currentMode && this.sessionCards.length > 0 && this.currentIndex < this.sessionCards.length) {
            document.getElementById('learningArea').style.display = 'block';
        } else if (this.currentMode && this.currentIndex >= this.sessionCards.length) {
            document.getElementById('completionScreen').style.display = 'block';
        } else {
            document.getElementById('welcomeScreen').style.display = 'block';
        }
    }

    formatTimeUntil(ms) {
        if (ms < 0) return 'now';
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        const minutes = Math.floor(ms / (1000 * 60));
        return `${minutes} min`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpacedRepetitionApp();
});
