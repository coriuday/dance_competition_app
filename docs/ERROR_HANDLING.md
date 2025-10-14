# Error Handling Documentation

This document describes the comprehensive error handling system implemented in the dance competition app.

## Overview

The app implements a multi-layered error handling approach:

1. **ErrorBoundary Component** - Catches React component errors
2. **React-Query Error Handling** - Manages API and data fetching errors
3. **Toast Notifications** - User-friendly error messages
4. **Logging System** - Debug logging in development mode

## Components

### 1. ErrorBoundary Component

**Location:** `src/components/common/ErrorBoundary.tsx`

The ErrorBoundary component catches React errors and displays a fallback UI.

**Features:**
- Catches unhandled errors in React component tree
- Displays user-friendly error message
- Shows detailed error info in development mode
- Provides "Try Again" button to reset error state
- Logs errors for debugging

**Usage:**
```tsx
import { ErrorBoundary } from './src/components/common/ErrorBoundary';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Custom Fallback:**
```tsx
<ErrorBoundary fallback={<CustomErrorScreen />}>
  <YourApp />
</ErrorBoundary>
```

### 2. Logger Utility

**Location:** `src/utils/logger.ts`

Centralized logging system for debugging in development mode.

**Methods:**
- `logger.debug(message, data?)` - Debug messages (dev only)
- `logger.info(message, data?)` - Info messages (dev only)
- `logger.warn(message, data?)` - Warning messages
- `logger.error(message, error?)` - Error messages
- `logger.apiError(endpoint, error, context?)` - API-specific errors
- `logger.queryError(queryKey, error)` - React-Query errors
- `logger.mutationError(mutationKey, error, variables?)` - Mutation errors

**Usage:**
```typescript
import { logger } from '../utils/logger';

logger.info('User logged in successfully');
logger.error('Failed to fetch data', error);
logger.apiError('/api/videos', error, { userId: '123' });
```

### 3. Toast Notifications

**Location:** `src/utils/toast.ts`

Simple toast notification system using React Native's Alert API.

**Methods:**
- `showToast(options)` - Generic toast
- `showSuccessToast(message, onPress?)` - Success message
- `showErrorToast(message, onPress?)` - Error message
- `showWarningToast(message, onPress?)` - Warning message
- `showInfoToast(message, onPress?)` - Info message
- `formatErrorMessage(error)` - Format error for display

**Usage:**
```typescript
import { showErrorToast, showSuccessToast } from '../utils/toast';

showSuccessToast('Login successful!');
showErrorToast('Failed to load data');
```

### 4. Error Handler Utility

**Location:** `src/utils/errorHandler.ts`

Centralized error handling with logging and user notifications.

**Methods:**
- `handleApiError(error, context?, showToast?)` - Handle API errors
- `handleAuthError(error)` - Handle authentication errors
- `handleVideoError(error, videoId?)` - Handle video loading errors
- `handleNetworkError(error)` - Handle network errors
- `isNetworkError(error)` - Check if error is network-related
- `isAuthError(error)` - Check if error is auth-related

**Usage:**
```typescript
import { handleApiError, handleAuthError } from '../utils/errorHandler';

try {
  await fetchData();
} catch (error) {
  handleApiError(error, 'fetchData');
}

// Authentication errors
try {
  await login(credentials);
} catch (error) {
  handleAuthError(error);
}
```

### 5. Common UI Components

#### LoadingSpinner

**Location:** `src/components/common/LoadingSpinner.tsx`

Consistent loading indicator used throughout the app.

**Props:**
- `size?: 'small' | 'large'` - Spinner size
- `color?: string` - Spinner color
- `message?: string` - Optional loading message
- `fullScreen?: boolean` - Full screen mode

**Usage:**
```tsx
<LoadingSpinner size="large" message="Loading videos..." fullScreen />
```

#### ErrorMessage

**Location:** `src/components/common/ErrorMessage.tsx`

User-friendly error display with retry functionality.

**Props:**
- `message: string` - Error message to display
- `onRetry?: () => void` - Optional retry callback
- `fullScreen?: boolean` - Full screen mode

**Usage:**
```tsx
<ErrorMessage 
  message="Failed to load data" 
  onRetry={() => refetch()} 
  fullScreen 
/>
```

## React-Query Error Handling

### Global Configuration

**Location:** `App.tsx`

React-Query is configured with global error handling:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Global error handlers
queryClient.getQueryCache().config.onError = (error) => {
  logger.error('Query Cache Error', error);
};

queryClient.getMutationCache().config.onError = (error) => {
  logger.error('Mutation Cache Error', error);
};
```

### Hook-Level Error Handling

Each custom hook logs errors when they occur:

**useAuth Hook:**
```typescript
const loginMutation = useMutation({
  mutationFn: signIn,
  onSuccess: async (data) => {
    await setAuth(data.user, data.session);
    logger.info('User logged in successfully');
  },
  onError: (error: Error) => {
    handleAuthError(error);
  },
});
```

**useVideos Hook:**
```typescript
const result = useQuery({
  queryKey: videoKeys.list(params),
  queryFn: () => fetchVideos(params),
  staleTime: 5 * 60 * 1000,
});

if (result.error) {
  logger.queryError('videos.list', result.error);
}
```

## Error Handling Patterns

### 1. API Errors

```typescript
try {
  const data = await fetchVideos();
  return data;
} catch (error) {
  handleApiError(error, 'fetchVideos');
  throw error;
}
```

### 2. Authentication Errors

```typescript
try {
  await signIn(credentials);
} catch (error) {
  handleAuthError(error); // Shows user-friendly message
  throw error;
}
```

### 3. Component-Level Errors

```tsx
const { data, error, isLoading, refetch } = useVideos();

if (isLoading) {
  return <LoadingSpinner fullScreen />;
}

if (error) {
  return (
    <ErrorMessage 
      message="Failed to load videos" 
      onRetry={refetch} 
      fullScreen 
    />
  );
}

return <VideoList videos={data} />;
```

### 4. Optimistic Updates with Error Rollback

```typescript
const mutation = useMutation({
  mutationFn: toggleLike,
  onMutate: async (variables) => {
    // Optimistically update UI
    const previousData = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, newData);
    return { previousData };
  },
  onError: (error, variables, context) => {
    // Rollback on error
    if (context?.previousData) {
      queryClient.setQueryData(queryKey, context.previousData);
    }
    handleApiError(error, 'toggleLike', false);
  },
});
```

## Best Practices

1. **Always log errors** - Use the logger utility for consistent logging
2. **Show user-friendly messages** - Use toast notifications for user feedback
3. **Provide retry mechanisms** - Allow users to retry failed operations
4. **Handle errors at appropriate levels** - Component, hook, or global level
5. **Use ErrorBoundary** - Wrap your app to catch unhandled errors
6. **Log context** - Include relevant context when logging errors
7. **Don't show toasts for non-critical errors** - Like view increments
8. **Test error scenarios** - Ensure error handling works as expected

## Development vs Production

### Development Mode
- Detailed error messages in console
- Error stack traces visible
- Debug logs enabled
- Detailed error info in ErrorBoundary UI

### Production Mode
- Generic error messages to users
- Errors logged to external service (placeholder)
- No debug logs
- Clean error UI without technical details

## Future Enhancements

1. **External Logging Service** - Integrate with Sentry, LogRocket, etc.
2. **Error Analytics** - Track error frequency and patterns
3. **Custom Toast Component** - Replace Alert with custom toast UI
4. **Offline Error Handling** - Better handling of offline scenarios
5. **Error Recovery Strategies** - Automatic retry with exponential backoff
6. **User Error Reporting** - Allow users to report errors with context

## Testing Error Handling

### Manual Testing

1. **Test ErrorBoundary:**
   - Throw an error in a component
   - Verify fallback UI appears
   - Test "Try Again" button

2. **Test API Errors:**
   - Disconnect network
   - Verify error messages appear
   - Test retry functionality

3. **Test Authentication Errors:**
   - Use invalid credentials
   - Verify user-friendly error messages

### Automated Testing

```typescript
// Example test for error handling
it('should display error message when fetch fails', async () => {
  const mockError = new Error('Network error');
  jest.spyOn(api, 'fetchVideos').mockRejectedValue(mockError);
  
  render(<VideoFeedScreen />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **Errors not being caught:**
   - Ensure ErrorBoundary wraps your app
   - Check if error is thrown in async code (use try-catch)

2. **Toast not showing:**
   - Verify Alert is working on your platform
   - Check if error handler is being called

3. **Logs not appearing:**
   - Verify `__DEV__` is true in development
   - Check console filters

4. **React-Query errors not handled:**
   - Ensure global error handlers are set up
   - Check hook-level error handling

## Related Files

- `src/components/common/ErrorBoundary.tsx`
- `src/components/common/ErrorMessage.tsx`
- `src/components/common/LoadingSpinner.tsx`
- `src/utils/logger.ts`
- `src/utils/toast.ts`
- `src/utils/errorHandler.ts`
- `App.tsx`
- All custom hooks in `src/hooks/`
