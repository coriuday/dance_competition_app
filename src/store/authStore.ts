/**
 * Authentication Store
 * 
 * Global state management for user authentication using Zustand.
 * Handles user session, authentication state, and persistence.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User, Session } from '../types';
import { validateAndRefreshSession } from '../services/api/auth.service';

/**
 * Storage keys for secure persistence
 */
const STORAGE_KEYS = {
  USER: 'auth_user',
  SESSION: 'auth_session',
} as const;

/**
 * Auth store state interface
 */
interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null, session: Session | null) => Promise<void>;
  clearAuth: () => Promise<void>;
  restoreAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

/**
 * Save data to secure storage
 */
const saveToSecureStore = async (key: string, value: any): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to secure storage:`, error);
  }
};

/**
 * Get data from secure storage
 */
const getFromSecureStore = async <T,>(key: string): Promise<T | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to get ${key} from secure storage:`, error);
    return null;
  }
};

/**
 * Delete data from secure storage
 */
const deleteFromSecureStore = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Failed to delete ${key} from secure storage:`, error);
  }
};

/**
 * Create the auth store with Zustand
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Set authentication state and persist to secure storage
   */
  setAuth: async (user: User | null, session: Session | null) => {
    try {
      // Update store state
      set({
        user,
        session,
        isAuthenticated: Boolean(user && session),
        isLoading: false,
      });

      // Persist to secure storage
      if (user && session) {
        await saveToSecureStore(STORAGE_KEYS.USER, user);
        await saveToSecureStore(STORAGE_KEYS.SESSION, session);
      }
    } catch (error) {
      console.error('Failed to set auth state:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Clear authentication state and remove from secure storage
   */
  clearAuth: async () => {
    try {
      // Clear store state
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Remove from secure storage
      await deleteFromSecureStore(STORAGE_KEYS.USER);
      await deleteFromSecureStore(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Failed to clear auth state:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Restore authentication state from secure storage
   * Should be called on app initialization
   */
  restoreAuth: async () => {
    try {
      set({ isLoading: true });

      // Retrieve from secure storage
      const storedSession = await getFromSecureStore<Session>(STORAGE_KEYS.SESSION);

      // Validate and refresh session if needed
      const { user, session } = await validateAndRefreshSession(storedSession);

      if (user && session) {
        // Session is valid, update storage with potentially refreshed session
        await saveToSecureStore(STORAGE_KEYS.USER, user);
        await saveToSecureStore(STORAGE_KEYS.SESSION, session);

        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Session is invalid or expired, clear storage
        await deleteFromSecureStore(STORAGE_KEYS.USER);
        await deleteFromSecureStore(STORAGE_KEYS.SESSION);

        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
      
      // Clear storage on error
      await deleteFromSecureStore(STORAGE_KEYS.USER);
      await deleteFromSecureStore(STORAGE_KEYS.SESSION);

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
