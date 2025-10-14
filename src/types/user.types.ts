/**
 * User Type Definitions
 * 
 * Types related to user authentication and profile data
 */

import type { Database } from './database.types';

/**
 * User profile data from the database
 */
export type User = Database['public']['Tables']['users']['Row'];

/**
 * Data required to create a new user
 */
export type UserInsert = Database['public']['Tables']['users']['Insert'];

/**
 * Data that can be updated for a user
 */
export type UserUpdate = Database['public']['Tables']['users']['Update'];

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Session data from Supabase Auth
 */
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

/**
 * Auth error response
 */
export interface AuthError {
  message: string;
  status?: number;
}
