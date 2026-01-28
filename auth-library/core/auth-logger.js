/**
 * Authentication Logger
 *
 * Logs all authentication attempts to Firebase Firestore
 * Includes IP address, device info, timestamp, and authentication method
 */

import { collections, authConfig } from '../config/firebase-config.js';
import { getUserIP, getDeviceInfo, getLocationFromIP } from '../utils/ip-service.js';

/**
 * Log authentication attempt to Firebase
 * @param {Object} logData - Authentication log data
 * @param {Object} db - Firestore database instance
 * @returns {Promise<void>}
 */
export async function logAuthAttempt(logData, db) {
  try {
    // Get IP address
    const ip = await getUserIP();

    // Get device information
    const deviceInfo = authConfig.includeDeviceInfo ? getDeviceInfo() : {};

    // Get location from IP (optional, can be slow)
    let location = null;
    if (authConfig.includeDeviceInfo && ip !== 'unknown') {
      location = await getLocationFromIP(ip);
    }

    // Create log entry
    const logEntry = {
      userId: logData.userId || null,
      email: logData.email || null,
      authMethod: logData.authMethod, // 'google', 'facebook', 'apple', 'email'
      status: logData.status, // 'success', 'failure', 'pending'
      errorMessage: logData.errorMessage || null,

      // Network Information
      ipAddress: ip,
      location: location,

      // Device Information
      deviceInfo: deviceInfo,

      // Timestamps
      timestamp: new Date().toISOString(),
      timestampMs: Date.now(),

      // Additional metadata
      sessionId: logData.sessionId || generateSessionId(),
      appVersion: logData.appVersion || 'unknown',
      appName: logData.appName || 'unknown'
    };

    // Add to Firestore
    await db.collection(collections.loginLogs).add(logEntry);

    console.log('Authentication attempt logged successfully');

  } catch (error) {
    console.error('Failed to log authentication attempt:', error);
    // Don't throw - logging failures shouldn't prevent authentication
  }
}

/**
 * Log successful login
 * @param {Object} user - User object from Firebase Auth
 * @param {string} authMethod - Authentication method used
 * @param {Object} db - Firestore database instance
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<void>}
 */
export async function logSuccessfulLogin(user, authMethod, db, metadata = {}) {
  await logAuthAttempt({
    userId: user.uid,
    email: user.email,
    authMethod: authMethod,
    status: 'success',
    ...metadata
  }, db);
}

/**
 * Log failed login attempt
 * @param {string} email - Email or identifier
 * @param {string} authMethod - Authentication method attempted
 * @param {string} errorMessage - Error message
 * @param {Object} db - Firestore database instance
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<void>}
 */
export async function logFailedLogin(email, authMethod, errorMessage, db, metadata = {}) {
  if (!authConfig.logAllAttempts && authConfig.logSuccessOnly) {
    return; // Skip logging if configured to log only successes
  }

  await logAuthAttempt({
    email: email,
    authMethod: authMethod,
    status: 'failure',
    errorMessage: errorMessage,
    ...metadata
  }, db);
}

/**
 * Log logout event
 * @param {string} userId - User ID
 * @param {Object} db - Firestore database instance
 * @returns {Promise<void>}
 */
export async function logLogout(userId, db) {
  try {
    const ip = await getUserIP();

    await db.collection(collections.loginLogs).add({
      userId: userId,
      event: 'logout',
      ipAddress: ip,
      timestamp: new Date().toISOString(),
      timestampMs: Date.now()
    });

  } catch (error) {
    console.error('Failed to log logout:', error);
  }
}

/**
 * Generate a unique session ID
 * @returns {string} Session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get user's login history
 * @param {string} userId - User ID
 * @param {Object} db - Firestore database instance
 * @param {number} limit - Number of records to retrieve
 * @returns {Promise<Array>} Array of login history records
 */
export async function getUserLoginHistory(userId, db, limit = 50) {
  try {
    const snapshot = await db
      .collection(collections.loginLogs)
      .where('userId', '==', userId)
      .orderBy('timestampMs', 'desc')
      .limit(limit)
      .get();

    const history = [];
    snapshot.forEach(doc => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return history;

  } catch (error) {
    console.error('Failed to retrieve login history:', error);
    return [];
  }
}

/**
 * Detect suspicious login patterns
 * @param {string} userId - User ID
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Object>} Suspicious activity report
 */
export async function detectSuspiciousActivity(userId, db) {
  try {
    const history = await getUserLoginHistory(userId, db, 100);

    if (history.length < 2) {
      return { suspicious: false };
    }

    const suspiciousFlags = [];

    // Check for multiple countries in short time
    const recentLogins = history.slice(0, 10);
    const countries = new Set(
      recentLogins
        .map(log => log.location?.country)
        .filter(c => c && c !== 'Unknown')
    );

    if (countries.size > 2) {
      suspiciousFlags.push('Multiple countries detected');
    }

    // Check for unusual number of failed attempts
    const recentFailures = recentLogins.filter(log => log.status === 'failure').length;
    if (recentFailures > 5) {
      suspiciousFlags.push('High number of failed login attempts');
    }

    // Check for rapid login attempts
    const timeDiffs = [];
    for (let i = 1; i < Math.min(recentLogins.length, 5); i++) {
      const diff = recentLogins[i - 1].timestampMs - recentLogins[i].timestampMs;
      timeDiffs.push(diff);
    }

    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    if (avgTimeDiff < 60000) { // Less than 1 minute average
      suspiciousFlags.push('Rapid login attempts detected');
    }

    return {
      suspicious: suspiciousFlags.length > 0,
      flags: suspiciousFlags,
      recentLoginCount: recentLogins.length,
      countries: Array.from(countries)
    };

  } catch (error) {
    console.error('Failed to detect suspicious activity:', error);
    return { suspicious: false, error: error.message };
  }
}
