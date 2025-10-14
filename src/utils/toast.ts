/**
 * Toast Notification Utility
 * 
 * Simple toast notification system for user-friendly error messages
 * Uses React Native's Alert for cross-platform compatibility
 */

import { Alert, Platform } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onPress?: () => void;
}

/**
 * Show a toast notification
 */
export const showToast = ({
  title,
  message,
  type = 'info',
  onPress,
}: ToastOptions): void => {
  // Default titles based on type
  const defaultTitles: Record<ToastType, string> = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  };

  const toastTitle = title || defaultTitles[type];

  // Use Alert for cross-platform compatibility
  Alert.alert(
    toastTitle,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
      },
    ],
    { cancelable: true }
  );
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string, onPress?: () => void): void => {
  showToast({ message, type: 'success', onPress });
};

/**
 * Show error toast
 */
export const showErrorToast = (message: string, onPress?: () => void): void => {
  showToast({ message, type: 'error', onPress });
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string, onPress?: () => void): void => {
  showToast({ message, type: 'warning', onPress });
};

/**
 * Show info toast
 */
export const showInfoToast = (message: string, onPress?: () => void): void => {
  showToast({ message, type: 'info', onPress });
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
};
