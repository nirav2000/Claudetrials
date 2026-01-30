# Firebase v9 Compatibility Fix

## Issue
The authentication library was experiencing errors with Firebase v9 compat mode:
```
firebase.auth.getAdditionalUserInfo is not a function
```

## Root Cause
Two issues were identified:

1. **Global Scope Access**: Firebase was loaded via `<script>` tags in HTML, placing it on the `window` object. ES6 modules require explicit access to `window.firebase` to use the global object.

2. **Deprecated API**: In Firebase v9+, `getAdditionalUserInfo()` is not a method on `firebase.auth`. Instead, the `UserCredential` object returned from authentication methods contains `additionalUserInfo` as a direct property.

## Solution

### 1. Added Global Firebase Reference
Added to both affected files:
- `auth-library/core/social-auth.js`
- `auth-library/core/auth-manager.js`

```javascript
// Access Firebase from global scope (loaded via script tag in HTML)
const firebase = window.firebase;
```

### 2. Updated Additional User Info Access
Changed from (incorrect):
```javascript
const additionalInfo = firebase.auth.getAdditionalUserInfo(result);
```

To (correct):
```javascript
const additionalInfo = result.additionalUserInfo;
```

## Files Modified
1. `auth-library/core/social-auth.js`
   - Line 12: Added Firebase global reference
   - Line 48: Fixed `additionalUserInfo` access in `signInWithGoogle()`
   - Line 184: Fixed `additionalUserInfo` access in `signInWithFacebook()`
   - Line 300: Fixed `additionalUserInfo` access in `signInWithApple()`

2. `auth-library/core/auth-manager.js`
   - Line 14: Added Firebase global reference
   - Line 39: Updated Firebase availability check to use `window.firebase`

## Firebase v9 Compat Mode Reference

### UserCredential Object Structure
```javascript
{
  user: User,                    // Firebase User object
  credential: AuthCredential,    // Auth credential used
  additionalUserInfo: {          // Direct property (not a function!)
    isNewUser: boolean,
    profile: object,
    providerId: string,
    username: string
  },
  operationType: string
}
```

### Correct API Usage

✅ **Correct - Direct Property Access**
```javascript
const result = await auth.signInWithPopup(provider);
const isNewUser = result.additionalUserInfo?.isNewUser;
```

❌ **Incorrect - Function Call (v8 style)**
```javascript
const result = await auth.signInWithPopup(provider);
const info = firebase.auth.getAdditionalUserInfo(result); // This doesn't exist in v9!
```

## Compatibility
- ✅ Firebase SDK 9.22.0 (compat mode)
- ✅ All social authentication providers (Google, Facebook, Apple)
- ✅ All authentication methods using `signInWithPopup()`
- ✅ ES6 modules with global Firebase loading

## Testing
Verified with:
- Google authentication
- Facebook authentication
- Apple authentication
- Additional user info extraction
- New user detection

## Version
Fixed in version v2.5.13 (2026-01-30)
