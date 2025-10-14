/**
 * useVideos Hook
 * 
 * Custom React-Query hook for managing video data fetching and mutations.
 * Provides caching, loading states, and error handling for video operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchVideos,
  fetchVideoById,
  incrementViews,
  toggleLike,
} from '../services/api/video.service';
import type { VideoPaginationParams, VideoWithUser } from '../types/video.types';
import { logger } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Query key factory for videos
 */
export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (params: VideoPaginationParams) => [...videoKeys.lists(), params] as const,
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (id: string) => [...videoKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated videos
 * 
 * @param params - Pagination and sorting parameters
 * @returns React-Query result with videos data
 */
export const useVideos = (params: VideoPaginationParams = {}) => {
  const result = useQuery({
    queryKey: videoKeys.list(params),
    queryFn: () => fetchVideos(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Log errors when they occur
  if (result.error) {
    logger.queryError('videos.list', result.error);
  }

  return result;
};

/**
 * Hook to fetch a single video by ID
 * 
 * @param id - Video ID
 * @param enabled - Whether the query should run
 * @returns React-Query result with video data
 */
export const useVideo = (id: string, enabled = true) => {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => fetchVideoById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to increment video views
 * 
 * @returns Mutation function and state
 */
export const useIncrementViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementViews,
    onSuccess: (updatedVideo) => {
      // Update the video in the cache
      queryClient.setQueryData(
        videoKeys.detail(updatedVideo.id),
        updatedVideo
      );

      // Invalidate video lists to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: videoKeys.lists(),
      });
      logger.debug(`Views incremented for video ${updatedVideo.id}`);
    },
    onError: (error: Error) => {
      logger.error('Failed to increment views', error);
      // Don't show toast for view increment failures (non-critical)
    },
  });
};

/**
 * Hook to toggle video like status
 * 
 * @returns Mutation function and state with optimistic updates
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, isLiked }: { videoId: string; isLiked: boolean }) =>
      toggleLike(videoId, isLiked),
    
    // Optimistic update
    onMutate: async ({ videoId, isLiked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });

      // Snapshot the previous value
      const previousVideo = queryClient.getQueryData<VideoWithUser>(
        videoKeys.detail(videoId)
      );

      // Optimistically update the cache
      if (previousVideo) {
        queryClient.setQueryData<VideoWithUser>(
          videoKeys.detail(videoId),
          {
            ...previousVideo,
            likes: isLiked
              ? Math.max(0, previousVideo.likes - 1)
              : previousVideo.likes + 1,
          }
        );
      }

      // Return context with previous value
      return { previousVideo };
    },

    // On error, roll back to previous value
    onError: (error: Error, { videoId }, context) => {
      logger.error('Failed to toggle like', error);
      handleApiError(error, 'toggleLike', false); // Don't show toast, we'll handle it in UI
      if (context?.previousVideo) {
        queryClient.setQueryData(
          videoKeys.detail(videoId),
          context.previousVideo
        );
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
};

/**
 * Hook to prefetch next page of videos
 * Useful for pagination and infinite scroll
 * 
 * @param params - Pagination parameters for the next page
 */
export const usePrefetchVideos = (params: VideoPaginationParams) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: videoKeys.list(params),
      queryFn: () => fetchVideos(params),
      staleTime: 5 * 60 * 1000,
    });
  };
};
