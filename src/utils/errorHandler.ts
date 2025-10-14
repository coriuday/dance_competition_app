/**
 * Error Handler Utility
 * 
 * Centralized error handling for consistent error management across the app
 */

import { logger } from './logger';
import { showErrorToast, formatErrorMessage } from './toast';

/**
 * Handle API errors with logging and user notification
 */
export const handleApiError = (
  error: unknown,
  context?: string,
  showToast: boolean = true
): string => {
  const errorMessage = formatErrorMessage(error);
  
  // Log the error
  if (context) {
    logger.apiError(context, error);
  } else {
    logger.error('API Error', error);
  }
  
  // Show toast notification if requested
  if (showToast) {
    showErrorToast(errorMessage);
  }
  
  return errorMessage;
};

/**
 * Handle authentication errors
 */
export const handleAuthError = (error: unknown): string => {
  const errorMessage = formatErrorMessage(error);
  logger.error('Authentication Error', error);
  
  // Map common auth errors to user-friendly messages
  const authErrorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'User already registered': 'An account with this email already exists.',
    'Email not confirmed': 'Please confirm your email address before logging in.',
    'Invalid email': 'Please enter a valid email address.',
  };
  
  const friendlyMessage = authErrorMessages[errorMessage] || errorMessage;
  showErrorToast(friendlyMessage);
  
  return friendlyMessage;
};

/**
 * Handle video loading errors
 */
export const handleVideoError = (error: unknown, videoId?: string): string => {
  const errorMessage = formatErrorMessage(error);
  logger.error(`Video Error${videoId ? ` [${videoId}]` : ''}`, error);
  
  const friendlyMessage = 'Unable to load video. Please try again.';
  showErrorToast(friendlyMessage);
  
  return friendlyMessage;
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error: unknown): string => {
  logger.error('Network Error', error);
  
  const friendlyMessage = 'Network error. Please check your connection and try again.';
  showErrorToast(friendlyMessage);
  
  return friendlyMessage;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('Network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('auth') ||
      error.message.includes('unauthorized') ||
      error.message.includes('credentials') ||
      error.message.includes('token')
    );
  }
  return false;
};
