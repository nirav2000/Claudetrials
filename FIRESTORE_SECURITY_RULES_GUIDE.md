# Firestore Security Rules Setup Guide

## 🚨 THE PROBLEM

Your Firestore database is in **production mode**, which means the default security rules **DENY ALL reads and writes**. This is why authentication isn't working!

Even though:
- ✅ Firebase configuration is correct
- ✅ Google sign-in is enabled
- ✅ Email/password authentication is enabled

The authentication system **CANNOT**:
- ❌ Store email verification codes
- ❌ Log login attempts
- ❌ Store user data
- ❌ Read or write any data

## 🔧 THE SOLUTION

You need to update your Firestore security rules to allow the authentication system to work properly.

## 📝 HOW TO FIX IT

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fractionworksheet**
3. Click **Firestore Database** in the left sidebar

### Step 2: Update Security Rules

1. Click the **"Rules"** tab at the top
2. You'll see your current rules (probably denying everything)
3. **Replace** the entire rules content with the rules from `firestore.rules` file in this project
4. Click **"Publish"**

### Step 3: Verify Rules Are Published

After publishing, you should see a success message. The rules allow:

- ✅ Users can read/write their own data
- ✅ Anyone can create email verification codes (needed for signup)
- ✅ Users can read their own login logs
- ✅ Users can manage their own sessions

## 🔐 SECURITY EXPLANATION

The new rules are SECURE because they:

1. **Require authentication** for most operations
2. **Users can only access their own data** (checked by user ID)
3. **Email verification codes** can be created by anyone (necessary for signup) but only read by the owner
4. **No public read/write access** - everything requires authentication

## 📋 ALTERNATIVE: Use Test Mode (Not Recommended for Production)

If you just want to test quickly (NOT for production):

1. Go to Firestore Database > Rules
2. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 1);
    }
  }
}
```

⚠️ **WARNING**: This allows ANYONE to read/write your database until March 1, 2026. Only use for testing!

## ✅ AFTER UPDATING RULES

1. Refresh your web app
2. Try signing in with Google
3. Try signing in with email (code will appear in browser console)
4. Check Firestore Database > Data tab to see:
   - `users` collection (your user data)
   - `login_logs` collection (login history)
   - `email_verification_codes` collection (verification codes)

## 🎯 WHAT EACH COLLECTION DOES

### `users/`
Stores user profile data:
- Display name
- Email
- Photo URL
- Last seen timestamp
- Progress data (for your fraction worksheet app)

### `email_verification_codes/`
Temporary storage for email verification:
- 6-digit codes
- Expiry timestamps
- Email addresses
- Auto-deleted after verification or expiry

### `login_logs/`
Security audit trail:
- Login attempts (success/failure)
- Authentication method (Google, email, etc.)
- IP address, location, device info
- Timestamps
- Suspicious activity detection

### `user_sessions/`
Active user sessions:
- Session tokens
- Last activity
- Device information

## 🐛 TROUBLESHOOTING

### Error: "Missing or insufficient permissions"

This error means Firestore security rules are blocking the operation.

**Solution**: Make sure you've published the new security rules (see Step 2 above)

### Error: "PERMISSION_DENIED"

Same as above - security rules are blocking access.

**Solution**: Publish the new rules and refresh your app

### Authentication works but data isn't saved

**Check**:
1. Are the security rules published?
2. Is the user authenticated when saving data?
3. Is the collection name correct in your code?

### Email codes aren't being stored

**Check**:
1. Are email verification codes collection rules allowing `create: if true`?
2. Look in Firestore console > Data tab > `email_verification_codes` collection

## 📚 LEARN MORE

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Common Security Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Testing Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)

---

## 🎉 NEXT STEPS

After fixing the security rules:

1. ✅ Test Google sign-in
2. ✅ Test email sign-in (check browser console for code)
3. ✅ Check Firestore Data tab to verify data is being saved
4. ✅ View login history in the app
5. ✅ Try saving worksheet progress

Your authentication system will now work perfectly! 🚀
