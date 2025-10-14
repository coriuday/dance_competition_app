/**
 * Supabase Client Configuration
 * 
 * This file initializes and exports the Supabase client for use throughout the app.
 * The client handles authentication, database queries, and real-time subscriptions.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please add it to your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please add it to your .env file.'
  );
}

/**
 * Supabase client instance
 * 
 * This client is configured with TypeScript types for type-safe database operations.
 * It automatically handles authentication tokens and session management.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in memory for React Native
    storage: undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Helper function to check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
