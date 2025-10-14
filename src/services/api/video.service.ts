/**
 * Video Service
 * 
 * Handles all video-related API operations including fetching videos,
 * updating views, and managing likes.
 */

import { supabase } from '../../config/supabase.config';
import type { Video, VideoWithUser, VideoPaginationParams, VideoUpdate } from '../../types/video.types';

/**
 * Fetch videos with pagination and optional user data
 * 
 * @param params - Pagination and sorting parameters
 * @returns Promise with array of videos
 */
export const fetchVideos = async (
  params: VideoPaginationParams = {}
): Promise<VideoWithUser[]> => {
  try {
    const {
      limit = 10,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'desc',
    } = params;

    // Query videos with user information
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(*)
      `)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching videos:', error);
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }

    return data as VideoWithUser[];
  } catch (error) {
    console.error('Error in fetchVideos:', error);
    throw error;
  }
};

/**
 * Fetch a single video by ID with user data
 * 
 * @param id - Video ID
 * @returns Promise with video data
 */
export const fetchVideoById = async (id: string): Promise<VideoWithUser> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching video by ID:', error);
      throw new Error(`Failed to fetch video: ${error.message}`);
    }

    if (!data) {
      throw new Error('Video not found');
    }

    return data as VideoWithUser;
  } catch (error) {
    console.error('Error in fetchVideoById:', error);
    throw error;
  }
};

/**
 * Increment view count for a video
 * 
 * @param videoId - Video ID
 * @returns Promise with updated video data
 */
export const incrementViews = async (videoId: string): Promise<Video> => {
  try {
    // First, get the current video data
    const { data: currentVideo, error: fetchError } = await supabase
      .from('videos')
      .select('views')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      console.error('Error fetching video for view increment:', fetchError);
      throw new Error(`Failed to fetch video: ${fetchError.message}`);
    }

    // Increment the views
    const newViews = ((currentVideo as any)?.views || 0) + 1;

    const { data, error } = await (supabase as any)
      .from('videos')
      .update({ views: newViews })
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      console.error('Error incrementing views:', error);
      throw new Error(`Failed to increment views: ${error.message}`);
    }

    return data as Video;
  } catch (error) {
    console.error('Error in incrementViews:', error);
    throw error;
  }
};

/**
 * Toggle like status for a video
 * This function increments or decrements the like count
 * 
 * @param videoId - Video ID
 * @param isLiked - Current like status (true if currently liked, false otherwise)
 * @returns Promise with updated video data
 */
export const toggleLike = async (
  videoId: string,
  isLiked: boolean
): Promise<Video> => {
  try {
    // First, get the current video data
    const { data: currentVideo, error: fetchError } = await supabase
      .from('videos')
      .select('likes')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      console.error('Error fetching video for like toggle:', fetchError);
      throw new Error(`Failed to fetch video: ${fetchError.message}`);
    }

    // Calculate new likes count
    const currentLikes = (currentVideo as any)?.likes || 0;
    const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    const { data, error } = await (supabase as any)
      .from('videos')
      .update({ likes: newLikes })
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling like:', error);
      throw new Error(`Failed to toggle like: ${error.message}`);
    }

    return data as Video;
  } catch (error) {
    console.error('Error in toggleLike:', error);
    throw error;
  }
};
