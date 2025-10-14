/**
 * Leaderboard Type Definitions
 * 
 * Types related to leaderboard data and competition rankings
 */

import type { Database } from './database.types';
import type { User } from './user.types';
import type { Video } from './video.types';

/**
 * Leaderboard entry from the database
 */
export type LeaderboardEntry = Database['public']['Tables']['leaderboard']['Row'];

/**
 * Data required to create a new leaderboard entry
 */
export type LeaderboardInsert = Database['public']['Tables']['leaderboard']['Insert'];

/**
 * Data that can be updated for a leaderboard entry
 */
export type LeaderboardUpdate = Database['public']['Tables']['leaderboard']['Update'];

/**
 * Leaderboard entry with user information populated
 */
export interface LeaderboardEntryWithUser extends LeaderboardEntry {
  user?: User;
  video?: Video;
}

/**
 * User rank information
 */
export interface UserRank {
  userId: string;
  rank: number;
  score: number;
  totalEntries: number;
}

/**
 * Leaderboard fetch parameters
 */
export interface LeaderboardParams {
  limit?: number;
  offset?: number;
}
