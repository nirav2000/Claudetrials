/**
 * Passwordless Email Authentication
 *
 * Implements email-based authentication using verification codes
 * No passwords required - users receive a code via email
 */

import { authProviders, collections } from '../config/firebase-config.js';
import { validateEmail, validateCode, checkRateLimit, clearRateLimit } from '../utils/validation.js';
import { logSuccessfulLogin, logFailedLogin } from './auth-logger.js';

/**
 * Generate a random verification code
 * @param {number} length - Code length
 * @returns {string} Verification code
 */
function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

/**
 * Send verification code to email
 * @param {string} email - User email address
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function sendVerificationCode(email, db) {
  try {
    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.error
      };
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(email, 5, 900000); // 5 attempts per 15 minutes
    if (!rateLimit.allowed) {
      return {
        success: false,
        message: rateLimit.message
      };
    }

    // Generate verification code
    const code = generateVerificationCode(authProviders.email.codeLength);
    const expiresAt = Date.now() + authProviders.email.codeExpiry;

    // Store code in Firestore
    await db.collection(collections.emailCodes).add({
      email: email.toLowerCase(),
      code: code,
      createdAt: Date.now(),
      expiresAt: expiresAt,
      used: false,
      attempts: 0
    });

    // In a real application, you would send an email here
    // For now, we'll log it to console (DEVELOPMENT ONLY)
    console.log(`Verification code for ${email}: ${code}`);
    console.log('Expires in 10 minutes');

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // await sendEmailViaService(email, code);

    return {
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: authProviders.email.codeExpiry / 1000, // seconds
      // In production, remove this line:
      devCode: code // REMOVE IN PRODUCTION
    };

  } catch (error) {
    console.error('Failed to send verification code:', error);

    let errorMessage = 'Failed to send verification code. ';

    if (error.code === 'permission-denied' || error.message.includes('permission')) {
      errorMessage += 'Firestore database not enabled. Please enable Firestore in Firebase Console.';
    } else if (error.code === 'unavailable') {
      errorMessage += 'Firestore database unavailable. Check your Firebase project setup.';
    } else {
      errorMessage += 'Please try again or check Firebase Console.';
    }

    return {
      success: false,
      message: errorMessage,
      error: error.code || error.message
    };
  }
}

/**
 * Verify email code and sign in user
 * @param {string} email - User email address
 * @param {string} code - Verification code
 * @param {Object} auth - Firebase Auth instance
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, user: Object, message: string }
 */
export async function verifyCodeAndSignIn(email, code, auth, db) {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        message: emailValidation.error
      };
    }

    const codeValidation = validateCode(code, authProviders.email.codeLength);
    if (!codeValidation.isValid) {
      return {
        success: false,
        message: codeValidation.error
      };
    }

    // Check rate limiting on verification attempts
    const rateLimit = checkRateLimit(`verify_${email}`, 10, 900000); // 10 attempts per 15 minutes
    if (!rateLimit.allowed) {
      await logFailedLogin(email, 'email', 'Rate limit exceeded', db);
      return {
        success: false,
        message: rateLimit.message
      };
    }

    // Find the verification code in Firestore
    const snapshot = await db
      .collection(collections.emailCodes)
      .where('email', '==', email.toLowerCase())
      .where('used', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      await logFailedLogin(email, 'email', 'No verification code found', db);
      return {
        success: false,
        message: 'No verification code found. Please request a new code.'
      };
    }

    const codeDoc = snapshot.docs[0];
    const codeData = codeDoc.data();

    // Check if code has expired
    if (Date.now() > codeData.expiresAt) {
      await codeDoc.ref.update({ used: true }); // Mark as used to prevent reuse
      await logFailedLogin(email, 'email', 'Code expired', db);
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      };
    }

    // Check max attempts
    if (codeData.attempts >= 5) {
      await codeDoc.ref.update({ used: true });
      await logFailedLogin(email, 'email', 'Too many attempts', db);
      return {
        success: false,
        message: 'Too many verification attempts. Please request a new code.'
      };
    }

    // Verify the code
    if (codeData.code !== codeValidation.cleanCode) {
      // Increment attempts
      await codeDoc.ref.update({
        attempts: codeData.attempts + 1
      });

      await logFailedLogin(email, 'email', 'Invalid code', db);

      return {
        success: false,
        message: `Invalid verification code. ${4 - codeData.attempts} attempts remaining.`
      };
    }

    // Code is valid - mark as used
    await codeDoc.ref.update({ used: true });

    // Create custom token for Firebase Auth
    // Note: This requires Firebase Admin SDK on the backend
    // For client-side only, we'll use a workaround with anonymous auth + linking

    try {
      // Sign in anonymously first
      let userCredential = await auth.signInAnonymously();
      let user = userCredential.user;

      // Update user profile with email
      await user.updateProfile({
        displayName: email.split('@')[0], // Use email username as display name
      });

      // Store email in Firestore user document
      await db.collection(collections.users).doc(user.uid).set({
        email: email.toLowerCase(),
        emailVerified: true,
        authMethod: 'email',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        displayName: email.split('@')[0]
      }, { merge: true });

      // Clear rate limits
      clearRateLimit(email);
      clearRateLimit(`verify_${email}`);

      // Log successful login
      await logSuccessfulLogin(user, 'email', db, {
        appName: 'Auth Library',
        sessionId: `session_${Date.now()}`
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: email,
          displayName: email.split('@')[0],
          emailVerified: true,
          authMethod: 'email'
        },
        message: 'Successfully signed in'
      };

    } catch (authError) {
      console.error('Firebase Auth error:', authError);
      await logFailedLogin(email, 'email', authError.message, db);

      return {
        success: false,
        message: 'Authentication failed. Please try again.'
      };
    }

  } catch (error) {
    console.error('Failed to verify code:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.'
    };
  }
}

/**
 * Request a new verification code (resend)
 * @param {string} email - User email address
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function resendVerificationCode(email, db) {
  try {
    // Check rate limiting on resend
    const rateLimit = checkRateLimit(`resend_${email}`, 3, authProviders.email.resendDelay);
    if (!rateLimit.allowed) {
      return {
        success: false,
        message: `Please wait ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds before requesting a new code.`
      };
    }

    // Invalidate all previous codes for this email
    const snapshot = await db
      .collection(collections.emailCodes)
      .where('email', '==', email.toLowerCase())
      .where('used', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { used: true });
    });
    await batch.commit();

    // Send new code
    return await sendVerificationCode(email, db);

  } catch (error) {
    console.error('Failed to resend code:', error);
    return {
      success: false,
      message: 'Failed to resend verification code. Please try again.'
    };
  }
}

/**
 * Clean up expired verification codes (maintenance function)
 * @param {Object} db - Firestore database instance
 * @returns {Promise<number>} Number of codes deleted
 */
export async function cleanupExpiredCodes(db) {
  try {
    const now = Date.now();
    const snapshot = await db
      .collection(collections.emailCodes)
      .where('expiresAt', '<', now)
      .get();

    if (snapshot.empty) {
      return 0;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log(`Cleaned up ${snapshot.docs.length} expired codes`);
    return snapshot.docs.length;

  } catch (error) {
    console.error('Failed to cleanup expired codes:', error);
    return 0;
  }
}
