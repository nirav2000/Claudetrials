/**
 * Social Authentication Module
 *
 * Handles authentication with Google, Facebook, and Apple
 * using Firebase Authentication providers
 */

import { authProviders, collections, authConfig } from '../config/firebase-config.js';
import { logSuccessfulLogin, logFailedLogin } from './auth-logger.js';

// Access Firebase from global scope (loaded via script tag in HTML)
const firebase = window.firebase;

// Track active popup windows for explicit management
let activePopupWindow = null;
let popupCheckInterval = null;

/**
 * Monitor popup window and close it when auth completes
 * Useful for iOS where Firebase doesn't always close the popup automatically
 */
function monitorPopupWindow(auth) {
  // Clear any existing interval
  if (popupCheckInterval) {
    clearInterval(popupCheckInterval);
  }

  // Check every second if auth completed
  let checkCount = 0;
  popupCheckInterval = setInterval(() => {
    checkCount++;

    // Check if user is now authenticated
    const currentUser = auth.currentUser;

    if (currentUser) {
      console.log('✅ Auth completed, checking popup status...');

      // Try to close the popup if it exists and is still open
      if (activePopupWindow && !activePopupWindow.closed) {
        console.log('🔒 Attempting to close popup window...');
        try {
          activePopupWindow.close();
          console.log('✅ Popup window closed successfully');
        } catch (error) {
          console.warn('⚠️ Could not close popup programmatically:', error.message);
        }

        // Show notification to user in case popup didn't close
        showPopupCloseNotification();
      }

      // Clear the interval
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
      activePopupWindow = null;
    }

    // Stop checking after 60 seconds
    if (checkCount > 60) {
      console.log('⏱️ Popup monitor timed out');
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;

      // Show notification if popup is still open
      if (activePopupWindow && !activePopupWindow.closed) {
        showPopupCloseNotification();
      }
    }
  }, 1000);
}

/**
 * Show notification to user that they can close the popup
 */
function showPopupCloseNotification() {
  // Create a notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    max-width: 90%;
    text-align: center;
  `;
  notification.textContent = '✅ Sign in successful! You can close the sign-in window if it\'s still open.';

  document.body.appendChild(notification);

  // Remove after 8 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 8000);
}

/**
 * Show popup blocker help instructions
 */
function showPopupBlockerHelp() {
  const helpDialog = document.createElement('div');
  helpDialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    padding: 20px;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  content.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #333; font-size: 20px;">
      🚫 Popup Blocked
    </h3>
    <p style="margin: 0 0 16px 0; color: #666; line-height: 1.5;">
      Your browser blocked the sign-in popup. To enable it:
    </p>
    <ol style="margin: 0 0 16px 0; padding-left: 24px; color: #666; line-height: 1.8;">
      <li>Look for a <strong>popup blocked icon</strong> in your browser's address bar</li>
      <li>Click it and select <strong>"Always allow popups"</strong> for this site</li>
      <li>On iPad: Go to <strong>Settings → Safari → Block Pop-ups</strong> and disable it</li>
      <li>Try signing in again</li>
    </ol>
    <button id="popup-help-close" style="
      width: 100%;
      padding: 12px;
      background: #673ab7;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    ">
      Got it
    </button>
  `;

  helpDialog.appendChild(content);
  document.body.appendChild(helpDialog);

  // Close on button click
  content.querySelector('#popup-help-close').addEventListener('click', () => {
    helpDialog.remove();
  });

  // Close on overlay click
  helpDialog.addEventListener('click', (e) => {
    if (e.target === helpDialog) {
      helpDialog.remove();
    }
  });
}

/**
 * Handle redirect result after authentication
 * Should be called on page load to handle redirect flow
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, user: Object, message: string, hadRedirect: boolean }
 */
export async function handleAuthRedirect(auth, db) {
  try {
    console.log('🔍 Checking for redirect result...');
    const result = await auth.getRedirectResult();
    console.log('📋 Redirect result:', result);

    // No redirect result (user didn't just authenticate)
    if (!result || !result.user) {
      console.log('ℹ️ No redirect result found');
      return {
        success: false,
        hadRedirect: false,
        message: 'No redirect result'
      };
    }

    console.log('✅ Redirect result found! User:', result.user.email);

    const user = result.user;
    const credential = result.credential;
    const additionalInfo = result.additionalUserInfo;

    // Determine auth method from credential
    const providerId = credential?.providerId || 'unknown';
    let authMethod = 'unknown';
    if (providerId.includes('google')) authMethod = 'google';
    else if (providerId.includes('facebook')) authMethod = 'facebook';
    else if (providerId.includes('apple')) authMethod = 'apple';

    // Store user data in Firestore
    try {
      await db.collection(collections.users).doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: authMethod,
        providerId: credential?.providerId || 'unknown',
        isNewUser: additionalInfo?.isNewUser || false,
        profile: additionalInfo?.profile || {},
        createdAt: additionalInfo?.isNewUser ? new Date().toISOString() : undefined,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });

      console.log('User data saved to Firestore successfully');
    } catch (firestoreError) {
      console.error('Failed to save user data to Firestore:', firestoreError);
      if (firestoreError.code === 'permission-denied') {
        console.error('⚠️ Firestore permission denied. Please check your Firestore security rules.');
      }
    }

    // Log successful login
    try {
      await logSuccessfulLogin(user, authMethod, db, {
        appName: 'Auth Library',
        isNewUser: additionalInfo?.isNewUser
      });
    } catch (logError) {
      console.warn('Failed to log successful login:', logError);
    }

    return {
      success: true,
      hadRedirect: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: authMethod,
        isNewUser: additionalInfo?.isNewUser
      },
      message: `Successfully signed in with ${authMethod}`
    };

  } catch (error) {
    console.error('Redirect result error:', error);

    // If there's an error, try to log it
    try {
      if (db && error.email) {
        await logFailedLogin(error.email || 'unknown', 'redirect', error.message, db);
      }
    } catch (logError) {
      console.warn('Failed to log error:', logError);
    }

    return {
      success: false,
      hadRedirect: true,
      message: error.message || 'Authentication failed',
      error: error.code
    };
  }
}

/**
 * Sign in with Google
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, user: Object, message: string }
 */
export async function signInWithGoogle(auth, db) {
  if (!authProviders.google.enabled) {
    return {
      success: false,
      message: 'Google authentication is not enabled'
    };
  }

  try {
    // Create Google provider
    const provider = new firebase.auth.GoogleAuthProvider();

    // Add scopes
    authProviders.google.scopes.forEach(scope => {
      provider.addScope(scope);
    });

    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account' // Force account selection
    });

    // Sign in with redirect (same tab) or popup based on config
    let result;
    let popupWindow = null;

    if (authConfig.authMode === 'redirect') {
      // Redirect mode: redirects current tab to Google, then back
      await auth.signInWithRedirect(provider);
      // Function returns here, actual result handled by getRedirectResult() on page load
      return {
        success: true,
        message: 'Redirecting to Google...',
        redirecting: true
      };
    } else {
      // Popup mode: opens popup window with explicit window management for iOS
      console.log('🔓 Opening Google sign-in popup...');

      // Start monitoring for auth state changes to close stuck popups
      monitorPopupWindow(auth);

      // Create a race between the popup auth and a timeout
      const authPromise = auth.signInWithPopup(provider).then(res => {
        // Store popup reference if available
        activePopupWindow = null; // Will be closed by Firebase normally
        return res;
      });

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('POPUP_TIMEOUT'));
        }, 60000); // 60 second timeout
      });

      try {
        result = await Promise.race([authPromise, timeoutPromise]);
        console.log('✅ Popup auth completed successfully');

        // Clear the monitoring interval since auth completed successfully
        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
          popupCheckInterval = null;
        }
      } catch (error) {
        if (error.message === 'POPUP_TIMEOUT') {
          console.warn('⚠️ Popup auth timed out - auth may have completed, checking...');

          // Wait a moment for auth state to update
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check if user is now authenticated
          const currentUser = auth.currentUser;
          if (currentUser) {
            console.log('✅ User is authenticated despite timeout, continuing...');
            // Create a result-like object
            result = {
              user: currentUser,
              credential: null,
              additionalUserInfo: { isNewUser: false }
            };

            // Show notification about stuck popup
            showPopupCloseNotification();
          } else {
            // Still not authenticated, throw the original error
            throw error;
          }
        } else {
          // Not a timeout error, re-throw
          throw error;
        }
      }
    }

    const user = result.user;
    const credential = result.credential;

    // Get additional user info (available directly on result in Firebase v9+)
    const additionalInfo = result.additionalUserInfo;

    // Store user data in Firestore
    try {
      await db.collection(collections.users).doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'google',
        providerId: credential?.providerId || 'google.com',
        isNewUser: additionalInfo?.isNewUser || false,
        profile: additionalInfo?.profile || {},
        createdAt: additionalInfo?.isNewUser ? new Date().toISOString() : undefined,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });

      console.log('User data saved to Firestore successfully');
    } catch (firestoreError) {
      console.error('Failed to save user data to Firestore:', firestoreError);

      // Check if it's a permission error
      if (firestoreError.code === 'permission-denied') {
        console.error('⚠️ Firestore permission denied. Please check your Firestore security rules.');
        console.error('Make sure the rules allow authenticated users to write to their own user document.');
      }

      // Continue with login even if Firestore write fails
      // The user is authenticated in Firebase Auth, just not saved to Firestore
    }

    // Log successful login
    try {
      await logSuccessfulLogin(user, 'google', db, {
        appName: 'Auth Library',
        isNewUser: additionalInfo?.isNewUser
      });
    } catch (logError) {
      console.warn('Failed to log successful login:', logError);
      // Don't fail the entire login if logging fails
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'google',
        isNewUser: additionalInfo?.isNewUser
      },
      message: 'Successfully signed in with Google'
    };

  } catch (error) {
    console.error('Google sign-in error:', error);

    // Clean up monitoring on error
    if (popupCheckInterval) {
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
    }
    activePopupWindow = null;

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Google';
    let showPopupHelp = false;

    if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in is not enabled. Please enable it in Firebase Console under Authentication > Sign-in method > Google';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing authentication';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by your browser. To sign in:\n\n1. Look for a blocked popup icon in your browser\'s address bar\n2. Click it and select "Always allow popups from this site"\n3. Try signing in again';
      showPopupHelp = true;
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled - another sign-in is already in progress';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Add it to Firebase Console under Authentication > Settings > Authorized domains';
    } else if (error.message === 'POPUP_TIMEOUT') {
      errorMessage = 'Sign-in timed out. This may be due to:\n\n1. Slow internet connection\n2. Popup blocker interference\n3. iOS Safari popup restrictions\n\nPlease try again.';
      showPopupHelp = true;
    }

    // Show helpful popup blocker instructions if needed
    if (showPopupHelp) {
      setTimeout(() => {
        showPopupBlockerHelp();
      }, 500);
    }

    // Log failed attempt (if db available)
    try {
      if (db) {
        await logFailedLogin(
          error.email || 'unknown',
          'google',
          error.message,
          db
        );
      }
    } catch (logError) {
      console.warn('Failed to log error:', logError);
    }

    return {
      success: false,
      message: errorMessage,
      error: error.code
    };
  }
}

/**
 * Sign in with Facebook
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, user: Object, message: string }
 */
export async function signInWithFacebook(auth, db) {
  if (!authProviders.facebook.enabled) {
    return {
      success: false,
      message: 'Facebook authentication is not enabled'
    };
  }

  try {
    // Create Facebook provider
    const provider = new firebase.auth.FacebookAuthProvider();

    // Add scopes
    authProviders.facebook.scopes.forEach(scope => {
      provider.addScope(scope);
    });

    // Set custom parameters
    provider.setCustomParameters({
      display: authConfig.authMode === 'redirect' ? 'page' : 'popup'
    });

    // Sign in with redirect (same tab) or popup based on config
    let result;
    if (authConfig.authMode === 'redirect') {
      await auth.signInWithRedirect(provider);
      return {
        success: true,
        message: 'Redirecting to Facebook...',
        redirecting: true
      };
    } else {
      // Popup mode with monitoring for iOS
      console.log('🔓 Opening Facebook sign-in popup...');
      monitorPopupWindow(auth);

      const authPromise = auth.signInWithPopup(provider).then(res => {
        activePopupWindow = null;
        return res;
      });

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('POPUP_TIMEOUT')), 60000);
      });

      try {
        result = await Promise.race([authPromise, timeoutPromise]);
        console.log('✅ Popup auth completed successfully');

        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
          popupCheckInterval = null;
        }
      } catch (error) {
        if (error.message === 'POPUP_TIMEOUT') {
          console.warn('⚠️ Popup auth timed out - checking auth state...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          const currentUser = auth.currentUser;
          if (currentUser) {
            console.log('✅ User is authenticated despite timeout');
            result = {
              user: currentUser,
              credential: null,
              additionalUserInfo: { isNewUser: false }
            };
            showPopupCloseNotification();
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    const user = result.user;
    const credential = result.credential;

    // Get access token (can be used to access Facebook API)
    const accessToken = credential?.accessToken;

    // Get additional user info (available directly on result in Firebase v9+)
    const additionalInfo = result.additionalUserInfo;

    // Store user data in Firestore
    try {
      await db.collection(collections.users).doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'facebook',
        providerId: credential?.providerId || 'facebook.com',
        isNewUser: additionalInfo?.isNewUser || false,
        profile: additionalInfo?.profile || {},
        createdAt: additionalInfo?.isNewUser ? new Date().toISOString() : undefined,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });

      console.log('User data saved to Firestore successfully');
    } catch (firestoreError) {
      console.error('Failed to save user data to Firestore:', firestoreError);
      if (firestoreError.code === 'permission-denied') {
        console.error('⚠️ Firestore permission denied. Please check your Firestore security rules.');
      }
    }

    // Log successful login
    try {
      await logSuccessfulLogin(user, 'facebook', db, {
        appName: 'Auth Library',
        isNewUser: additionalInfo?.isNewUser
      });
    } catch (logError) {
      console.warn('Failed to log successful login:', logError);
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'facebook',
        isNewUser: additionalInfo?.isNewUser
      },
      message: 'Successfully signed in with Facebook'
    };

  } catch (error) {
    console.error('Facebook sign-in error:', error);

    // Clean up monitoring on error
    if (popupCheckInterval) {
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
    }
    activePopupWindow = null;

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Facebook';
    let showPopupHelp = false;

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing authentication';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by your browser. Please allow popups and try again.';
      showPopupHelp = true;
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled - another sign-in is already in progress';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
    } else if (error.message === 'POPUP_TIMEOUT') {
      errorMessage = 'Sign-in timed out. Please try again.';
      showPopupHelp = true;
    }

    if (showPopupHelp) {
      setTimeout(() => showPopupBlockerHelp(), 500);
    }

    // Log failed attempt
    await logFailedLogin(
      error.email || 'unknown',
      'facebook',
      error.message,
      db
    );

    return {
      success: false,
      message: errorMessage,
      error: error.code
    };
  }
}

/**
 * Sign in with Apple
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, user: Object, message: string }
 */
export async function signInWithApple(auth, db) {
  if (!authProviders.apple.enabled) {
    return {
      success: false,
      message: 'Apple authentication is not enabled'
    };
  }

  try {
    // Create Apple provider
    const provider = new firebase.auth.OAuthProvider('apple.com');

    // Add scopes
    authProviders.apple.scopes.forEach(scope => {
      provider.addScope(scope);
    });

    // Set custom parameters
    provider.setCustomParameters({
      locale: navigator.language || 'en'
    });

    // Sign in with redirect (same tab) or popup based on config
    let result;
    if (authConfig.authMode === 'redirect') {
      await auth.signInWithRedirect(provider);
      return {
        success: true,
        message: 'Redirecting to Apple...',
        redirecting: true
      };
    } else {
      // Popup mode with monitoring for iOS
      console.log('🔓 Opening Apple sign-in popup...');
      monitorPopupWindow(auth);

      const authPromise = auth.signInWithPopup(provider).then(res => {
        activePopupWindow = null;
        return res;
      });

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('POPUP_TIMEOUT')), 60000);
      });

      try {
        result = await Promise.race([authPromise, timeoutPromise]);
        console.log('✅ Popup auth completed successfully');

        if (popupCheckInterval) {
          clearInterval(popupCheckInterval);
          popupCheckInterval = null;
        }
      } catch (error) {
        if (error.message === 'POPUP_TIMEOUT') {
          console.warn('⚠️ Popup auth timed out - checking auth state...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          const currentUser = auth.currentUser;
          if (currentUser) {
            console.log('✅ User is authenticated despite timeout');
            result = {
              user: currentUser,
              credential: null,
              additionalUserInfo: { isNewUser: false }
            };
            showPopupCloseNotification();
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    const user = result.user;
    const credential = result.credential;

    // Get additional user info (available directly on result in Firebase v9+)
    const additionalInfo = result.additionalUserInfo;

    // Apple provides user info only on first sign-in
    const displayName = user.displayName ||
                       additionalInfo?.profile?.name ||
                       user.email?.split('@')[0] ||
                       'Apple User';

    // Store user data in Firestore
    try {
      await db.collection(collections.users).doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'apple',
        providerId: credential?.providerId || 'apple.com',
        isNewUser: additionalInfo?.isNewUser || false,
        profile: additionalInfo?.profile || {},
        createdAt: additionalInfo?.isNewUser ? new Date().toISOString() : undefined,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });

      console.log('User data saved to Firestore successfully');
    } catch (firestoreError) {
      console.error('Failed to save user data to Firestore:', firestoreError);
      if (firestoreError.code === 'permission-denied') {
        console.error('⚠️ Firestore permission denied. Please check your Firestore security rules.');
      }
    }

    // Log successful login
    try {
      await logSuccessfulLogin(user, 'apple', db, {
        appName: 'Auth Library',
        isNewUser: additionalInfo?.isNewUser
      });
    } catch (logError) {
      console.warn('Failed to log successful login:', logError);
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        authMethod: 'apple',
        isNewUser: additionalInfo?.isNewUser
      },
      message: 'Successfully signed in with Apple'
    };

  } catch (error) {
    console.error('Apple sign-in error:', error);

    // Clean up monitoring on error
    if (popupCheckInterval) {
      clearInterval(popupCheckInterval);
      popupCheckInterval = null;
    }
    activePopupWindow = null;

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Apple';
    let showPopupHelp = false;

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing authentication';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by your browser. Please allow popups and try again.';
      showPopupHelp = true;
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled - another sign-in is already in progress';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
    } else if (error.message === 'POPUP_TIMEOUT') {
      errorMessage = 'Sign-in timed out. Please try again.';
      showPopupHelp = true;
    }

    if (showPopupHelp) {
      setTimeout(() => showPopupBlockerHelp(), 500);
    }

    // Log failed attempt
    await logFailedLogin(
      error.email || 'unknown',
      'apple',
      error.message,
      db
    );

    return {
      success: false,
      message: errorMessage,
      error: error.code
    };
  }
}

/**
 * Link additional provider to existing account
 * @param {Object} user - Current Firebase user
 * @param {string} providerType - Provider type ('google', 'facebook', 'apple')
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function linkProvider(user, providerType, auth, db) {
  try {
    let provider;

    switch (providerType) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 'apple':
        provider = new firebase.auth.OAuthProvider('apple.com');
        break;
      default:
        return {
          success: false,
          message: 'Invalid provider type'
        };
    }

    // Link with popup
    const result = await user.linkWithPopup(provider);

    // Update user document
    await db.collection(collections.users).doc(user.uid).update({
      linkedProviders: firebase.firestore.FieldValue.arrayUnion(providerType),
      lastUpdatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: `Successfully linked ${providerType} account`
    };

  } catch (error) {
    console.error('Link provider error:', error);

    let errorMessage = `Failed to link ${providerType} account`;

    if (error.code === 'auth/credential-already-in-use') {
      errorMessage = 'This account is already linked to another user';
    } else if (error.code === 'auth/provider-already-linked') {
      errorMessage = 'This provider is already linked to your account';
    }

    return {
      success: false,
      message: errorMessage,
      error: error.code
    };
  }
}

/**
 * Unlink provider from account
 * @param {Object} user - Current Firebase user
 * @param {string} providerId - Provider ID to unlink
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function unlinkProvider(user, providerId, db) {
  try {
    // Check if user has multiple providers
    const providers = user.providerData;

    if (providers.length <= 1) {
      return {
        success: false,
        message: 'Cannot unlink the only authentication method. Link another method first.'
      };
    }

    // Unlink the provider
    await user.unlink(providerId);

    // Update user document
    await db.collection(collections.users).doc(user.uid).update({
      linkedProviders: firebase.firestore.FieldValue.arrayRemove(providerId.split('.')[0]),
      lastUpdatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Provider unlinked successfully'
    };

  } catch (error) {
    console.error('Unlink provider error:', error);

    return {
      success: false,
      message: 'Failed to unlink provider',
      error: error.code
    };
  }
}
