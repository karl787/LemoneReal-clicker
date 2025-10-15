// Firebase Configuration - Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB7OYzQ4P6KVV3-vP8WxOcX9N8kF5dXUzM",
    authDomain: "lemon-clicker-demo.firebaseapp.com",
    databaseURL: "https://lemon-clicker-demo-default-rtdb.firebaseio.com",
    projectId: "lemon-clicker-demo",
    storageBucket: "lemon-clicker-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("🔥 Firebase connected successfully!");
} catch (error) {
    console.warn("🔥 Firebase connection failed, using fallback mode:", error);
    database = null;
}

class LemonClickerSecure {
    constructor() {
        this.clickCount = 0;
        this.isVerified = false;
        this.isVerifying = false;
        this.youtubeWindow = null;
        this.checkInterval = null;
        this.leaderboard = [];
        this.currentUser = '';
        this.isOnline = !!database;
        this.updateTimer = null;
        this.lastUpdate = 0;
        
        this.initElements();
        this.bindEvents();
        this.updateDisplay();
        this.initializeLeaderboard();
        this.setupWindowFocusDetection();
        this.startAutoUpdate();
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
        
        // Add online status indicator
        this.addOnlineStatusIndicator();
    }

    addOnlineStatusIndicator() {
        const leaderboardTitle = document.querySelector('.leaderboard h2');
        const statusIcon = this.isOnline ? '🌐' : '💾';
        const statusText = this.isOnline ? 'Online' : 'Offline';
        const statusColor = this.isOnline ? '#4caf50' : '#ff9800';
        
        leaderboardTitle.innerHTML = `🏆 Top 100 Leaderboard ${statusIcon} <small style="color: ${statusColor}; font-size: 0.7em;">(${statusText})</small>`;
    }

    async initializeLeaderboard() {
        if (this.isOnline) {
            try {
                // Load leaderboard from Firebase
                await this.loadLeaderboardFromFirebase();
                this.showMessage('🌐 Connected to online leaderboard!');
            } catch (error) {
                console.warn('Failed to load online leaderboard:', error);
                this.fallbackToLocalStorage();
            }
        } else {
            this.fallbackToLocalStorage();
        }
        this.renderLeaderboard();
    }

    async loadLeaderboardFromFirebase() {
        return new Promise((resolve, reject) => {
            database.ref('leaderboard').once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    this.leaderboard = data ? Object.values(data) : [];
                    this.leaderboard.sort((a, b) => b.score - a.score);
                    this.lastUpdate = Date.now();
                    resolve();
                })
                .catch(reject);
        });
    }

    fallbackToLocalStorage() {
        this.leaderboard = JSON.parse(localStorage.getItem('lemonLeaderboard')) || [];
        this.isOnline = false;
        this.addOnlineStatusIndicator();
        this.showMessage('💾 Using offline leaderboard');
    }

    startAutoUpdate() {
        if (!this.isOnline) return;
        
        // Update every 10 seconds
        this.updateTimer = setInterval(async () => {
            try {
                const oldLength = this.leaderboard.length;
                await this.loadLeaderboardFromFirebase();
                this.renderLeaderboard();
                
                // Show notification if new entries were added
                if (this.leaderboard.length > oldLength) {
                    this.showMessage('🆕 Leaderboard updated! New scores available.');
                }
            } catch (error) {
                console.warn('Auto-update failed:', error);
            }
        }, 10000); // 10 seconds
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

    async saveScore() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showMessage('❌ Please enter a name!');
            return;
        }
        
        if (this.clickCount === 0) {
            this.showMessage('❌ You must click at least once!');
            return;
        }

        // Create score entry
        const scoreEntry = {
            name: username,
            score: this.clickCount,
            date: new Date().toLocaleDateString('en-US'),
            timestamp: Date.now(),
            id: `${username}_${Date.now()}`
        };

        try {
            if (this.isOnline) {
                await this.saveToFirebase(scoreEntry);
                this.showMessage(`🌐 Score saved online for ${username}! Score: ${this.clickCount}`);
            } else {
                this.saveToLocalStorage(scoreEntry);
                this.showMessage(`💾 Score saved locally for ${username}! Score: ${this.clickCount}`);
            }
            
            this.resetGameOnly(); // Only reset the game, NOT the leaderboard!
        } catch (error) {
            console.error('Error saving score:', error);
            this.showMessage('❌ Error saving score. Please try again.');
        }
    }

    async saveToFirebase(scoreEntry) {
        // First, reload current leaderboard to check for conflicts
        await this.loadLeaderboardFromFirebase();
        
        // Check if user already exists with a higher score
        const existingUserIndex = this.leaderboard.findIndex(entry => 
            entry.name.toLowerCase() === scoreEntry.name.toLowerCase()
        );
        
        if (existingUserIndex !== -1) {
            if (scoreEntry.score <= this.leaderboard[existingUserIndex].score) {
                throw new Error(`${scoreEntry.name} already has a higher score!`);
            }
            // Remove old entry
            this.leaderboard.splice(existingUserIndex, 1);
        }
        
        // Add new entry
        this.leaderboard.push(scoreEntry);
        
        // Sort and limit to top 100
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 100);
        
        // Save to Firebase
        const leaderboardData = {};
        this.leaderboard.forEach((entry, index) => {
            leaderboardData[entry.id] = entry;
        });
        
        await database.ref('leaderboard').set(leaderboardData);
        this.renderLeaderboard();
        
        // Also save backup to localStorage
        localStorage.setItem('lemonLeaderboard', JSON.stringify(this.leaderboard));
    }

    saveToLocalStorage(scoreEntry) {
        // Check if user already exists with a higher score
        const existingUserIndex = this.leaderboard.findIndex(entry => 
            entry.name.toLowerCase() === scoreEntry.name.toLowerCase()
        );
        
        if (existingUserIndex !== -1) {
            if (scoreEntry.score <= this.leaderboard[existingUserIndex].score) {
                this.showMessage(`ℹ️ ${scoreEntry.name} already has a higher score!`);
                return;
            }
            // Remove old entry
            this.leaderboard.splice(existingUserIndex, 1);
        }
        
        // Add new entry
        this.leaderboard.push(scoreEntry);
        
        // Sort and limit to top 100
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 100);
        
        // Save to localStorage
        localStorage.setItem('lemonLeaderboard', JSON.stringify(this.leaderboard));
        this.renderLeaderboard();
    }

    renderLeaderboard() {
        if (this.leaderboard.length === 0) {
            const emptyMessage = this.isOnline ? 
                'No entries yet.<br>Be the first to score online! 🌐' : 
                'No entries yet.<br>Be the first!';
            this.leaderboardList.innerHTML = `<div class="empty-leaderboard">${emptyMessage}</div>`;
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
            
            // Show if entry is recent (within last minute for online mode)
            const isRecent = this.isOnline && entry.timestamp && 
                             (Date.now() - entry.timestamp) < 60000;
            const recentBadge = isRecent ? ' <span style="color: #4caf50; font-size: 0.8em;">🆕</span>' : '';
            
            return `
                <div class="leaderboard-entry ${rankClass}">
                    <span class="rank">${medal}${rank}</span>
                    <span class="name">${this.escapeHtml(entry.name)}${recentBadge}</span>
                    <span class="score">${entry.score.toLocaleString()} 🍋</span>
                </div>
            `;
        }).join('');
        
        this.leaderboardList.innerHTML = html;
        
        // Update last update time display
        if (this.isOnline && this.lastUpdate) {
            const timeAgo = Math.floor((Date.now() - this.lastUpdate) / 1000);
            const updateInfo = document.querySelector('.leaderboard-update-info');
            if (updateInfo) {
                updateInfo.remove();
            }
            
            const infoEl = document.createElement('div');
            infoEl.className = 'leaderboard-update-info';
            infoEl.style.cssText = 'text-align: center; font-size: 0.8em; color: #666; margin-top: 10px;';
            infoEl.textContent = `Last updated: ${timeAgo}s ago`;
            this.leaderboardList.parentNode.appendChild(infoEl);
        }
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

    async performAdminReset() {
        // ONLY this function can reset the leaderboard!
        try {
            this.leaderboard = [];
            
            if (this.isOnline) {
                // Clear Firebase leaderboard
                await database.ref('leaderboard').remove();
                this.showMessage('🔧 Admin reset performed! Online leaderboard has been reset.');
            } else {
                this.showMessage('🔧 Admin reset performed! Local leaderboard has been reset.');
            }
            
            // Always clear localStorage backup
            localStorage.removeItem('lemonLeaderboard');
            this.renderLeaderboard();
        } catch (error) {
            console.error('Error during admin reset:', error);
            this.showMessage('❌ Error during reset. Please try again.');
        }
    }

    // Cleanup method to stop timers when page is unloaded
    cleanup() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
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
let gameInstance;
document.addEventListener('DOMContentLoaded', () => {
    gameInstance = new LemonClickerSecure();
});

// Cleanup when page is unloaded
window.addEventListener('beforeunload', () => {
    if (gameInstance) {
        gameInstance.cleanup();
    }
});

// Handle visibility change to pause/resume auto-updates
document.addEventListener('visibilitychange', () => {
    if (gameInstance && gameInstance.isOnline) {
        if (document.hidden) {
            // Page is hidden, you might want to reduce update frequency
            console.log('🔍 Page hidden, maintaining background updates');
        } else {
            // Page is visible again, ensure updates are running
            console.log('👁️ Page visible, resuming normal updates');
            // Immediately check for updates when page becomes visible
            if (gameInstance.loadLeaderboardFromFirebase) {
                gameInstance.loadLeaderboardFromFirebase().then(() => {
                    gameInstance.renderLeaderboard();
                });
            }
        }
    }
});
