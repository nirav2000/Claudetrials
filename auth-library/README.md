# Authentication Library

A comprehensive, passwordless authentication library with social login support (Google, Facebook, Apple) and email-based authentication using verification codes. Built with vanilla JavaScript and Firebase.

## Features

- **Social Authentication**: Google, Facebook, and Apple sign-in
- **Passwordless Email Auth**: Verification codes sent to email (no passwords needed)
- **Security First**: No password storage, harder to share access
- **Complete Logging**: All login attempts logged with IP, location, device info, and timestamps
- **Modern UI**: Beautiful, accessible authentication modals
- **Standalone & Reusable**: Can be integrated into any web application
- **Firebase Integration**: Uses Firebase Auth and Firestore
- **Rate Limiting**: Built-in protection against brute force attacks
- **Suspicious Activity Detection**: Monitors for unusual login patterns

## Quick Start

### 1. Prerequisites

- Firebase project with Authentication and Firestore enabled
- Firebase configuration credentials

### 2. Include Firebase SDK

Add Firebase SDK to your HTML:

```html
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

### 3. Include Auth Library

```html
<!-- Auth Library Styles -->
<link rel="stylesheet" href="auth-library/styles/auth-styles.css">

<!-- Auth Library (ES6 Modules) -->
<script type="module">
  import { authManager, authUI } from './auth-library/index.js';

  // Initialize the auth manager
  await authManager.initialize();

  // Show auth modal
  document.getElementById('login-btn').addEventListener('click', () => {
    authUI.show({
      title: 'Sign In',
      onSuccess: (user) => {
        console.log('Signed in:', user);
        // Handle successful login
      },
      onError: (error) => {
        console.error('Auth error:', error);
      }
    });
  });
</script>
```

### 4. Configure Firebase

Update `auth-library/config/firebase-config.js` with your Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Firebase Setup

### 1. Enable Authentication Providers

In Firebase Console > Authentication > Sign-in method:

1. **Google**
   - Enable Google provider
   - Add authorized domains

2. **Facebook**
   - Enable Facebook provider
   - Create Facebook App at https://developers.facebook.com/
   - Add App ID and App Secret to Firebase
   - Add OAuth redirect URI to Facebook App settings

3. **Apple**
   - Enable Apple provider
   - Configure Apple Developer account
   - Add Services ID and Key ID

4. **Email (Anonymous)**
   - Enable Anonymous authentication (used for email auth)

### 2. Configure Firestore

Create the following collections in Firestore:

- `users` - User profiles
- `login_logs` - Authentication logs
- `email_verification_codes` - Verification codes (temporary)
- `user_sessions` - Active sessions

#### Security Rules Example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Only authenticated users can read their own logs
    match /login_logs/{logId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }

    // Email codes are write-only
    match /email_verification_codes/{codeId} {
      allow write: if true;
      allow read: if false;
    }
  }
}
```

## API Reference

### AuthManager

Main authentication manager.

#### Methods

```javascript
// Initialize
await authManager.initialize(customConfig?);

// Check initialization
authManager.isInitialized(); // boolean

// Get current user
authManager.getCurrentUser(); // User | null

// Check if authenticated
authManager.isAuthenticated(); // boolean

// Social Authentication
await authManager.signInWithGoogle();
await authManager.signInWithFacebook();
await authManager.signInWithApple();

// Email Authentication
await authManager.sendEmailCode(email);
await authManager.verifyEmailCode(email, code);
await authManager.resendEmailCode(email);

// Account Management
await authManager.linkProvider(providerType);
await authManager.unlinkProvider(providerId);
await authManager.updateProfile({ displayName, photoURL });
await authManager.getUserData(userId?);
await authManager.deleteAccount();

// Session Management
await authManager.signOut();
await authManager.refreshToken();

// Security & Logging
await authManager.getLoginHistory(limit?);
await authManager.checkSuspiciousActivity();

// Event Listeners
const unsubscribe = authManager.on('authStateChanged', (user) => {
  console.log('Auth state changed:', user);
});
```

### AuthUI

Authentication UI component.

#### Methods

```javascript
// Show auth modal
authUI.show({
  mode: 'login', // 'login' or 'email-verify'
  title: 'Sign In',
  onSuccess: (user) => {
    console.log('Success:', user);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  onClose: () => {
    console.log('Modal closed');
  }
});

// Hide modal
authUI.hide();

// Destroy modal
authUI.destroy();
```

## Email Service Integration

The library currently logs verification codes to the console (development mode). For production, integrate with an email service:

### Recommended Email Services:

1. **SendGrid** (recommended for beginners)
   ```javascript
   // In email-auth.js, replace the TODO section:
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   await sgMail.send({
     to: email,
     from: 'noreply@yourapp.com',
     subject: 'Your Verification Code',
     text: `Your code is: ${code}`,
     html: `<strong>Your code is: ${code}</strong>`
   });
   ```

2. **AWS SES** (for AWS users)
3. **Mailgun** (flexible pricing)
4. **Postmark** (transactional email specialist)

### Email Template Example:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 40px; border-radius: 8px;">
    <h2 style="color: #673ab7;">Your Verification Code</h2>
    <p>Enter this code to sign in:</p>
    <div style="background: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0;">
      {{CODE}}
    </div>
    <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
    <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
  </div>
</body>
</html>
```

## Login Logging

Every authentication attempt is logged to Firestore with:

- **User Information**: User ID, email, authentication method
- **Network Information**: IP address, location (country, city)
- **Device Information**: Browser, OS, device type, screen resolution
- **Timestamp Information**: ISO timestamp, milliseconds timestamp
- **Status**: Success, failure, or pending
- **Session ID**: Unique session identifier

### Example Log Entry:

```javascript
{
  userId: "abc123",
  email: "user@example.com",
  authMethod: "google",
  status: "success",
  ipAddress: "192.168.1.1",
  location: {
    country: "United States",
    city: "San Francisco",
    region: "California"
  },
  deviceInfo: {
    browser: "Chrome",
    os: "Windows",
    deviceType: "Desktop",
    userAgent: "...",
    screenResolution: "1920x1080"
  },
  timestamp: "2024-01-28T12:00:00.000Z",
  timestampMs: 1706443200000,
  sessionId: "session_1706443200_abc123"
}
```

## Security Features

1. **Passwordless Authentication**: No passwords to forget, leak, or share
2. **Rate Limiting**: Protects against brute force attacks
3. **Code Expiration**: Verification codes expire after 10 minutes
4. **One-Time Use**: Codes can only be used once
5. **Attempt Limiting**: Max 5 verification attempts per code
6. **Suspicious Activity Detection**: Monitors for unusual patterns
7. **Session Management**: Configurable session persistence and timeout

## Customization

### Configuration Options

Edit `auth-library/config/firebase-config.js`:

```javascript
export const authConfig = {
  // UI Settings
  modalAnimation: true,
  autoCloseOnAuth: true,

  // Session Settings
  persistSession: true,
  sessionTimeout: 86400000, // 24 hours

  // Logging Settings
  logAllAttempts: true,
  logSuccessOnly: false,
  includeDeviceInfo: true,

  // Rate Limiting
  maxLoginAttempts: 5,
  lockoutDuration: 900000 // 15 minutes
};
```

### Custom Styling

Override CSS variables or modify `auth-library/styles/auth-styles.css`:

```css
:root {
  --auth-primary-color: #673ab7;
  --auth-modal-width: 460px;
  --auth-border-radius: 16px;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
auth-library/
├── config/
│   └── firebase-config.js       # Firebase configuration
├── core/
│   ├── auth-manager.js          # Main auth orchestrator
│   ├── social-auth.js           # Google, Facebook, Apple
│   ├── email-auth.js            # Passwordless email auth
│   └── auth-logger.js           # Login logging
├── ui/
│   └── auth-ui.js               # Auth modal UI
├── utils/
│   ├── ip-service.js            # IP and device detection
│   └── validation.js            # Input validation
├── styles/
│   └── auth-styles.css          # UI styles
├── index.js                     # Main export
└── README.md                    # This file
```

## Troubleshooting

### Pop-up Blocked

If social login pop-ups are blocked:

```javascript
// Add user feedback
if (error.code === 'auth/popup-blocked') {
  alert('Please allow pop-ups for this site to use social login');
}
```

### Firebase Not Loaded

Ensure Firebase scripts are loaded before auth library:

```html
<!-- Load Firebase first -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Then load auth library -->
<script type="module" src="app.js"></script>
```

### Verification Codes Not Sending

1. Check console for the dev code (development mode)
2. Integrate email service (see Email Service Integration)
3. Check email service API keys and configuration

### CORS Errors

Add your domain to Firebase authorized domains:
1. Go to Firebase Console > Authentication > Settings
2. Add your domain to "Authorized domains"

## License

MIT License - feel free to use in your projects!

## Support

For issues, questions, or contributions, please open an issue or pull request.
