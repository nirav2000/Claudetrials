/**
 * Authentication Integration for Fraction Worksheets App
 *
 * Integrates the authentication library with the fraction comparison practice app
 * Handles user authentication, progress saving, and login history
 */

// Lazy-load auth modules to prevent blocking the main app
let authManager = null;
let authUI = null;
let firebaseConfig = null;

class FractionAppAuth {
  constructor() {
    this.currentUser = null;
    this.initialized = false;
    this.authModulesLoaded = false;
    this.debugLogs = [];
  }

  /**
   * Add debug message to visible on-screen panel (for iPad users without console)
   */
  debugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    this.debugLogs.push(logEntry);

    // Keep only last 20 logs
    if (this.debugLogs.length > 20) {
      this.debugLogs.shift();
    }

    // Update debug panel
    const panel = document.getElementById('debug-content');
    if (panel) {
      const colors = {
        info: '#00ff00',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff4444',
        user: '#00aaff'
      };

      const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        user: '👤'
      };

      panel.innerHTML = this.debugLogs.map(log =>
        `<div style="color: ${colors[log.type] || '#00ff00'}; margin-bottom: 8px;">
          <strong>[${log.timestamp}]</strong> ${icons[log.type] || ''} ${log.message}
        </div>`
      ).join('');
    }

    // Also log to console
    console.log(`[${timestamp}] ${message}`);
  }

  /**
   * Load auth modules dynamically
   */
  async loadAuthModules() {
    if (this.authModulesLoaded) return true;

    try {
      const authLib = await import('../auth-library/index.js');
      authManager = authLib.authManager;
      authUI = authLib.authUI;
      firebaseConfig = authLib.firebaseConfig;
      this.authModulesLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load auth modules:', error);
      return false;
    }
  }

  /**
   * Validate Firebase configuration
   * @returns {Object} { isValid: boolean, message: string }
   */
  validateFirebaseConfig() {
    if (!firebaseConfig) {
      return {
        isValid: false,
        message: 'Firebase configuration not loaded'
      };
    }

    const config = firebaseConfig;

    // Check if using placeholder values
    const hasPlaceholders =
      config.apiKey === 'YOUR_API_KEY' ||
      config.projectId === 'YOUR_PROJECT_ID' ||
      config.authDomain.includes('YOUR_PROJECT_ID');

    if (hasPlaceholders) {
      return {
        isValid: false,
        message: 'Firebase configuration is using placeholder values. Please update auth-library/config/firebase-config.js with your actual Firebase credentials.'
      };
    }

    // Check if required fields are present
    if (!config.apiKey || !config.projectId || !config.authDomain) {
      return {
        isValid: false,
        message: 'Firebase configuration is incomplete. Please check auth-library/config/firebase-config.js'
      };
    }

    return {
      isValid: true,
      message: 'Configuration looks valid'
    };
  }

  /**
   * Initialize authentication
   */
  async initialize() {
    this.debugLog('🚀 Starting authentication initialization...', 'info');

    if (this.initialized) {
      this.debugLog('Auth already initialized', 'warning');
      return;
    }

    // Always set up UI event listeners, even if Firebase initialization fails
    // This ensures the sign-in button still shows an error message instead of doing nothing
    this.setupEventListeners();
    this.debugLog('Event listeners set up', 'success');

    // Load auth modules first
    this.debugLog('Loading auth modules...', 'info');
    const modulesLoaded = await this.loadAuthModules();
    if (!modulesLoaded) {
      this.debugLog('⚠ Auth modules failed to load - authentication disabled', 'error');
      return;
    }
    this.debugLog('Auth modules loaded successfully', 'success');

    // Validate Firebase configuration before attempting initialization
    this.debugLog('Validating Firebase config...', 'info');
    const configValidation = this.validateFirebaseConfig();
    if (!configValidation.isValid) {
      this.debugLog(`Firebase config invalid: ${configValidation.message}`, 'error');
      this.showNotification(
        'Authentication is disabled: Firebase configuration needed',
        'warning',
        8000
      );
      return;
    }
    this.debugLog('Firebase config valid', 'success');

    try {
      this.debugLog('Initializing Firebase...', 'info');

      // IMPORTANT: Set up listeners BEFORE initializing auth manager
      // so we don't miss any auth state changes that happen during initialization
      authManager.on('authStateChanged', (user) => {
        this.debugLog(`🔔 Auth state changed: ${user ? user.email : 'signed out'}`, 'user');
        this.currentUser = user;
        this.onAuthStateChanged(user);
      });

      // Listen for redirect auth completion
      authManager.on('redirectAuthComplete', (user) => {
        this.debugLog('✅ Redirect auth completed', 'success');
        this.showNotification(
          `Welcome ${user.displayName || 'back'}! You've been signed in successfully.`,
          'success',
          5000
        );
      });

      // Listen for redirect auth errors
      authManager.on('redirectAuthError', (error) => {
        this.debugLog(`❌ Redirect auth failed: ${error.message}`, 'error');
        this.showNotification(
          'Authentication failed. Please try again.',
          'error',
          5000
        );
      });

      this.debugLog('Event listeners registered', 'success');

      // Initialize auth manager (this may trigger authStateChanged)
      this.debugLog('Calling authManager.initialize()...', 'info');
      await authManager.initialize();
      this.debugLog('authManager.initialize() completed', 'success');

      // CRITICAL: Wait a bit for auth state to settle after redirect
      // Firebase may need a moment to process the redirect result
      this.debugLog('⏳ Waiting for auth state to settle...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Double-check current auth state in case we missed the event
      const currentUser = authManager.getCurrentUser();
      this.debugLog(`🔎 Checking current user after delay...`, 'info');

      if (currentUser) {
        this.debugLog(`📋 User found: ${currentUser.email || currentUser.uid}`, 'user');
        this.currentUser = currentUser;
        this.onAuthStateChanged(currentUser);

        // Force UI update after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.debugLog('🔄 Running delayed UI sync...', 'info');
          this.updateUIForAuthenticatedUser(currentUser);
        }, 500);
      } else {
        this.debugLog('📋 No current user after init', 'info');
      }

      this.initialized = true;
      this.debugLog('✅ Authentication initialized successfully', 'success');

    } catch (error) {
      this.debugLog(`❌ Init failed: ${error.message}`, 'error');

      // Show detailed error to user
      let errorMessage = 'Authentication is currently unavailable. ';

      if (error.message.includes('Firebase SDK not loaded')) {
        errorMessage += 'Firebase SDK failed to load. Check your internet connection.';
      } else if (error.message.includes('API key not valid') || error.message.includes('apiKey')) {
        errorMessage += 'Invalid Firebase API key. Please check your configuration.';
      } else if (error.message.includes('auth/invalid-api-key')) {
        errorMessage += 'Invalid Firebase API key format.';
      } else {
        errorMessage += error.message;
      }

      this.showNotification(errorMessage, 'error', 8000);
    }
  }

  /**
   * Set up event listeners for auth UI
   */
  setupEventListeners() {
    // Close debug panel button
    const closeDebugBtn = document.getElementById('close-debug');
    if (closeDebugBtn) {
      closeDebugBtn.addEventListener('click', () => {
        const panel = document.getElementById('debug-panel');
        if (panel) panel.style.display = 'none';
      });
    }

    // Login button (if exists in header)
    const loginBtn = document.getElementById('auth-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.showLoginModal();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('auth-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await this.logout();
      });
    }

    // User menu button
    const userMenuBtn = document.getElementById('auth-user-menu-btn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', () => {
        this.showUserMenu();
      });
    }
  }

  /**
   * Handle auth state changes
   * @param {Object|null} user - Current user or null
   */
  onAuthStateChanged(user) {
    if (user) {
      this.debugLog(`👤 User signed in: ${user.email || user.uid}`, 'user');

      // Update UI to show user is logged in
      this.updateUIForAuthenticatedUser(user);

      // Load user's saved progress
      this.loadUserProgress(user.uid);

      // Check for suspicious activity (non-blocking)
      this.checkSuspiciousActivity();

    } else {
      this.debugLog('User signed out', 'info');

      // Update UI to show user is logged out
      this.updateUIForAnonymousUser();
    }
  }

  /**
   * Update UI for authenticated users
   * @param {Object} user - User object
   * @param {number} retryCount - Number of retries attempted
   */
  updateUIForAuthenticatedUser(user, retryCount = 0) {
    this.debugLog(`👤 Updating UI for: ${user.email || user.uid}`, 'user');

    // Hide login button, show user info
    const loginBtn = document.getElementById('auth-login-btn');
    const userMenu = document.getElementById('auth-user-menu');
    const displayName = document.getElementById('auth-user-display-name');
    const avatar = document.getElementById('auth-user-avatar');

    this.debugLog(`🔍 DOM check: login=${!!loginBtn} menu=${!!userMenu} name=${!!displayName} avatar=${!!avatar}`, 'info');

    // If elements aren't found and we haven't retried too many times, try again after a delay
    if ((!loginBtn || !userMenu || !displayName || !avatar) && retryCount < 3) {
      this.debugLog(`⚠️ Retrying UI update in ${(retryCount + 1) * 100}ms (${retryCount + 1}/3)`, 'warning');
      setTimeout(() => {
        this.updateUIForAuthenticatedUser(user, retryCount + 1);
      }, (retryCount + 1) * 100);
      return;
    }

    if (loginBtn) {
      loginBtn.style.display = 'none';
      this.debugLog('✅ Login button hidden', 'success');
    } else {
      this.debugLog('❌ Login button NOT FOUND!', 'error');
    }

    if (userMenu) {
      // Force display with important inline style
      userMenu.style.display = 'flex';
      userMenu.style.visibility = 'visible';
      this.debugLog('✅ User menu displayed', 'success');

      // Update user display name
      const displayText = user.displayName || user.email?.split('@')[0] || 'User';
      this.debugLog(`✏️ Setting name to: ${displayText}`, 'user');

      if (displayName) {
        displayName.textContent = displayText;
        this.debugLog(`✅ Display name set: ${displayName.textContent}`, 'success');
      } else {
        this.debugLog('❌ Display name element NOT FOUND!', 'error');
      }

      // Update user avatar
      if (avatar) {
        if (user.photoURL) {
          avatar.src = user.photoURL;
          this.debugLog('✅ Avatar updated (user photo)', 'success');
        } else {
          // Generate placeholder avatar
          const name = user.displayName || user.email?.split('@')[0] || 'User';
          avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=673ab7&color=fff&size=40`;
          this.debugLog('✅ Avatar updated (placeholder)', 'success');
        }
        avatar.alt = displayText;
      } else {
        this.debugLog('❌ Avatar element NOT FOUND!', 'error');
      }
    } else {
      this.debugLog('❌ User menu NOT FOUND!', 'error');
    }

    // Verify the update worked
    setTimeout(() => {
      const verifyMenu = document.getElementById('auth-user-menu');
      const verifyDisplay = document.getElementById('auth-user-display-name');
      this.debugLog(`🔎 Verify: menu=${verifyMenu ? verifyMenu.style.display : 'NOT FOUND'} name=${verifyDisplay ? verifyDisplay.textContent : 'NOT FOUND'}`, 'info');
    }, 500);

    // Show "Save Progress" indicator if available
    this.showFeatureIndicator('Cloud save enabled');
  }

  /**
   * Update UI for anonymous users
   */
  updateUIForAnonymousUser() {
    // Show login button, hide user info
    const loginBtn = document.getElementById('auth-login-btn');
    const userMenu = document.getElementById('auth-user-menu');

    if (loginBtn) loginBtn.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';

    // Hide feature indicators
    this.hideFeatureIndicator();
  }

  /**
   * Show login modal
   */
  showLoginModal() {
    this.debugLog('🔑 Sign In button clicked!', 'info');

    // Check if auth modules are loaded
    if (!this.authModulesLoaded || !authManager || !authUI) {
      this.debugLog('❌ Auth modules not loaded', 'error');
      this.showNotification(
        'Authentication system is not available. Authentication modules failed to load.',
        'error',
        5000
      );
      return;
    }
    this.debugLog('✅ Auth modules available', 'success');

    // Check if auth manager is initialized
    if (!this.initialized && !authManager.isInitialized()) {
      this.debugLog('❌ Auth manager not initialized', 'error');
      this.showNotification(
        'Authentication system is not available. Please check your Firebase configuration and refresh the page.',
        'error',
        5000
      );
      return;
    }
    this.debugLog('✅ Auth manager initialized', 'success');

    try {
      this.debugLog('📱 Opening auth UI modal...', 'info');
      authUI.show({
        title: 'Sign In to Save Your Progress',
        onSuccess: (result) => {
          // If using redirect mode, the page will redirect away
          if (result.redirecting) {
            this.debugLog('🔀 Redirecting to auth provider...', 'info');
            this.showNotification(
              result.message || 'Redirecting to sign in...',
              'info',
              3000
            );
            return;
          }

          // Popup mode: handle success immediately
          const user = result.user || result;
          this.debugLog(`✅ Login successful: ${user.email}`, 'success');

          // Update current user
          this.currentUser = user;

          // CRITICAL: Update UI immediately for popup mode
          this.updateUIForAuthenticatedUser(user);

          // Show welcome message
          this.showNotification(
            `Welcome ${user.displayName || 'back'}! Your progress will now be saved to the cloud.`,
            'success'
          );

          // Load user progress
          this.loadUserProgress(user.uid);
        },
        onError: (error) => {
          this.debugLog(`❌ Login failed: ${error.message}`, 'error');
          this.showNotification('Login failed. Please try again.', 'error');
        }
      });
      this.debugLog('✅ Auth UI modal opened', 'success');
    } catch (error) {
      this.debugLog(`❌ Failed to show modal: ${error.message}`, 'error');
      this.showNotification(
        'Failed to open login dialog. Please check your Firebase configuration.',
        'error',
        5000
      );
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    if (!authManager) {
      console.error('Cannot logout: authManager not loaded');
      return;
    }

    try {
      const result = await authManager.signOut();

      if (result.success) {
        this.showNotification('Signed out successfully', 'success');
      } else {
        this.showNotification('Failed to sign out', 'error');
      }

    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Failed to sign out', 'error');
    }
  }

  /**
   * Load user progress from Firestore
   * @param {string} userId - User ID
   */
  async loadUserProgress(userId) {
    if (!authManager) {
      console.error('Cannot load progress: authManager not loaded');
      return;
    }

    try {
      const result = await authManager.getUserData(userId);

      if (result.success && result.data.progress) {
        console.log('User progress loaded:', result.data.progress);

        // Apply progress to app (integrate with your app's state management)
        // For example:
        // - Restore last worksheet configuration
        // - Load saved results
        // - Restore preferences

        // This is a placeholder - you would implement this based on your app's needs
        const progress = result.data.progress;

        // Example: restore last settings
        if (progress.lastSettings) {
          // Apply settings to your app
          console.log('Restoring settings:', progress.lastSettings);
        }

      } else {
        console.log('No saved progress found');
      }

    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  }

  /**
   * Save user progress to Firestore
   * @param {Object} progressData - Progress data to save
   */
  async saveUserProgress(progressData) {
    if (!this.currentUser) {
      console.log('Not signed in, progress not saved to cloud');
      return false;
    }

    if (!authManager || !authManager.db) {
      console.error('Cannot save progress: authManager not loaded');
      return false;
    }

    try {
      // Get Firestore instance from auth manager
      const db = authManager.db;

      // Save to Firestore
      await db.collection('users').doc(this.currentUser.uid).set({
        progress: progressData,
        lastUpdatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('Progress saved to cloud');

      // Show brief notification
      this.showNotification('Progress saved', 'success', 2000);

      return true;

    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  /**
   * Save worksheet results
   * @param {Object} results - Worksheet results
   */
  async saveWorksheetResults(results) {
    if (!this.currentUser) {
      return;
    }

    const progressData = {
      lastWorksheet: {
        results: results,
        completedAt: new Date().toISOString(),
        score: results.score || 0,
        total: results.total || 0
      },
      totalWorksheets: (await this.getTotalWorksheets()) + 1
    };

    await this.saveUserProgress(progressData);
  }

  /**
   * Get total worksheets completed
   * @returns {Promise<number>}
   */
  async getTotalWorksheets() {
    if (!this.currentUser) return 0;
    if (!authManager) return 0;

    try {
      const result = await authManager.getUserData(this.currentUser.uid);

      if (result.success && result.data.progress) {
        return result.data.progress.totalWorksheets || 0;
      }

      return 0;

    } catch (error) {
      console.error('Failed to get total worksheets:', error);
      return 0;
    }
  }

  /**
   * Check for suspicious activity
   */
  async checkSuspiciousActivity() {
    if (!this.currentUser) return;
    if (!authManager) return;

    try {
      const result = await authManager.checkSuspiciousActivity();

      if (result.suspicious) {
        console.warn('Suspicious activity detected:', result.flags);

        // Show warning to user
        this.showNotification(
          '⚠️ Suspicious activity detected on your account. Please check your login history.',
          'warning',
          5000
        );
      }

    } catch (error) {
      console.error('Failed to check suspicious activity:', error);
    }
  }

  /**
   * Show user menu
   */
  showUserMenu() {
    // Create simple dropdown menu
    const menu = document.createElement('div');
    menu.className = 'auth-user-dropdown';
    menu.innerHTML = `
      <div class="auth-dropdown-content">
        <div class="auth-dropdown-header">
          <strong>${this.currentUser.displayName || 'User'}</strong>
          <small>${this.currentUser.email || ''}</small>
        </div>
        <button class="auth-dropdown-item" id="auth-view-history">Login History</button>
        <button class="auth-dropdown-item" id="auth-view-progress">My Progress</button>
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #e0e0e0;">
        <button class="auth-dropdown-item" id="auth-logout-menu">Sign Out</button>
      </div>
    `;

    // Position menu
    const userMenuBtn = document.getElementById('auth-user-menu-btn');
    if (userMenuBtn) {
      const rect = userMenuBtn.getBoundingClientRect();
      menu.style.position = 'fixed';
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.right = '20px';
    }

    document.body.appendChild(menu);

    // Event listeners
    menu.querySelector('#auth-view-history').addEventListener('click', () => {
      this.showLoginHistory();
      menu.remove();
    });

    menu.querySelector('#auth-view-progress').addEventListener('click', () => {
      this.showUserProgress();
      menu.remove();
    });

    menu.querySelector('#auth-logout-menu').addEventListener('click', async () => {
      menu.remove();
      await this.logout();
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== userMenuBtn) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  /**
   * Show login history
   */
  async showLoginHistory() {
    if (!authManager) {
      this.showNotification('Login history unavailable', 'error');
      return;
    }

    try {
      const history = await authManager.getLoginHistory(20);

      // Create modal with history
      const modal = document.createElement('div');
      modal.className = 'auth-modal-overlay';
      modal.innerHTML = `
        <div class="auth-modal">
          <button class="auth-modal-close">&times;</button>
          <div class="auth-modal-content">
            <h2>Login History</h2>
            <p style="color: #666; margin-bottom: 16px;">Your recent login activity</p>
            <div class="auth-history-list">
              ${history.length === 0 ? '<p>No login history found</p>' : history.map(log => `
                <div class="auth-history-item">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <span class="auth-history-method">${log.authMethod || 'Unknown'}</span>
                    <span class="auth-history-status ${log.status}">${log.status}</span>
                  </div>
                  <div class="auth-history-time">${new Date(log.timestamp).toLocaleString()}</div>
                  <div class="auth-history-details">
                    <span>${log.location?.city || 'Unknown'}, ${log.location?.country || 'Unknown'}</span>
                    <span style="margin: 0 8px;">•</span>
                    <span>${log.deviceInfo?.browser || 'Unknown'} on ${log.deviceInfo?.os || 'Unknown'}</span>
                  </div>
                  <div class="auth-history-ip">IP: ${log.ipAddress}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Close button
      modal.querySelector('.auth-modal-close').addEventListener('click', () => {
        modal.remove();
      });

      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

    } catch (error) {
      console.error('Failed to show login history:', error);
      this.showNotification('Failed to load login history', 'error');
    }
  }

  /**
   * Show user progress
   */
  async showUserProgress() {
    if (!authManager) {
      this.showNotification('Progress unavailable', 'error');
      return;
    }

    try {
      const result = await authManager.getUserData(this.currentUser.uid);
      const progress = result.data?.progress || {};

      const modal = document.createElement('div');
      modal.className = 'auth-modal-overlay';
      modal.innerHTML = `
        <div class="auth-modal">
          <button class="auth-modal-close">&times;</button>
          <div class="auth-modal-content">
            <h2>My Progress</h2>
            <div style="margin-top: 24px;">
              <div class="auth-progress-stat">
                <div class="auth-progress-label">Total Worksheets Completed</div>
                <div class="auth-progress-value">${progress.totalWorksheets || 0}</div>
              </div>
              ${progress.lastWorksheet ? `
                <div class="auth-progress-stat">
                  <div class="auth-progress-label">Last Worksheet Score</div>
                  <div class="auth-progress-value">${progress.lastWorksheet.score || 0} / ${progress.lastWorksheet.total || 0}</div>
                </div>
                <div class="auth-progress-stat">
                  <div class="auth-progress-label">Last Activity</div>
                  <div class="auth-progress-value">${new Date(progress.lastWorksheet.completedAt).toLocaleString()}</div>
                </div>
              ` : '<p style="color: #666;">No worksheet data yet. Complete a worksheet to see your progress!</p>'}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('.auth-modal-close').addEventListener('click', () => {
        modal.remove();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

    } catch (error) {
      console.error('Failed to show progress:', error);
      this.showNotification('Failed to load progress', 'error');
    }
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning)
   * @param {number} duration - Duration in milliseconds
   */
  showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show animation
    setTimeout(() => {
      notification.classList.add('auth-notification-show');
    }, 100);

    // Hide and remove
    setTimeout(() => {
      notification.classList.remove('auth-notification-show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /**
   * Show feature indicator
   * @param {string} message - Feature message
   */
  showFeatureIndicator(message) {
    let indicator = document.getElementById('auth-feature-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'auth-feature-indicator';
      indicator.className = 'auth-feature-indicator';
      document.body.appendChild(indicator);
    }

    indicator.textContent = message;
    indicator.style.display = 'block';
  }

  /**
   * Hide feature indicator
   */
  hideFeatureIndicator() {
    const indicator = document.getElementById('auth-feature-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Force refresh the UI to match current auth state
   * Useful for debugging auth issues
   */
  forceRefreshUI() {
    console.log('🔄 Force refreshing UI...');

    // Check auth manager for current user
    const authUser = authManager ? authManager.getCurrentUser() : null;
    const localUser = this.currentUser;

    console.log('Current auth state:', {
      authManagerUser: authUser ? authUser.email : 'none',
      localUser: localUser ? localUser.email : 'none',
      authManagerInitialized: authManager ? authManager.isInitialized() : false,
      localInitialized: this.initialized
    });

    // Use whichever user we have
    const user = authUser || localUser;

    if (user) {
      console.log('✅ User found, updating UI...');
      this.currentUser = user;
      this.updateUIForAuthenticatedUser(user);
    } else {
      console.log('❌ No user found, showing anonymous UI...');
      this.updateUIForAnonymousUser();
    }
  }

  /**
   * Print diagnostic information about auth state
   */
  diagnoseAuthState() {
    console.group('🔍 Authentication State Diagnostics');

    // Check initialization
    console.log('Initialization:', {
      fractionAppAuth: this.initialized,
      authModulesLoaded: this.authModulesLoaded,
      authManager: authManager ? authManager.isInitialized() : 'not loaded'
    });

    // Check users
    const authUser = authManager ? authManager.getCurrentUser() : null;
    console.log('Current Users:', {
      fractionAppAuth: this.currentUser ? {
        email: this.currentUser.email,
        displayName: this.currentUser.displayName,
        photoURL: this.currentUser.photoURL,
        uid: this.currentUser.uid
      } : null,
      authManager: authUser ? {
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        uid: authUser.uid
      } : null
    });

    // Check DOM elements
    const loginBtn = document.getElementById('auth-login-btn');
    const userMenu = document.getElementById('auth-user-menu');
    const displayName = document.getElementById('auth-user-display-name');
    const avatar = document.getElementById('auth-user-avatar');

    console.log('DOM Elements:', {
      loginBtn: loginBtn ? {
        found: true,
        display: loginBtn.style.display,
        visible: loginBtn.offsetParent !== null
      } : { found: false },
      userMenu: userMenu ? {
        found: true,
        display: userMenu.style.display,
        visible: userMenu.offsetParent !== null
      } : { found: false },
      displayName: displayName ? {
        found: true,
        text: displayName.textContent
      } : { found: false },
      avatar: avatar ? {
        found: true,
        src: avatar.src
      } : { found: false }
    });

    // Check Firebase
    if (typeof window.firebase !== 'undefined') {
      const firebaseAuth = window.firebase.auth();
      const firebaseUser = firebaseAuth.currentUser;
      console.log('Firebase Auth:', {
        loaded: true,
        currentUser: firebaseUser ? firebaseUser.email : null
      });
    } else {
      console.log('Firebase Auth: NOT LOADED');
    }

    console.groupEnd();

    // Provide recommendations
    if (this.currentUser || authUser) {
      console.log('💡 User is signed in. Run refreshAuthUI() to update the UI.');
    } else {
      console.log('💡 No user signed in. Click "Sign In" to authenticate.');
    }
  }
}

// Create and export singleton instance
const fractionAppAuth = new FractionAppAuth();

// Make diagnostic functions available in console for debugging
if (typeof window !== 'undefined') {
  window.fractionAppAuth = fractionAppAuth;
  window.diagnoseAuth = () => fractionAppAuth.diagnoseAuthState();
  window.refreshAuthUI = () => fractionAppAuth.forceRefreshUI();

  console.log('🔧 Debug commands available:');
  console.log('  - diagnoseAuth() - Show auth state diagnostics');
  console.log('  - refreshAuthUI() - Force refresh the UI');
}

// Export for use in other modules
export { fractionAppAuth, authManager, authUI };
export default fractionAppAuth;
