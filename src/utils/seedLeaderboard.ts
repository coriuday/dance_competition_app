/**
 * Leaderboard Seeding Utility
 * 
 * This script seeds the Supabase database with sample leaderboard data
 * associating users with videos and scores.
 * 
 * Run this script after seeding users and videos to populate the leaderboard.
 */

import { supabase } from '../config/supabase.config';
import type { LeaderboardInsert } from '../types/leaderboard.types';

/**
 * Seed the database with sample leaderboard entries
 * 
 * This function will:
 * 1. Check if leaderboard entries already exist
 * 2. Fetch existing users and videos
 * 3. Create leaderboard entries with scores
 * 4. Calculate and assign ranks based on scores
 */
export const seedLeaderboard = async (): Promise<void> => {
  try {
    console.log('Starting leaderboard seeding process...');

    // Check if leaderboard entries already exist
    const { data: existingEntries, error: checkError } = await supabase
      .from('leaderboard')
      .select('id')
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check existing leaderboard: ${checkError.message}`);
    }

    if (existingEntries && existingEntries.length > 0) {
      console.log('Leaderboard entries already exist in database. Skipping seed.');
      return;
    }

    // Fetch users from the database
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id');

    if (userError) {
      throw new Error(`Failed to fetch users: ${userError.message}`);
    }

    if (!users || users.length === 0) {
      throw new Error(
        'No users found in database. Please create user accounts first before seeding leaderboard.'
      );
    }

    // Fetch videos from the database
    const { data: videos, error: videoError } = await supabase
      .from('videos')
      .select('id');

    if (videoError) {
      throw new Error(`Failed to fetch videos: ${videoError.message}`);
    }

    if (!videos || videos.length === 0) {
      throw new Error(
        'No videos found in database. Please seed videos first before seeding leaderboard.'
      );
    }

    console.log(`Found ${users.length} users and ${videos.length} videos`);

    // Generate sample leaderboard entries
    // Create entries for each user with random scores
    const leaderboardEntries: Omit<LeaderboardInsert, 'rank'>[] = users.map((user: any, index: number) => {
      // Assign a video to each user (cycle through videos if more users than videos)
      const videoIndex = index % videos.length;
      const video = videos[videoIndex] as any;

      // Generate scores in descending order with some randomness
      // Top scores range from 5000-10000, decreasing for lower ranks
      const baseScore = 10000 - (index * 500);
      const randomVariation = Math.floor(Math.random() * 200) - 100;
      const score = Math.max(100, baseScore + randomVariation);

      return {
        user_id: user.id,
        video_id: video.id,
        score: score,
      };
    });

    // Sort by score descending to assign ranks
    const sortedEntries = [...leaderboardEntries].sort((a, b) => b.score - a.score);

    // Add ranks to entries
    const entriesWithRanks: LeaderboardInsert[] = sortedEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Insert leaderboard entries in batches to avoid timeout
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < entriesWithRanks.length; i += batchSize) {
      const batch = entriesWithRanks.slice(i, i + batchSize);
      
      const { data, error } = await (supabase as any)
        .from('leaderboard')
        .insert(batch)
        .select();

      if (error) {
        throw new Error(`Failed to insert leaderboard batch: ${error.message}`);
      }

      insertedCount += data?.length || 0;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} entries`);
    }

    console.log(`Successfully seeded ${insertedCount} leaderboard entries!`);
    console.log('Top 5 entries:');
    entriesWithRanks.slice(0, 5).forEach((entry) => {
      console.log(`  Rank ${entry.rank}: Score ${entry.score}`);
    });
  } catch (error) {
    console.error('Error seeding leaderboard:', error);
    throw error;
  }
};

/**
 * Clear all leaderboard entries from the database
 * Use with caution - this will delete all leaderboard data
 */
export const clearLeaderboard = async (): Promise<void> => {
  try {
    console.log('Clearing all leaderboard entries from database...');

    const { error } = await supabase
      .from('leaderboard')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      throw new Error(`Failed to clear leaderboard: ${error.message}`);
    }

    console.log('Successfully cleared all leaderboard entries!');
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    throw error;
  }
};
