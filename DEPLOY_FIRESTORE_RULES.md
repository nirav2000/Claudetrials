# Deploy Firestore Rules

The Firestore security rules have been updated to fix the Google authentication issue. You need to deploy these rules to your Firebase project.

## What Was Fixed

1. **Auth State Change Listener**: Changed from `.update()` to `.set()` with `merge: true` to prevent errors when user documents don't exist yet
2. **User Collection Rules**: Made rules more explicit to allow initial user document creation
3. **Login Logs Rules**: Enhanced to handle both successful and failed login attempts
4. **Error Handling**: Added comprehensive error handling for Firestore permission errors

## Deploy the Rules

### Option 1: Deploy via Firebase CLI (Recommended)

1. First, login to Firebase:
   ```bash
   firebase login
   ```

2. Deploy the Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **fractionworksheet**
3. Go to **Firestore Database** > **Rules**
4. Copy the contents of `firestore.rules` and paste into the editor
5. Click **Publish**

## Verify the Fix

After deploying the rules:

1. Clear your browser cache and cookies for your site
2. Try signing in with Google again
3. Check the browser console for any errors
4. Check the Firestore Database in Firebase Console to verify:
   - Your user document appears in the `users` collection
   - Login logs appear in the `login_logs` collection

## The Updated Rules

The key changes in the Firestore rules:

```javascript
// Users collection - now explicitly allows create for new users
match /users/{userId} {
  allow read: if isOwner(userId);
  allow create: if isSignedIn() && userId == request.auth.uid;
  allow update, delete: if isOwner(userId);
}

// Login logs - now handles failed logins too
match /login_logs/{logId} {
  allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
  allow create: if isSignedIn() &&
    (request.resource.data.userId == request.auth.uid ||
     request.resource.data.status == 'failure');
}
```

## Troubleshooting

If you still see errors after deploying:

1. **Check the browser console** for detailed error messages
2. **Verify Firebase Auth is enabled**: Go to Firebase Console > Authentication > Sign-in method > Make sure Google is enabled
3. **Check authorized domains**: Go to Firebase Console > Authentication > Settings > Authorized domains > Make sure your domain is listed
4. **Clear Firebase cache**: Sometimes Firebase caches auth state. Sign out and sign in again.

## Need Help?

If issues persist, check the browser console and look for:
- `permission-denied` errors (rules not deployed)
- `auth/` error codes (authentication configuration issues)
- Network errors (connectivity problems)
