/**
 * Authentication Library Main Export
 *
 * Standalone authentication library with social login and passwordless email auth
 * Can be integrated into any web application
 *
 * @author Your Name
 * @version 1.0.0
 * @license MIT
 */

// Core Authentication
import { authManager as authManagerInstance } from './core/auth-manager.js';
import { authUI as authUIInstance } from './ui/auth-ui.js';

export { AuthManager, authManager } from './core/auth-manager.js';
export { signInWithGoogle, signInWithFacebook, signInWithApple, linkProvider, unlinkProvider, handleAuthRedirect } from './core/social-auth.js';
export { sendVerificationCode, verifyCodeAndSignIn, resendVerificationCode, cleanupExpiredCodes } from './core/email-auth.js';
export {
  logAuthAttempt,
  logSuccessfulLogin,
  logFailedLogin,
  logLogout,
  getUserLoginHistory,
  detectSuspiciousActivity
} from './core/auth-logger.js';

// UI Components
export { AuthUI, authUI } from './ui/auth-ui.js';

// Utilities
export { getUserIP, getDeviceInfo, getLocationFromIP } from './utils/ip-service.js';
export {
  validateEmail,
  validateCode,
  validateDisplayName,
  checkRateLimit,
  clearRateLimit,
  sanitizeInput
} from './utils/validation.js';

// Configuration
export {
  firebaseConfig,
  authProviders,
  authConfig,
  collections
} from './config/firebase-config.js';

/**
 * Quick Setup Function
 *
 * Simplifies initialization for basic use cases
 *
 * @param {Object} config - Firebase configuration
 * @param {Object} options - Auth options
 * @returns {Promise<Object>} { authManager, authUI }
 *
 * @example
 * import { quickSetup } from './auth-library/index.js';
 *
 * const { authManager, authUI } = await quickSetup({
 *   apiKey: "YOUR_API_KEY",
 *   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
 *   projectId: "YOUR_PROJECT_ID",
 *   // ... other Firebase config
 * });
 *
 * // Show login modal
 * authUI.show({
 *   onSuccess: (user) => console.log('Signed in:', user)
 * });
 */
export async function quickSetup(config, options = {}) {
  const { authManager } = await import('./core/auth-manager.js');
  const { authUI } = await import('./ui/auth-ui.js');

  // Initialize auth manager with custom config
  await authManager.initialize(config);

  // Apply custom options
  if (options.onAuthStateChanged) {
    authManager.on('authStateChanged', options.onAuthStateChanged);
  }

  return {
    authManager,
    authUI
  };
}

/**
 * Version Information
 */
export const version = '1.0.0';

/**
 * Library Information
 */
export const info = {
  name: 'Authentication Library',
  version: '1.0.0',
  description: 'Comprehensive authentication library with social login and passwordless email auth',
  author: 'Your Name',
  license: 'MIT',
  features: [
    'Google, Facebook, and Apple sign-in',
    'Passwordless email authentication',
    'Comprehensive login logging with IP, device, and location tracking',
    'Rate limiting and security features',
    'Modern, accessible UI',
    'Suspicious activity detection',
    'Session management',
    'Account linking and unlinking'
  ],
  dependencies: {
    firebase: '>=9.0.0',
    browser: 'Modern browsers with ES6 module support'
  }
};

/**
 * Default Export
 */
export default {
  authManager: authManagerInstance,
  authUI: authUIInstance,
  quickSetup,
  version,
  info
};
