/**
 * Firebase Configuration for Authentication Library
 *
 * This file contains Firebase project configuration.
 * Replace these values with your actual Firebase project credentials.
 *
 * To get these values:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > General
 * 4. Scroll to "Your apps" section
 * 5. Click "Web" icon to add a web app
 * 6. Copy the configuration object
 */

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

/**
 * Authentication Providers Configuration
 */
export const authProviders = {
  google: {
    enabled: true,
    scopes: ['profile', 'email']
  },
  facebook: {
    enabled: true,
    scopes: ['email', 'public_profile']
  },
  apple: {
    enabled: true,
    scopes: ['email', 'name']
  },
  email: {
    enabled: true,
    codeLength: 6,
    codeExpiry: 600000, // 10 minutes in milliseconds
    resendDelay: 60000  // 1 minute in milliseconds
  }
};

/**
 * Auth Library Configuration
 */
export const authConfig = {
  // UI Settings
  modalAnimation: true,
  autoCloseOnAuth: true,

  // Session Settings
  persistSession: true,
  sessionTimeout: 86400000, // 24 hours in milliseconds

  // Logging Settings
  logAllAttempts: true,
  logSuccessOnly: false,
  includeDeviceInfo: true,

  // API Endpoints
  ipServiceUrl: 'https://api.ipify.org?format=json', // Free IP service
  backupIpService: 'https://ipapi.co/json/',

  // Rate Limiting
  maxLoginAttempts: 5,
  lockoutDuration: 900000 // 15 minutes in milliseconds
};

/**
 * Firestore Collection Names
 */
export const collections = {
  loginLogs: 'login_logs',
  users: 'users',
  emailCodes: 'email_verification_codes',
  sessions: 'user_sessions'
};
