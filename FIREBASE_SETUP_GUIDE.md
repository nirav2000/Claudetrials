# Firebase Setup Guide for Fraction Worksheet App

## 🚨 CRITICAL ISSUE: Firestore Security Rules

If your Firestore database is in **production mode**, you MUST update the security rules or authentication will NOT work!

**👉 See [FIRESTORE_SECURITY_RULES_GUIDE.md](FIRESTORE_SECURITY_RULES_GUIDE.md) for detailed instructions**

---

## Current Status
✅ **Worksheet functionality** - Working
✅ **Firebase configuration** - Set up correctly
⚠️ **Authentication** - Blocked by Firestore security rules (if in production mode)

## What You Need to Do in Firebase Console

### 1. Update Firestore Security Rules (CRITICAL!)

**Problem:** Authentication fails with "permission denied" or "insufficient permissions"

**Why:** Production mode Firestore databases deny all reads/writes by default

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `fractionworksheet`
3. Click **"Firestore Database"** in left sidebar
4. Click **"Rules"** tab at the top
5. **Replace all rules** with the content from the `firestore.rules` file in this project
6. Click **"Publish"**

**📖 Detailed guide:** See [FIRESTORE_SECURITY_RULES_GUIDE.md](FIRESTORE_SECURITY_RULES_GUIDE.md)

**Why needed:** The authentication system needs to:
- Store email verification codes
- Log login attempts
- Save user data and progress
- Manage user sessions

---

### 2. Enable Google Sign-In

**Problem:** "Failed to sign in with Google" - provider not enabled

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `fractionworksheet`
3. In left sidebar, click **"Authentication"**
4. Click **"Get started"** (if not already set up)
5. Go to **"Sign-in method"** tab
6. Find **"Google"** in the providers list
7. Click on it and toggle **"Enable"**
8. Add a support email (your email)
9. Click **"Save"**

**Why needed:** Firebase requires explicit provider enablement for security

---

### 3. Enable Facebook Sign-In (Optional)

**Fix:**
1. In Authentication > Sign-in method
2. Click **"Facebook"**
3. Toggle **"Enable"**
4. You need Facebook App ID and App Secret from [Facebook Developers](https://developers.facebook.com/)
5. Click **"Save"**

**Note:** Skip this if you don't need Facebook login

---

### 4. Enable Apple Sign-In (Optional)

**Fix:**
1. In Authentication > Sign-in method
2. Click **"Apple"**
3. Toggle **"Enable"**
4. You need Apple Developer account and configuration
5. Click **"Save"**

**Note:** Skip this if you don't need Apple login

---

## Email Authentication Limitations

**Important:** The current email authentication system:
- ✅ Generates verification codes
- ✅ Stores them in Firestore
- ❌ **Does NOT send actual emails**

### Why No Emails?

Email sending requires:
1. **Backend service** (Firebase Functions, AWS Lambda, etc.)
2. **Email service** (SendGrid, AWS SES, Mailgun, etc.)
3. **API keys** and configuration

### Current Behavior

When you try email login:
1. Code is generated
2. Code is stored in Firestore
3. **Code is shown in browser console** (for development)
4. No email is sent

### To See Your Verification Code:

**On iPad - Enable Console:**
1. Open **Settings** app
2. Go to **Safari**
3. Scroll down to **Advanced**
4. Enable **"Web Inspector"**
5. On Mac, open Safari > Develop > [Your iPad] > [Your Page]

**OR Use Desktop Browser:**
- Open Developer Tools (F12)
- Check Console tab for: `Verification code for email@example.com: 123456`

### To Add Real Email Sending:

You need to set up Firebase Functions:
```bash
npm install -g firebase-tools
firebase init functions
```

Then implement email sending in a Cloud Function. This requires:
- Paid Firebase plan (Blaze - pay as you go)
- Email service account (SendGrid, etc.)

---

## Testing Right Now

### Test Email Login:
1. Click "Sign In" button
2. Choose "Continue with Email"
3. Enter your email
4. Open browser console (see above)
5. Find the 6-digit code in console
6. Enter the code
7. Should sign in successfully

### Test Google Login:
1. Enable Google sign-in (see steps above)
2. Click "Sign In" button
3. Choose "Continue with Google"
4. Select your Google account
5. Should sign in successfully

---

## Quick Setup Checklist

For **immediate functionality**, do this:

- [ ] Enable Firestore Database (test mode)
- [ ] Enable Google Sign-In provider
- [ ] Test email login using console codes
- [ ] Test Google login

**Time needed:** ~5 minutes

---

## Firebase Console URLs

- **Main Console:** https://console.firebase.google.com/
- **Project:** https://console.firebase.google.com/project/fractionworksheet
- **Authentication:** https://console.firebase.google.com/project/fractionworksheet/authentication
- **Firestore:** https://console.firebase.google.com/project/fractionworksheet/firestore

---

## Need Help?

If you see errors after following these steps, check:
1. Browser console for specific error messages
2. Firebase Console > Authentication > Users (to see if accounts are created)
3. Firestore > Data (to see if codes are being stored)

The red error box in bottom-right of the page will show any issues.
