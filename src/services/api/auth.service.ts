/**
 * Authentication Service
 * 
 * Handles all authentication-related operations with Supabase
 * including sign up, sign in, sign out, and session management.
 */

import { supabase } from '../../config/supabase.config';
import type { LoginCredentials, RegisterData, User, Session, UserInsert } from '../../types';

/**
 * Authentication response type
 */
interface AuthResponse {
  user: User | null;
  session: Session | null;
}

/**
 * Sign up a new user
 * 
 * @param data - Registration data including email, password, and username
 * @returns Promise with user and session data
 * @throws Error if registration fails
 */
export const signUp = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Create auth user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    // Create user profile in the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        username: data.username,
      } as any)
      .select()
      .single();

    if (userError) {
      throw new Error(`Failed to create user profile: ${userError.message}`);
    }

    return {
      user: userData,
      session: authData.session as Session | null,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign up');
  }
};

/**
 * Sign in an existing user
 * 
 * @param credentials - Login credentials (email and password)
 * @returns Promise with user and session data
 * @throws Error if authentication fails
 */
export const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Authentication failed');
    }

    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user profile: ${userError.message}`);
    }

    return {
      user: userData,
      session: authData.session as Session | null,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign in');
  }
};

/**
 * Sign out the current user
 * 
 * @returns Promise that resolves when sign out is complete
 * @throws Error if sign out fails
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign out');
  }
};

/**
 * Get the current authenticated user
 * 
 * @returns Promise with current user and session data, or null if not authenticated
 * @throws Error if fetching user fails
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    // Get current session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (!session) {
      return {
        user: null,
        session: null,
      };
    }

    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user profile: ${userError.message}`);
    }

    return {
      user: userData,
      session: session as Session,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching current user');
  }
};

/**
 * Validate and refresh session if needed
 * 
 * @param session - Current session to validate
 * @returns Promise with refreshed session or null if invalid
 */
export const validateAndRefreshSession = async (session: Session | null): Promise<AuthResponse> => {
  try {
    if (!session) {
      return {
        user: null,
        session: null,
      };
    }

    // Check if session is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });

      if (error || !data.session) {
        // Refresh failed, session is invalid
        return {
          user: null,
          session: null,
        };
      }

      // Fetch user profile with refreshed session
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (userError) {
        throw new Error(`Failed to fetch user profile: ${userError.message}`);
      }

      return {
        user: userData,
        session: data.session as Session,
      };
    }

    // Session is still valid, fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user profile: ${userError.message}`);
    }

    return {
      user: userData,
      session: session,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while validating session');
  }
};
