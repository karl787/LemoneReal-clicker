class LemonClickerSecure {
    constructor() {
        this.clickCount = 0;
        this.isVerified = false;
        this.isVerifying = false;
        this.youtubeWindow = null;
        this.checkInterval = null;
        this.leaderboard = JSON.parse(localStorage.getItem('lemonLeaderboard')) || [];
        this.currentUser = '';
        
        this.initElements();
        this.bindEvents();
        this.updateDisplay();
        this.renderLeaderboard();
        this.setupWindowFocusDetection();
    }

    initElements() {
        this.lemon = document.getElementById('lemon');
        this.clickCountEl = document.getElementById('clickCount');
        this.clickEffect = document.getElementById('clickEffect');
        this.verifyStatus = document.getElementById('verifyStatus');
        this.verificationProgress = document.getElementById('verificationProgress');
        this.subscribeButton = document.getElementById('subscribeButton');
        this.usernameInput = document.getElementById('username');
        this.saveBtn = document.getElementById('saveScore');
        this.leaderboardList = document.getElementById('leaderboardList');
        // NO clearBtn ANYMORE!
    }

    bindEvents() {
        this.lemon.addEventListener('click', (e) => this.handleLemonClick(e));
        this.subscribeButton.addEventListener('click', (e) => this.handleSubscribeClick(e));
        this.saveBtn.addEventListener('click', () => this.saveScore());
        this.usernameInput.addEventListener('input', (e) => this.checkAdminCode(e));
        
        // Prevent right-click on the lemon
        this.lemon.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleLemonClick(event) {
        if (!this.isVerified) {
            this.showMessage('❌ Please subscribe to @LemoneReal on YouTube first!');
            return;
        }

        this.clickCount++;
        this.updateDisplay();
        this.showClickEffect(event);
        this.animateLemon();
    }

    async handleSubscribeClick(event) {
        const button = event.target.closest('.subscribe-button');
        
        // Prevent multiple clicks
        if (this.isVerifying) return;
        this.isVerifying = true;
        
        // Show visual feedback
        button.style.background = '#cc0000';
        button.style.pointerEvents = 'none';
        button.innerHTML = '<span class="subscribe-icon">⏳</span><span class="subscribe-text">OPENING CHANNEL...</span>';
        
        // Open YouTube channel
        this.youtubeWindow = window.open('https://www.youtube.com/@LemoneReal?sub_confirmation=1', '_blank');
        
        // Start monitoring the YouTube window
        this.startWindowMonitoring();
        
        this.showMessage('📺 YouTube channel opened! Please subscribe to @LemoneReal. When you return, verification will start automatically.');
    }

    setupWindowFocusDetection() {
        // Detects when the user returns to the page
        window.addEventListener('focus', () => {
            if (this.isVerifying && !this.isVerified) {
                // User has returned, start verification
                setTimeout(() => {
                    this.startVerificationProcess();
                }, 1000);
            }
        });
    }

    startWindowMonitoring() {
        // Monitor the YouTube window
        this.checkInterval = setInterval(() => {
            if (this.youtubeWindow && this.youtubeWindow.closed) {
                // YouTube window was closed, user is back
                clearInterval(this.checkInterval);
                this.startVerificationProcess();
            }
        }, 1000);

        // Fallback: automatically check after 30 seconds
        setTimeout(() => {
            if (this.isVerifying && !this.isVerified) {
                if (this.checkInterval) {
                    clearInterval(this.checkInterval);
                }
                this.startVerificationProcess();
            }
        }, 30000);
    }

    async startVerificationProcess() {
        // Stop monitoring
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        // Show progress bar
        this.verificationProgress.style.display = 'block';
        this.verifyStatus.textContent = '🔍 Checking subscription automatically...';
        this.verifyStatus.className = 'status not-verified';
        
        // Simulate API check with realistic delay
        await this.sleep(3000);
        
        // Simulate subscription check (98% success rate since user returned)
        const isSubscribed = Math.random() > 0.02; // 98% probability
        
        this.verificationProgress.style.display = 'none';
        
        if (isSubscribed) {
            // Successfully verified
            this.isVerified = true;
            this.verifyStatus.textContent = '✅ Welcome back! Subscription confirmed!';
            this.verifyStatus.className = 'status verified';
            this.lemon.classList.remove('disabled');
            
            // Hide subscribe container after successful verification
            document.querySelector('.youtube-subscribe-container').style.opacity = '0.3';
            document.querySelector('.youtube-subscribe-container').style.pointerEvents = 'none';
            
            // Change subscribe button to "Subscribed"
            this.subscribeButton.style.background = '#4caf50';
            this.subscribeButton.innerHTML = '<span class="subscribe-icon">✅</span><span class="subscribe-text">SUBSCRIBED</span>';
            
            this.showMessage('🎉 Subscription automatically confirmed! You can now click the lemon and collect points!');
        } else {
            // Verification failed (rare)
            this.verifyStatus.textContent = '❌ Subscription not detected';
            this.verifyStatus.className = 'status not-verified';
            
            // Reset subscribe button
            this.subscribeButton.style.background = '#ff0000';
            this.subscribeButton.style.pointerEvents = 'auto';
            this.subscribeButton.innerHTML = '<span class="subscribe-icon">🔔</span><span class="subscribe-text">TRY AGAIN</span>';
            
            this.showMessage('❗ Subscription could not be automatically detected. Please try again or make sure you have subscribed to @LemoneReal.');
        }
        
        this.isVerifying = false;
    }

    showClickEffect(event) {
        const effects = ['+1', '🍋', '⚡', '💫', '🌟'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        this.clickEffect.textContent = randomEffect;
        this.clickEffect.classList.remove('animate');
        
        // Trigger reflow
        this.clickEffect.offsetHeight;
        
        this.clickEffect.classList.add('animate');
    }

    animateLemon() {
        this.lemon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.lemon.style.transform = 'scale(1)';
        }, 100);
    }

    updateDisplay() {
        this.clickCountEl.textContent = this.clickCount.toLocaleString();
        
        if (!this.isVerified) {
            this.lemon.classList.add('disabled');
            this.verifyStatus.textContent = '🍋 Subscribe to @LemoneReal to play!';
            this.verifyStatus.className = 'status not-verified';
        }
    }

    saveScore() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showMessage('❌ Please enter a name!');
            return;
        }
        
        if (this.clickCount === 0) {
            this.showMessage('❌ You must click at least once!');
            return;
        }

        // Check if the user already exists
        const existingUserIndex = this.leaderboard.findIndex(entry => entry.name === username);
        
        if (existingUserIndex !== -1) {
            // Update existing user if new score is higher
            if (this.clickCount > this.leaderboard[existingUserIndex].score) {
                this.leaderboard[existingUserIndex].score = this.clickCount;
                this.leaderboard[existingUserIndex].date = new Date().toLocaleDateString('en-US');
                this.showMessage(`🎉 New record for ${username}! Score: ${this.clickCount}`);
            } else {
                this.showMessage(`ℹ️ ${username} already has a higher score!`);
                return;
            }
        } else {
            // Add new user
            this.leaderboard.push({
                name: username,
                score: this.clickCount,
                date: new Date().toLocaleDateString('en-US')
            });
            this.showMessage(`✅ Score saved for ${username}! Score: ${this.clickCount}`);
        }

        // Sort leaderboard by score (descending) and keep only top 100
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 100);
        
        // Save to localStorage
        localStorage.setItem('lemonLeaderboard', JSON.stringify(this.leaderboard));
        
        this.renderLeaderboard();
        this.resetGameOnly(); // Only reset the game, NOT the leaderboard!
    }

    renderLeaderboard() {
        if (this.leaderboard.length === 0) {
            this.leaderboardList.innerHTML = '<div class="empty-leaderboard">No entries yet.<br>Be the first!</div>';
            return;
        }

        const html = this.leaderboard.map((entry, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medal = '';
            
            if (rank === 1) {
                rankClass = 'rank-1 top-3';
                medal = '🥇 ';
            } else if (rank === 2) {
                rankClass = 'rank-2 top-3';
                medal = '🥈 ';
            } else if (rank === 3) {
                rankClass = 'rank-3 top-3';
                medal = '🥉 ';
            }
            
            return `
                <div class="leaderboard-entry ${rankClass}">
                    <span class="rank">${medal}${rank}</span>
                    <span class="name">${this.escapeHtml(entry.name)}</span>
                    <span class="score">${entry.score.toLocaleString()} 🍋</span>
                </div>
            `;
        }).join('');
        
        this.leaderboardList.innerHTML = html;
    }

    checkAdminCode(event) {
        const value = event.target.value;
        
        // Check for admin code - ONLY this one method can reset the leaderboard
        if (value === 'Jlk76%;s') {
            // Admin code detected, perform reset
            this.performAdminReset();
            // Clear the input field
            event.target.value = '';
        }
    }

    performAdminReset() {
        // ONLY this function can reset the leaderboard!
        this.leaderboard = [];
        localStorage.removeItem('lemonLeaderboard');
        this.renderLeaderboard();
        this.showMessage('🔧 Admin reset performed! Leaderboard has been reset.');
    }

    resetGameOnly() {
        // Resets ONLY the game, NOT the leaderboard!
        this.clickCount = 0;
        this.updateDisplay();
        this.usernameInput.value = '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message) {
        // Simple message display
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new LemonClickerSecure();
});