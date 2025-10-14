/**
 * Authentication Hook
 * 
 * Custom React hook that provides authentication functionality
 * using React-Query mutations and Zustand store integration.
 */

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { signUp, signIn, signOut, getCurrentUser } from '../services/api/auth.service';
import type { LoginCredentials, RegisterData } from '../types';
import { handleAuthError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

/**
 * Custom hook for authentication operations
 * 
 * Provides login, register, and logout mutations with automatic
 * state management through Zustand store.
 */
export const useAuth = () => {
  const { setAuth, clearAuth, user, session, isAuthenticated, isLoading } = useAuthStore();

  /**
   * Login mutation
   * Authenticates user and updates global auth state
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
    onSuccess: async (data) => {
      await setAuth(data.user, data.session);
      logger.info('User logged in successfully');
    },
    onError: (error: Error) => {
      handleAuthError(error);
    },
  });

  /**
   * Register mutation
   * Creates new user account and updates global auth state
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => signUp(data),
    onSuccess: async (data) => {
      await setAuth(data.user, data.session);
      logger.info('User registered successfully');
    },
    onError: (error: Error) => {
      handleAuthError(error);
    },
  });

  /**
   * Logout mutation
   * Signs out user and clears global auth state
   */
  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: async () => {
      await clearAuth();
      logger.info('User logged out successfully');
    },
    onError: async (error: Error) => {
      logger.error('Logout failed', error);
      // Clear auth state even if logout fails
      await clearAuth();
    },
  });

  /**
   * Check current session mutation
   * Verifies and restores current user session
   */
  const checkSessionMutation = useMutation({
    mutationFn: () => getCurrentUser(),
    onSuccess: async (data) => {
      await setAuth(data.user, data.session);
      logger.debug('Session restored successfully');
    },
    onError: async (error: Error) => {
      logger.debug('No active session found');
      await clearAuth();
    },
  });

  return {
    // Auth state
    user,
    session,
    isAuthenticated,
    isLoading,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    checkSession: checkSessionMutation.mutate,
    checkSessionAsync: checkSessionMutation.mutateAsync,
    isCheckingSession: checkSessionMutation.isPending,
    checkSessionError: checkSessionMutation.error,
  };
};
