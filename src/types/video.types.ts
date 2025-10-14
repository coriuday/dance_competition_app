/**
 * Video Type Definitions
 * 
 * Types related to video data and metadata
 */

import type { Database } from './database.types';
import type { User } from './user.types';

/**
 * Video data from the database
 */
export type Video = Database['public']['Tables']['videos']['Row'];

/**
 * Data required to create a new video
 */
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];

/**
 * Data that can be updated for a video
 */
export type VideoUpdate = Database['public']['Tables']['videos']['Update'];

/**
 * Video with user information populated
 */
export interface VideoWithUser extends Video {
  user?: User;
}

/**
 * Video metadata (for future use)
 */
export interface VideoMetadata {
  duration?: number;
  resolution?: string;
  format?: string;
  size?: number;
}

/**
 * Video feed item with additional computed properties
 */
export interface VideoFeedItem extends VideoWithUser {
  isLiked?: boolean;
  isPlaying?: boolean;
}

/**
 * Pagination parameters for video fetching
 */
export interface VideoPaginationParams {
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'views' | 'likes';
  orderDirection?: 'asc' | 'desc';
}
