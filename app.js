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

        // Update character display with romaji tooltip
        const charDisplay = document.getElementById('characterDisplay');
        charDisplay.textContent = this.currentCard.char;
        charDisplay.setAttribute('data-romaji', `💡 Hover for hint: ${this.currentCard.romaji}`);
        document.getElementById('hint').style.display = 'none';
        document.getElementById('answerSection').style.display = 'none';
        document.getElementById('showAnswerBtn').style.display = 'block';

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
        // Update card using SM-2 algorithm
        const cardId = this.currentCard.id;
        const cardData = this.progress[cardId] || {
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            nextReview: Date.now()
        };

        // SM-2 Algorithm
        let { easeFactor, interval, repetitions } = cardData;

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
            lastReview: Date.now()
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
        let chartData = [];
        let title = 'Reference Chart';

        if (this.currentMode && japaneseData[this.currentMode]) {
            chartData = japaneseData[this.currentMode];
            title = `${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)} Reference Chart`;
        } else {
            // Default to showing all alphabets
            title = 'Choose a learning mode to see its reference chart';
        }

        // Update title
        document.getElementById('chartTitle').textContent = title;

        // Clear previous chart
        const chartGrid = document.getElementById('chartGrid');
        chartGrid.innerHTML = '';

        // Populate chart
        chartData.forEach(item => {
            const chartItem = document.createElement('div');
            chartItem.className = 'chart-item';

            const character = document.createElement('div');
            character.className = 'chart-character';
            character.textContent = item.char;

            const romaji = document.createElement('div');
            romaji.className = 'chart-romaji';
            romaji.textContent = item.romaji;

            chartItem.appendChild(character);
            chartItem.appendChild(romaji);

            // Add meaning if available (for kanji, words, sentences)
            if (item.meaning && (this.currentMode === 'kanji' || this.currentMode === 'words' || this.currentMode === 'sentences')) {
                const meaning = document.createElement('div');
                meaning.className = 'chart-meaning';
                meaning.textContent = item.meaning;
                chartItem.appendChild(meaning);
            }

            chartGrid.appendChild(chartItem);
        });

        // Hide other screens, show chart
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('learningArea').style.display = 'none';
        document.getElementById('completionScreen').style.display = 'none';
        document.getElementById('referenceChart').style.display = 'block';
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpacedRepetitionApp();
});
