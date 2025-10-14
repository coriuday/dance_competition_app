/**
 * Leaderboard Service
 * 
 * Service functions for fetching and managing leaderboard data
 */

import { supabase } from '../../config/supabase.config';
import type { LeaderboardEntryWithUser, LeaderboardParams, UserRank } from '../../types/leaderboard.types';

/**
 * Fetch leaderboard entries sorted by score in descending order
 * 
 * @param params - Optional parameters for pagination
 * @returns Promise with array of leaderboard entries with user data
 * @throws Error if the fetch fails
 */
export const fetchLeaderboard = async (
  params: LeaderboardParams = {}
): Promise<LeaderboardEntryWithUser[]> => {
  try {
    const { limit = 50, offset = 0 } = params;

    // Fetch leaderboard entries with user data joined
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        user:users (
          id,
          username,
          avatar_url,
          email,
          created_at
        ),
        video:videos (
          id,
          title,
          video_url,
          thumbnail_url
        )
      `)
      .order('score', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match our type structure
    return data.map((entry: any) => ({
      ...entry,
      user: Array.isArray(entry.user) ? entry.user[0] : entry.user,
      video: Array.isArray(entry.video) ? entry.video[0] : entry.video,
    })) as LeaderboardEntryWithUser[];
  } catch (error) {
    console.error('Error in fetchLeaderboard:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred while fetching leaderboard');
  }
};

/**
 * Fetch rank information for a specific user
 * 
 * @param userId - The ID of the user to fetch rank for
 * @returns Promise with user rank information
 * @throws Error if the fetch fails
 */
export const fetchUserRank = async (userId: string): Promise<UserRank | null> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Fetch the user's leaderboard entry
    const { data: userEntry, error: userError } = await supabase
      .from('leaderboard')
      .select('score, rank')
      .eq('user_id', userId)
      .single();

    if (userError) {
      // If user not found in leaderboard, return null instead of throwing
      if (userError.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user rank:', userError);
      throw new Error(`Failed to fetch user rank: ${userError.message}`);
    }

    if (!userEntry) {
      return null;
    }

    // Get total number of entries to provide context
    const { count, error: countError } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting leaderboard entries:', countError);
      throw new Error(`Failed to count leaderboard entries: ${countError.message}`);
    }

    const entry = userEntry as any;

    return {
      userId,
      rank: entry.rank || 0,
      score: entry.score,
      totalEntries: count || 0,
    };
  } catch (error) {
    console.error('Error in fetchUserRank:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred while fetching user rank');
  }
};
