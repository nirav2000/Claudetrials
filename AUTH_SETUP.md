# Authentication System Setup Guide

Complete step-by-step guide to configure and use the authentication system in your apps.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Configuration](#configuration)
4. [Email Service Setup](#email-service-setup)
5. [Testing](#testing)
6. [Integration Examples](#integration-examples)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This authentication library provides:

- ✅ **Social Login**: Google, Facebook, Apple
- ✅ **Passwordless Email**: Verification codes (no passwords!)
- ✅ **Complete Logging**: IP, location, device info, timestamps
- ✅ **Security Features**: Rate limiting, suspicious activity detection
- ✅ **Modern UI**: Beautiful, accessible authentication modals
- ✅ **Standalone**: Can be integrated into any web application

**Advantages over traditional password-based auth:**
- No forgotten passwords
- Harder to share login credentials
- More secure (no password leaks)
- Better user experience
- Comprehensive audit trail

---

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "My App Auth")
4. **Disable** Google Analytics (or enable if you want it)
5. Click "Create project"

### Step 2: Register Your Web App

1. In Firebase project, click "Web" icon (`</>`)
2. Enter app nickname (e.g., "Web App")
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** (you'll need this!)

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxx",
  authDomain: "my-app-12345.firebaseapp.com",
  projectId: "my-app-12345",
  storageBucket: "my-app-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 3: Enable Authentication Methods

#### Google Authentication

1. Go to **Authentication** > **Sign-in method**
2. Click on **Google**
3. Toggle "Enable"
4. Select support email
5. Click "Save"

#### Facebook Authentication

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add "Facebook Login" product
4. In Firebase Console:
   - Enable Facebook provider
   - Enter **App ID** and **App Secret** from Facebook
5. Copy **OAuth redirect URI** from Firebase
6. In Facebook App Settings > Facebook Login > Settings:
   - Add the OAuth redirect URI to "Valid OAuth Redirect URIs"
7. Make app live (switch from Development to Live mode)

#### Apple Authentication

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create Services ID
3. Enable "Sign In with Apple"
4. Configure domains and return URLs
5. In Firebase Console:
   - Enable Apple provider
   - Enter Service ID
6. Download private key from Apple
7. Upload to Firebase

#### Email Authentication (Passwordless)

1. In Firebase Console, enable **Anonymous** authentication
   - This is used as the base for email authentication
2. No additional setup needed for email codes
3. Email sending will be handled by your email service

### Step 4: Set Up Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **production mode** or **test mode** (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

#### Create Collections

You don't need to manually create collections - they'll be created automatically when first used. But for reference, these collections will be used:

- `users` - User profiles and progress
- `login_logs` - Authentication attempts and logs
- `email_verification_codes` - Temporary verification codes
- `user_sessions` - Active sessions

#### Set Security Rules

Go to **Firestore Database** > **Rules** and set these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read their own login logs, but only server can write
    match /login_logs/{logId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Email verification codes (write-only for security)
    match /email_verification_codes/{codeId} {
      allow read: if false;  // Never allow reading codes
      allow create: if true;  // Anyone can request a code
      allow update: if true;  // Can be marked as used
    }

    // Sessions
    match /user_sessions/{sessionId} {
      allow read, write: if request.auth != null &&
                            resource.data.userId == request.auth.uid;
    }
  }
}
```

Click "Publish" to save the rules.

### Step 5: Configure Authorized Domains

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `myapp.com`)
   - Any staging domains

---

## ⚙️ Configuration

### Update Firebase Config

Open `auth-library/config/firebase-config.js` and replace with your Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // From Firebase Console
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"  // Optional
};
```

### Customize Settings (Optional)

In the same file, you can customize:

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

---

## 📧 Email Service Setup

The library currently logs verification codes to console (development mode). For production, you need to integrate an email service.

### Recommended: SendGrid (Free tier: 100 emails/day)

1. **Sign up** at [SendGrid](https://sendgrid.com/)
2. **Verify your sender email**
3. **Create API key**:
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Name it "Auth Codes"
   - Select "Full Access"
   - Copy the API key (save it securely!)

4. **Install SendGrid** (if using Node.js backend):
   ```bash
   npm install @sendgrid/mail
   ```

5. **Update `auth-library/core/email-auth.js`**:

   Find the TODO section around line 70 and replace with:

   ```javascript
   // Import SendGrid
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   // Send email
   const msg = {
     to: email,
     from: 'noreply@yourdomain.com', // Use your verified sender
     subject: 'Your Verification Code',
     text: `Your verification code is: ${code}`,
     html: `
       <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h2 style="color: #673ab7;">Your Verification Code</h2>
         <p>Enter this code to sign in:</p>
         <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0;">
           ${code}
         </div>
         <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
       </div>
     `
   };

   await sgMail.send(msg);
   ```

### Alternative Email Services:

- **AWS SES**: Good if you're already using AWS
- **Mailgun**: Flexible pricing, good deliverability
- **Postmark**: Specialized in transactional emails
- **Resend**: Modern, developer-friendly

All follow similar integration patterns.

---

## 🧪 Testing

### Test in Demo Mode

1. **Open the demo page**:
   ```
   open auth-library/demo.html
   ```

2. **Test each authentication method**:
   - Click "Sign In"
   - Try Google, Facebook, Apple (if configured)
   - Try email authentication
   - Check console for verification code

3. **Verify in Firebase Console**:
   - Go to **Authentication** > **Users**
   - Should see your test user
   - Go to **Firestore Database**
   - Check `login_logs` collection for log entries

### Test Email Authentication

Since email service isn't set up yet:

1. Click "Continue with Email"
2. Enter your email
3. **Check browser console** for verification code
4. Enter the code
5. Should see "Successfully signed in"
6. Check Firestore for login log

### Test Login History

1. Sign in multiple times (with different methods)
2. Click "View Login History" button
3. Should see all login attempts with:
   - Authentication method
   - IP address
   - Location (city, country)
   - Device info (browser, OS)
   - Timestamp

### Test Suspicious Activity Detection

To trigger suspicious activity alerts, you would need:
- Multiple failed login attempts
- Logins from different countries in short time
- Rapid login attempts

In development, these checks won't trigger easily. They're designed for production monitoring.

---

## 🔗 Integration Examples

### Basic Integration (Any App)

1. **Add to your HTML**:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

  <!-- Auth Library Styles -->
  <link rel="stylesheet" href="auth-library/styles/auth-styles.css">
</head>
<body>
  <button id="login-btn">Sign In</button>
  <button id="logout-btn" style="display: none;">Sign Out</button>
  <div id="user-info" style="display: none;">
    Welcome, <span id="user-name"></span>!
  </div>

  <script type="module">
    import { authManager, authUI } from './auth-library/index.js';

    // Initialize
    await authManager.initialize();

    // Login
    document.getElementById('login-btn').addEventListener('click', () => {
      authUI.show({
        onSuccess: (user) => {
          document.getElementById('login-btn').style.display = 'none';
          document.getElementById('logout-btn').style.display = 'block';
          document.getElementById('user-info').style.display = 'block';
          document.getElementById('user-name').textContent = user.displayName || user.email;
        }
      });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await authManager.signOut();
      document.getElementById('login-btn').style.display = 'block';
      document.getElementById('logout-btn').style.display = 'none';
      document.getElementById('user-info').style.display = 'none';
    });
  </script>
</body>
</html>
```

### Fraction Worksheets App Integration

The integration is already set up! To use it:

1. **Update Firebase config** in `auth-library/config/firebase-config.js`

2. **The app already has**:
   - Login/logout buttons
   - User menu
   - Progress saving
   - Login history viewer

3. **Test it**:
   - Open `index.html`
   - Click "Sign In" (if button is visible)
   - Complete authentication
   - Your worksheet progress will now be saved to cloud!

---

## 🔧 Troubleshooting

### Issue: "Firebase is not defined"

**Solution**: Make sure Firebase scripts are loaded BEFORE your app scripts:

```html
<!-- Load Firebase FIRST -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- THEN load your app -->
<script type="module" src="app.js"></script>
```

### Issue: "Pop-up has been blocked"

**Solution**:
- Allow pop-ups for your site
- Or use redirect flow instead:
  ```javascript
  await auth.signInWithRedirect(provider);
  ```

### Issue: Verification codes not sending

**Solutions**:
1. Check browser console for the code (development mode)
2. Set up email service (see Email Service Setup)
3. Check email service API keys
4. Verify sender email is verified

### Issue: "Permission denied" in Firestore

**Solutions**:
1. Check Firestore security rules
2. Make sure user is authenticated
3. Verify rules match the ones in this guide

### Issue: Social login not working

**Solutions**:
1. Check Firebase Console > Authentication > Sign-in method
2. Verify provider is enabled
3. For Facebook/Apple: verify app settings in respective developer consoles
4. Check authorized domains in Firebase Console

### Issue: "Account exists with different credential"

**Meaning**: User already signed up with a different method (e.g., first with Google, now trying Facebook)

**Solution**: Use account linking:
```javascript
await authManager.linkProvider('facebook');
```

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Auth Library README](auth-library/README.md)
- [Integration Guide](auth-library/INTEGRATION_GUIDE.md)

---

## 🎉 Next Steps

1. ✅ Complete Firebase setup
2. ✅ Update configuration with your credentials
3. ✅ Test authentication in demo
4. ✅ Set up email service for production
5. ✅ Deploy your app
6. ✅ Monitor login logs in Firestore

**You're all set! 🚀**

For questions or issues, refer to the troubleshooting section or check the comprehensive documentation in the `auth-library/` directory.
