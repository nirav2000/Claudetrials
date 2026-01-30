/**
 * Authentication Manager
 *
 * Main orchestrator for all authentication methods
 * Provides a unified interface for the entire auth library
 */

import { firebaseConfig, authConfig, collections } from '../config/firebase-config.js';
import { signInWithGoogle, signInWithFacebook, signInWithApple, linkProvider, unlinkProvider, handleAuthRedirect } from './social-auth.js';
import { sendVerificationCode, verifyCodeAndSignIn, resendVerificationCode, cleanupExpiredCodes } from './email-auth.js';
import { logLogout, getUserLoginHistory, detectSuspiciousActivity } from './auth-logger.js';

// Access Firebase from global scope (loaded via script tag in HTML)
const firebase = window.firebase;

/**
 * Auth Manager Class
 * Central authentication manager for the library
 */
export class AuthManager {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.listeners = [];
    this.initialized = false;
  }

  /**
   * Initialize Firebase and Auth
   * @param {Object} customConfig - Optional custom Firebase config
   * @returns {Promise<void>}
   */
  async initialize(customConfig = null) {
    if (this.initialized) {
      console.warn('AuthManager already initialized');
      return;
    }

    try {
      // Check if Firebase is loaded
      if (typeof window.firebase === 'undefined') {
        throw new Error('Firebase SDK not loaded. Please include Firebase scripts.');
      }

      // Initialize Firebase
      const config = customConfig || firebaseConfig;

      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }

      // Get Auth and Firestore instances
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      // Set up auth state observer
      this.auth.onAuthStateChanged(user => {
        this.currentUser = user;
        this._notifyListeners('authStateChanged', user);

        // Update last seen timestamp
        // Use set with merge:true to avoid errors when document doesn't exist yet
        if (user) {
          this.db.collection(collections.users).doc(user.uid).set({
            lastSeenAt: new Date().toISOString()
          }, { merge: true }).catch(err => console.error('Failed to update last seen:', err));
        }
      });

      // Set session persistence
      if (authConfig.persistSession) {
        await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      }

      // Handle redirect result (if user just authenticated via redirect)
      if (authConfig.authMode === 'redirect') {
        const redirectResult = await handleAuthRedirect(this.auth, this.db);
        if (redirectResult.hadRedirect && redirectResult.success) {
          console.log('✅ Redirect authentication successful:', redirectResult.user.email);
          // Notify listeners that redirect auth completed
          this._notifyListeners('redirectAuthComplete', redirectResult.user);
        } else if (redirectResult.hadRedirect && !redirectResult.success) {
          console.error('❌ Redirect authentication failed:', redirectResult.message);
          this._notifyListeners('redirectAuthError', redirectResult.error);
        }
      }

      // Start periodic cleanup of expired codes (every hour)
      setInterval(() => {
        cleanupExpiredCodes(this.db);
      }, 3600000);

      this.initialized = true;
      console.log('AuthManager initialized successfully');

    } catch (error) {
      console.error('Failed to initialize AuthManager:', error);
      throw error;
    }
  }

  /**
   * Check if manager is initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // ==================== Social Authentication ====================

  /**
   * Sign in with Google
   * @returns {Promise<Object>}
   */
  async signInWithGoogle() {
    this._ensureInitialized();
    return await signInWithGoogle(this.auth, this.db);
  }

  /**
   * Sign in with Facebook
   * @returns {Promise<Object>}
   */
  async signInWithFacebook() {
    this._ensureInitialized();
    return await signInWithFacebook(this.auth, this.db);
  }

  /**
   * Sign in with Apple
   * @returns {Promise<Object>}
   */
  async signInWithApple() {
    this._ensureInitialized();
    return await signInWithApple(this.auth, this.db);
  }

  // ==================== Email Authentication ====================

  /**
   * Send verification code to email
   * @param {string} email - User email
   * @returns {Promise<Object>}
   */
  async sendEmailCode(email) {
    this._ensureInitialized();
    return await sendVerificationCode(email, this.db);
  }

  /**
   * Verify email code and sign in
   * @param {string} email - User email
   * @param {string} code - Verification code
   * @returns {Promise<Object>}
   */
  async verifyEmailCode(email, code) {
    this._ensureInitialized();
    return await verifyCodeAndSignIn(email, code, this.auth, this.db);
  }

  /**
   * Resend verification code
   * @param {string} email - User email
   * @returns {Promise<Object>}
   */
  async resendEmailCode(email) {
    this._ensureInitialized();
    return await resendVerificationCode(email, this.db);
  }

  // ==================== Account Management ====================

  /**
   * Link additional provider to current account
   * @param {string} providerType - Provider type ('google', 'facebook', 'apple')
   * @returns {Promise<Object>}
   */
  async linkProvider(providerType) {
    this._ensureInitialized();
    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user is currently signed in'
      };
    }
    return await linkProvider(this.currentUser, providerType, this.auth, this.db);
  }

  /**
   * Unlink provider from current account
   * @param {string} providerId - Provider ID (e.g., 'google.com')
   * @returns {Promise<Object>}
   */
  async unlinkProvider(providerId) {
    this._ensureInitialized();
    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user is currently signed in'
      };
    }
    return await unlinkProvider(this.currentUser, providerId, this.db);
  }

  /**
   * Update user profile
   * @param {Object} profile - Profile data { displayName, photoURL }
   * @returns {Promise<Object>}
   */
  async updateProfile(profile) {
    this._ensureInitialized();

    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user is currently signed in'
      };
    }

    try {
      // Update Firebase Auth profile
      await this.currentUser.updateProfile(profile);

      // Update Firestore document
      await this.db.collection(collections.users).doc(this.currentUser.uid).update({
        ...profile,
        lastUpdatedAt: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Profile updated successfully'
      };

    } catch (error) {
      console.error('Failed to update profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message
      };
    }
  }

  /**
   * Get user data from Firestore
   * @param {string} userId - User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>}
   */
  async getUserData(userId = null) {
    this._ensureInitialized();

    const uid = userId || this.currentUser?.uid;

    if (!uid) {
      return {
        success: false,
        message: 'No user ID provided'
      };
    }

    try {
      const doc = await this.db.collection(collections.users).doc(uid).get();

      if (!doc.exists) {
        return {
          success: false,
          message: 'User data not found'
        };
      }

      return {
        success: true,
        data: doc.data()
      };

    } catch (error) {
      console.error('Failed to get user data:', error);
      return {
        success: false,
        message: 'Failed to retrieve user data',
        error: error.message
      };
    }
  }

  /**
   * Delete user account
   * @returns {Promise<Object>}
   */
  async deleteAccount() {
    this._ensureInitialized();

    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user is currently signed in'
      };
    }

    try {
      const uid = this.currentUser.uid;

      // Delete Firestore documents
      await this.db.collection(collections.users).doc(uid).delete();

      // Delete Firebase Auth account
      await this.currentUser.delete();

      return {
        success: true,
        message: 'Account deleted successfully'
      };

    } catch (error) {
      console.error('Failed to delete account:', error);

      let errorMessage = 'Failed to delete account';

      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign in again to delete your account';
      }

      return {
        success: false,
        message: errorMessage,
        error: error.code
      };
    }
  }

  // ==================== Session Management ====================

  /**
   * Sign out current user
   * @returns {Promise<Object>}
   */
  async signOut() {
    this._ensureInitialized();

    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user is currently signed in'
      };
    }

    try {
      const uid = this.currentUser.uid;

      // Log the logout
      await logLogout(uid, this.db);

      // Sign out from Firebase
      await this.auth.signOut();

      return {
        success: true,
        message: 'Signed out successfully'
      };

    } catch (error) {
      console.error('Failed to sign out:', error);
      return {
        success: false,
        message: 'Failed to sign out',
        error: error.message
      };
    }
  }

  /**
   * Refresh current user token
   * @returns {Promise<string>} ID token
   */
  async refreshToken() {
    this._ensureInitialized();

    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      const token = await this.currentUser.getIdToken(true);
      return token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  // ==================== Security & Logging ====================

  /**
   * Get login history for current user
   * @param {number} limit - Number of records to retrieve
   * @returns {Promise<Array>}
   */
  async getLoginHistory(limit = 50) {
    this._ensureInitialized();

    if (!this.currentUser) {
      return [];
    }

    return await getUserLoginHistory(this.currentUser.uid, this.db, limit);
  }

  /**
   * Check for suspicious activity
   * @returns {Promise<Object>}
   */
  async checkSuspiciousActivity() {
    this._ensureInitialized();

    if (!this.currentUser) {
      return { suspicious: false };
    }

    return await detectSuspiciousActivity(this.currentUser.uid, this.db);
  }

  // ==================== Event Listeners ====================

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    const listener = { event, callback };
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  _notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error('Listener error:', error);
        }
      });
  }

  /**
   * Ensure manager is initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.initialized) {
      throw new Error('AuthManager not initialized. Call initialize() first.');
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager();

// Export class for custom instances
export default AuthManager;
