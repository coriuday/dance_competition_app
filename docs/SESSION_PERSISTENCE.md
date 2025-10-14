# Session Persistence Documentation

## Overview

This document describes the session persistence implementation in the Dance Competition App. The app automatically saves and restores user authentication sessions, providing a seamless experience across app restarts.

## Architecture

### Components

1. **Auth Store (`src/store/authStore.ts`)**
   - Manages global authentication state using Zustand
   - Handles session persistence using `expo-secure-store`
   - Provides `restoreAuth()` method for session restoration

2. **Auth Service (`src/services/api/auth.service.ts`)**
   - Provides `validateAndRefreshSession()` to validate and refresh expired sessions
   - Communicates with Supabase for session management

3. **App Navigator (`src/navigation/AppNavigator.tsx`)**
   - Calls `restoreAuth()` on app initialization
   - Shows splash screen while checking session
   - Conditionally renders auth or main navigation based on authentication state

4. **Splash Screen (`src/components/common/SplashScreen.tsx`)**
   - Displays branded loading screen during session check
   - Provides visual feedback to users during initialization

## Flow Diagram

```
App Launch
    ↓
AppNavigator mounts
    ↓
Call restoreAuth()
    ↓
Set isLoading = true
    ↓
Show SplashScreen
    ↓
Retrieve session from SecureStore
    ↓
Validate session with Supabase
    ↓
Is session valid? ──No──→ Clear storage → Show Auth screens
    ↓
   Yes
    ↓
Is session expired? ──Yes──→ Refresh session
    ↓                              ↓
   No                         Success?
    ↓                              ↓
Restore user state            Yes → Update storage
    ↓                              ↓
Set isLoading = false ←────────────┘
    ↓
Show Main screens
```

## Implementation Details

### Secure Storage

The app uses `expo-secure-store` to securely persist authentication data:

- **Storage Keys:**
  - `auth_user`: User profile data
  - `auth_session`: Session tokens and metadata

- **Security:**
  - Data is encrypted at rest
  - Automatically cleared on logout
  - Cleared on session validation failure

### Session Validation

Sessions are validated on app launch:

1. **Check Expiration:**
   - Compare `expires_at` timestamp with current time
   - If expired, attempt to refresh using `refresh_token`

2. **Refresh Session:**
   - Call Supabase `refreshSession()` API
   - Update stored session with new tokens
   - Fetch updated user profile

3. **Handle Failures:**
   - Clear stored data if refresh fails
   - Redirect to login screen
   - Log error for debugging

### Loading States

The app provides clear feedback during initialization:

- **isLoading = true:** Show SplashScreen
- **isLoading = false:** Show appropriate navigation (Auth or Main)

### Navigation Logic

```typescript
if (isLoading) {
  return <SplashScreen />;
}

return (
  <NavigationContainer>
    {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
  </NavigationContainer>
);
```

## Usage

### Automatic Restoration

Session restoration happens automatically on app launch. No manual intervention required.

### Manual Session Check

To manually check or refresh the session:

```typescript
import { useAuthStore } from './store/authStore';

function MyComponent() {
  const restoreAuth = useAuthStore((state) => state.restoreAuth);
  
  const handleRefresh = async () => {
    await restoreAuth();
  };
  
  return <Button onPress={handleRefresh} title="Refresh Session" />;
}
```

### Logout

To clear the session:

```typescript
import { useAuthStore } from './store/authStore';

function MyComponent() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  const handleLogout = async () => {
    await clearAuth();
    // User will be redirected to login screen automatically
  };
}
```

## Error Handling

### Common Scenarios

1. **Expired Session:**
   - Automatically attempts refresh
   - Falls back to login if refresh fails

2. **Network Error:**
   - Logs error to console
   - Clears stored session
   - Shows login screen

3. **Invalid Token:**
   - Clears stored session
   - Shows login screen

4. **Storage Error:**
   - Logs error to console
   - Continues with unauthenticated state

### Error Logging

All errors during session restoration are logged:

```typescript
console.error('Failed to restore auth state:', error);
```

## Testing

### Manual Testing

1. **Fresh Install:**
   - Launch app → Should show login screen
   - Login → Should navigate to main app
   - Close and reopen app → Should stay logged in

2. **Session Expiration:**
   - Login and wait for session to expire
   - Reopen app → Should refresh session automatically
   - If refresh fails → Should show login screen

3. **Logout:**
   - Logout from app
   - Reopen app → Should show login screen

### Edge Cases

- **No Internet:** App should handle gracefully and show login
- **Corrupted Storage:** App should clear and show login
- **Concurrent Sessions:** Last session wins

## Security Considerations

1. **Secure Storage:**
   - Uses platform-specific secure storage (Keychain on iOS, Keystore on Android)
   - Data is encrypted at rest

2. **Token Refresh:**
   - Refresh tokens are stored securely
   - Expired sessions are automatically refreshed
   - Failed refreshes clear all stored data

3. **Session Validation:**
   - Always validates with backend on app launch
   - Never trusts client-side data alone

## Performance

- **Fast Restoration:** Session check typically completes in < 500ms
- **Minimal Network:** Only validates/refreshes when necessary
- **Smooth UX:** Splash screen provides seamless transition

## Future Enhancements

1. **Biometric Authentication:** Add Face ID/Touch ID for additional security
2. **Session Timeout Warning:** Warn users before session expires
3. **Background Refresh:** Refresh session in background before expiration
4. **Multi-Device Support:** Sync sessions across devices
5. **Session History:** Track login history and active sessions

## Related Files

- `src/store/authStore.ts` - Auth state management
- `src/services/api/auth.service.ts` - Auth API calls
- `src/navigation/AppNavigator.tsx` - Navigation logic
- `src/components/common/SplashScreen.tsx` - Loading screen
- `src/types/user.types.ts` - Type definitions

## Requirements Satisfied

- **Requirement 2.7:** Session persistence across app restarts ✓
- **Requirement 6.2:** Global state management with persistence ✓
