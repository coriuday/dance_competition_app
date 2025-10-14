/**
 * useLeaderboard Hook
 * 
 * Custom hook for fetching and managing leaderboard data using React-Query
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchLeaderboard, fetchUserRank } from '../services/api/leaderboard.service';
import type { LeaderboardEntryWithUser, LeaderboardParams, UserRank } from '../types/leaderboard.types';
import { logger } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Hook to fetch leaderboard data with auto-refresh
 * 
 * @param params - Optional parameters for pagination
 * @returns React-Query result with leaderboard data
 */
export const useLeaderboard = (
  params: LeaderboardParams = {}
): UseQueryResult<LeaderboardEntryWithUser[], Error> => {
  const result = useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => fetchLeaderboard(params),
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Log errors when they occur
  if (result.error) {
    logger.queryError('leaderboard', result.error);
  }

  return result;
};

/**
 * Hook to fetch a specific user's rank
 * 
 * @param userId - The ID of the user to fetch rank for
 * @param enabled - Whether the query should run (default: true)
 * @returns React-Query result with user rank data
 */
export const useUserRank = (
  userId: string | undefined,
  enabled: boolean = true
): UseQueryResult<UserRank | null, Error> => {
  const result = useQuery({
    queryKey: ['userRank', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return fetchUserRank(userId);
    },
    enabled: enabled && Boolean(userId),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    retry: 2,
  });

  // Log errors when they occur
  if (result.error) {
    logger.queryError('userRank', result.error);
  }

  return result;
};
