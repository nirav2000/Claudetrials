/**
 * Social Authentication Module
 *
 * Handles authentication with Google, Facebook, and Apple
 * using Firebase Authentication providers
 */

import { authProviders, collections } from '../config/firebase-config.js';
import { logSuccessfulLogin, logFailedLogin } from './auth-logger.js';

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

    // Sign in with popup
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    const credential = result.credential;

    // Get additional user info
    const additionalInfo = firebase.auth.getAdditionalUserInfo(result);

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

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Google';

    if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in is not enabled. Please enable it in Firebase Console under Authentication > Sign-in method > Google';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by browser. Please allow pop-ups and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Add it to Firebase Console under Authentication > Settings > Authorized domains';
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
      display: 'popup'
    });

    // Sign in with popup
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    const credential = result.credential;

    // Get access token (can be used to access Facebook API)
    const accessToken = credential?.accessToken;

    // Get additional user info
    const additionalInfo = firebase.auth.getAdditionalUserInfo(result);

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

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Facebook';

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by browser. Please allow pop-ups and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
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

    // Sign in with popup
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    const credential = result.credential;

    // Get additional user info
    const additionalInfo = firebase.auth.getAdditionalUserInfo(result);

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

    // Handle specific errors
    let errorMessage = 'Failed to sign in with Apple';

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked by browser. Please allow pop-ups and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method';
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
