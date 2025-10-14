/**
 * Video Seeding Utility
 * 
 * This script seeds the Supabase database with sample video data
 * using external video URLs from free video sources.
 * 
 * Run this script once to populate the database with test data.
 */

import { supabase } from '../config/supabase.config';
import type { VideoInsert } from '../types/video.types';

/**
 * Sample video data with external URLs
 * Videos are from free sources like Pexels
 */
const sampleVideos: Omit<VideoInsert, 'user_id'>[] = [
  {
    title: 'Hip Hop Dance Battle',
    description: 'Amazing hip hop dance performance with incredible energy and style',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 1250,
    likes: 89,
  },
  {
    title: 'Contemporary Dance Solo',
    description: 'Beautiful contemporary dance piece showcasing fluid movements',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 980,
    likes: 67,
  },
  {
    title: 'Breakdance Showcase',
    description: 'Mind-blowing breakdance moves and power moves',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 2100,
    likes: 156,
  },
  {
    title: 'Ballet Performance',
    description: 'Graceful ballet performance with perfect technique',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 1450,
    likes: 92,
  },
  {
    title: 'Street Dance Crew',
    description: 'Synchronized street dance routine by talented crew',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 1780,
    likes: 134,
  },
  {
    title: 'Latin Dance Fusion',
    description: 'Energetic Latin dance with salsa and bachata elements',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 1320,
    likes: 78,
  },
  {
    title: 'Freestyle Dance',
    description: 'Creative freestyle dance with unique style',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 890,
    likes: 54,
  },
  {
    title: 'Jazz Dance Routine',
    description: 'Classic jazz dance with modern twist',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 1150,
    likes: 71,
  },
];

/**
 * Seed the database with sample videos
 * 
 * This function will:
 * 1. Check if videos already exist
 * 2. Get a sample user to associate videos with
 * 3. Insert sample videos into the database
 */
export const seedVideos = async (): Promise<void> => {
  try {
    console.log('Starting video seeding process...');

    // Check if videos already exist
    const { data: existingVideos, error: checkError } = await supabase
      .from('videos')
      .select('id')
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check existing videos: ${checkError.message}`);
    }

    if (existingVideos && existingVideos.length > 0) {
      console.log('Videos already exist in database. Skipping seed.');
      return;
    }

    // Get the first user from the database to associate videos with
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (userError) {
      throw new Error(`Failed to fetch users: ${userError.message}`);
    }

    if (!users || users.length === 0) {
      throw new Error(
        'No users found in database. Please create a user account first before seeding videos.'
      );
    }

    const userId = (users as any)[0].id;

    // Prepare videos with user_id
    const videosToInsert: VideoInsert[] = sampleVideos.map((video) => ({
      ...video,
      user_id: userId,
    }));

    // Insert videos
    const { data, error } = await (supabase as any)
      .from('videos')
      .insert(videosToInsert)
      .select();

    if (error) {
      throw new Error(`Failed to insert videos: ${error.message}`);
    }

    console.log(`Successfully seeded ${data?.length || 0} videos!`);
    if (data) {
      console.log('Sample video IDs:', data.map((v: any) => v.id));
    }
  } catch (error) {
    console.error('Error seeding videos:', error);
    throw error;
  }
};

/**
 * Clear all videos from the database
 * Use with caution - this will delete all video data
 */
export const clearVideos = async (): Promise<void> => {
  try {
    console.log('Clearing all videos from database...');

    const { error } = await supabase
      .from('videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      throw new Error(`Failed to clear videos: ${error.message}`);
    }

    console.log('Successfully cleared all videos!');
  } catch (error) {
    console.error('Error clearing videos:', error);
    throw error;
  }
};
