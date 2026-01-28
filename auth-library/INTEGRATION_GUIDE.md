# Integration Guide

Complete guide for integrating the Authentication Library into your applications.

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Integration with Fraction Worksheets App](#integration-with-fraction-worksheets-app)
3. [Advanced Integration](#advanced-integration)
4. [User Profile Management](#user-profile-management)
5. [Protected Routes](#protected-routes)
6. [Testing](#testing)

---

## Basic Integration

### Step 1: Include Dependencies

Add to your HTML `<head>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Auth Library Styles -->
<link rel="stylesheet" href="auth-library/styles/auth-styles.css">
```

### Step 2: Configure Firebase

Update `auth-library/config/firebase-config.js` with your Firebase project credentials.

### Step 3: Initialize and Use

Create an `auth-integration.js` file:

```javascript
import { authManager, authUI } from './auth-library/index.js';

// Initialize on page load
async function initAuth() {
  try {
    await authManager.initialize();
    console.log('Auth initialized');

    // Listen for auth state changes
    authManager.on('authStateChanged', (user) => {
      if (user) {
        console.log('User signed in:', user);
        updateUIForAuthenticatedUser(user);
      } else {
        console.log('User signed out');
        updateUIForAnonymousUser();
      }
    });

    // Check if already signed in
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
      updateUIForAuthenticatedUser(currentUser);
    } else {
      updateUIForAnonymousUser();
    }

  } catch (error) {
    console.error('Failed to initialize auth:', error);
  }
}

// Update UI for authenticated users
function updateUIForAuthenticatedUser(user) {
  // Hide login button, show logout button
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'block';

  // Show user info
  document.getElementById('user-name').textContent = user.displayName || user.email;
  document.getElementById('user-email').textContent = user.email;

  // Show protected content
  document.getElementById('protected-content').style.display = 'block';
}

// Update UI for anonymous users
function updateUIForAnonymousUser() {
  // Show login button, hide logout button
  document.getElementById('login-btn').style.display = 'block';
  document.getElementById('logout-btn').style.display = 'none';

  // Hide protected content
  document.getElementById('protected-content').style.display = 'none';
}

// Login button click
document.getElementById('login-btn').addEventListener('click', () => {
  authUI.show({
    title: 'Welcome Back',
    onSuccess: async (user) => {
      console.log('Login successful:', user);

      // Get login history
      const history = await authManager.getLoginHistory(10);
      console.log('Recent logins:', history);

      // Check for suspicious activity
      const suspicious = await authManager.checkSuspiciousActivity();
      if (suspicious.suspicious) {
        alert('Warning: Suspicious activity detected on your account');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
});

// Logout button click
document.getElementById('logout-btn').addEventListener('click', async () => {
  const result = await authManager.signOut();
  if (result.success) {
    console.log('Logged out successfully');
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

export { authManager, authUI };
```

### Step 4: Add HTML Elements

```html
<body>
  <!-- Login/Logout Buttons -->
  <button id="login-btn" style="display: block;">Sign In</button>
  <button id="logout-btn" style="display: none;">Sign Out</button>

  <!-- User Info (hidden by default) -->
  <div id="user-info" style="display: none;">
    <p>Welcome, <span id="user-name"></span></p>
    <p>Email: <span id="user-email"></span></p>
  </div>

  <!-- Protected Content -->
  <div id="protected-content" style="display: none;">
    <h2>Protected Content</h2>
    <p>This is only visible to authenticated users.</p>
  </div>

  <!-- Include your auth integration -->
  <script type="module" src="auth-integration.js"></script>
</body>
```

---

## Integration with Fraction Worksheets App

### Step 1: Add Auth to Main App

Modify `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fraction Comparison Practice</title>

  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

  <!-- Existing CSS -->
  <link rel="stylesheet" href="css/layout/base.css">
  <!-- ... other CSS files ... -->

  <!-- Auth Library Styles -->
  <link rel="stylesheet" href="auth-library/styles/auth-styles.css">
</head>
<body>
  <!-- Add user menu in header -->
  <header class="app-header">
    <h1>Fraction Comparison Practice</h1>

    <!-- User Menu -->
    <div class="user-menu">
      <button id="user-menu-btn" class="icon-btn" style="display: none;">
        <img id="user-avatar" src="" alt="User" class="user-avatar">
        <span id="user-display-name"></span>
      </button>
      <button id="login-btn" class="icon-btn">Sign In</button>
    </div>
  </header>

  <!-- Existing app content -->
  <!-- ... -->

  <!-- Auth Integration -->
  <script type="module" src="js/auth-integration.js"></script>

  <!-- Existing app scripts -->
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

### Step 2: Create Auth Integration Module

Create `js/auth-integration.js`:

```javascript
import { authManager, authUI } from '../auth-library/index.js';

class FractionAppAuth {
  constructor() {
    this.currentUser = null;
  }

  async initialize() {
    try {
      // Initialize auth manager
      await authManager.initialize();

      // Listen for auth state changes
      authManager.on('authStateChanged', (user) => {
        this.currentUser = user;
        this.updateUI(user);

        // Save user progress if signed in
        if (user) {
          this.loadUserProgress(user.uid);
        }
      });

      // Set up event listeners
      this.setupEventListeners();

      console.log('Auth integration initialized');

    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }

  setupEventListeners() {
    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        authUI.show({
          title: 'Sign In to Save Progress',
          onSuccess: (user) => {
            console.log('Login successful:', user);
            this.onLoginSuccess(user);
          },
          onError: (error) => {
            console.error('Login failed:', error);
          }
        });
      });
    }

    // User menu button
    const userMenuBtn = document.getElementById('user-menu-btn');
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', () => {
        this.showUserMenu();
      });
    }
  }

  updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar');

    if (user) {
      // User is signed in
      loginBtn.style.display = 'none';
      userMenuBtn.style.display = 'flex';
      userDisplayName.textContent = user.displayName || user.email?.split('@')[0] || 'User';

      if (user.photoURL) {
        userAvatar.src = user.photoURL;
      } else {
        // Use placeholder avatar
        userAvatar.src = this.generateAvatarURL(user.email || 'user');
      }

    } else {
      // User is signed out
      loginBtn.style.display = 'block';
      userMenuBtn.style.display = 'none';
    }
  }

  async onLoginSuccess(user) {
    // Load user's saved progress
    await this.loadUserProgress(user.uid);

    // Show welcome message
    this.showNotification(`Welcome back, ${user.displayName || 'User'}!`);

    // Check for suspicious activity
    const suspicious = await authManager.checkSuspiciousActivity();
    if (suspicious.suspicious) {
      this.showNotification('⚠️ Suspicious activity detected on your account', 'warning');
    }
  }

  async loadUserProgress(userId) {
    try {
      const result = await authManager.getUserData(userId);

      if (result.success && result.data.progress) {
        // Load saved worksheet progress
        const progress = result.data.progress;
        console.log('Loaded user progress:', progress);

        // Apply progress to app
        // (Integrate with your existing app state management)
      }

    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  }

  async saveUserProgress(progressData) {
    if (!this.currentUser) {
      console.log('Not signed in, progress not saved');
      return;
    }

    try {
      // Save progress to Firestore
      const db = authManager.db;
      await db.collection('users').doc(this.currentUser.uid).update({
        progress: progressData,
        lastUpdatedAt: new Date().toISOString()
      });

      console.log('Progress saved');

    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  showUserMenu() {
    // Create user menu modal
    const menu = document.createElement('div');
    menu.className = 'user-menu-modal';
    menu.innerHTML = `
      <div class="user-menu-content">
        <h3>Account</h3>
        <p>${this.currentUser.email}</p>
        <button id="view-history-btn" class="menu-btn">Login History</button>
        <button id="logout-btn" class="menu-btn">Sign Out</button>
        <button id="close-menu-btn" class="menu-btn">Close</button>
      </div>
    `;

    document.body.appendChild(menu);

    // Event listeners
    menu.querySelector('#logout-btn').addEventListener('click', async () => {
      await authManager.signOut();
      menu.remove();
    });

    menu.querySelector('#view-history-btn').addEventListener('click', async () => {
      await this.showLoginHistory();
    });

    menu.querySelector('#close-menu-btn').addEventListener('click', () => {
      menu.remove();
    });

    // Close on outside click
    menu.addEventListener('click', (e) => {
      if (e.target === menu) {
        menu.remove();
      }
    });
  }

  async showLoginHistory() {
    const history = await authManager.getLoginHistory(20);

    // Create history modal
    const modal = document.createElement('div');
    modal.className = 'auth-modal-overlay';
    modal.innerHTML = `
      <div class="auth-modal">
        <button class="auth-modal-close">&times;</button>
        <div class="auth-modal-content">
          <h2>Login History</h2>
          <div class="login-history-list">
            ${history.map(log => `
              <div class="login-history-item">
                <div class="login-method">${log.authMethod}</div>
                <div class="login-time">${new Date(log.timestamp).toLocaleString()}</div>
                <div class="login-location">${log.location?.city || 'Unknown'}, ${log.location?.country || 'Unknown'}</div>
                <div class="login-device">${log.deviceInfo?.browser || 'Unknown'} on ${log.deviceInfo?.os || 'Unknown'}</div>
                <div class="login-ip">IP: ${log.ipAddress}</div>
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
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  generateAvatarURL(email) {
    // Generate a simple avatar using UI Avatars
    const name = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=673ab7&color=fff&size=40`;
  }
}

// Initialize and export
const fractionAppAuth = new FractionAppAuth();
fractionAppAuth.initialize();

export { fractionAppAuth, authManager, authUI };
```

### Step 3: Add Styles

Add to your CSS (or create `css/components/auth-integration.css`):

```css
/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu-modal {
  position: fixed;
  top: 60px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1000;
}

.menu-btn {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.menu-btn:hover {
  background: #e0e0e0;
}

/* Login History */
.login-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.login-history-item {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.login-history-item:last-child {
  border-bottom: none;
}

.login-method {
  font-weight: 600;
  text-transform: capitalize;
  color: #673ab7;
}

.login-time {
  color: #666;
  margin-top: 4px;
}

.login-location,
.login-device,
.login-ip {
  color: #999;
  font-size: 12px;
  margin-top: 2px;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  transform: translateX(400px);
  transition: transform 0.3s ease;
}

.notification.show {
  transform: translateX(0);
}

.notification-success {
  border-left: 4px solid #4caf50;
}

.notification-warning {
  border-left: 4px solid #ff9800;
}
```

---

## Advanced Integration

### Saving User Progress

```javascript
// In your app.js, after user completes a worksheet
import { fractionAppAuth } from './auth-integration.js';

function onWorksheetComplete(results) {
  // Save to local storage as before
  localStorage.setItem('lastResults', JSON.stringify(results));

  // Also save to cloud if user is signed in
  if (fractionAppAuth.currentUser) {
    fractionAppAuth.saveUserProgress({
      lastWorksheet: results,
      completedAt: new Date().toISOString(),
      score: results.score,
      totalProblems: results.total
    });
  }
}
```

### Protected Features

```javascript
function showAdvancedFeatures() {
  if (!authManager.isAuthenticated()) {
    authUI.show({
      title: 'Sign In Required',
      onSuccess: () => {
        // Show features after login
        displayAdvancedFeatures();
      }
    });
    return;
  }

  displayAdvancedFeatures();
}
```

---

## User Profile Management

```javascript
// Update user profile
async function updateUserProfile(displayName, photoURL) {
  const result = await authManager.updateProfile({
    displayName,
    photoURL
  });

  if (result.success) {
    console.log('Profile updated');
  }
}

// Get user data
async function getUserProfile() {
  const result = await authManager.getUserData();

  if (result.success) {
    console.log('User data:', result.data);
    return result.data;
  }
}
```

---

## Protected Routes

For single-page apps with routing:

```javascript
function requireAuth(routeHandler) {
  return async (...args) => {
    if (!authManager.isAuthenticated()) {
      authUI.show({
        title: 'Sign In Required',
        onSuccess: () => {
          routeHandler(...args);
        }
      });
      return;
    }

    await routeHandler(...args);
  };
}

// Usage
router.add('/dashboard', requireAuth(showDashboard));
router.add('/settings', requireAuth(showSettings));
```

---

## Testing

### Testing Email Authentication

1. Start your app
2. Click "Sign In"
3. Enter your email
4. Check console for verification code (development mode)
5. Enter the code
6. Check Firestore for login log

### Testing Social Authentication

1. Configure providers in Firebase Console
2. Add test users
3. Click social login buttons
4. Verify login logs in Firestore

### Testing Login Logging

```javascript
// Get login history
const history = await authManager.getLoginHistory();
console.table(history);

// Check for suspicious activity
const suspicious = await authManager.checkSuspiciousActivity();
console.log('Suspicious:', suspicious);
```

---

## Next Steps

1. Configure Firebase project
2. Enable authentication providers
3. Set up Firestore security rules
4. Integrate email service for production
5. Customize UI to match your app
6. Add user profile features
7. Implement data syncing

For more information, see the [README.md](README.md) file.
