/**
 * Video Seeding Script
 * 
 * Run this script to populate the Supabase database with sample video data.
 * 
 * Usage:
 *   npx tsx scripts/seed-videos.ts
 * 
 * Make sure you have:
 * 1. Created a Supabase project
 * 2. Set up the database schema (users and videos tables)
 * 3. Created at least one user account
 * 4. Configured environment variables in .env
 */

import { seedVideos } from '../src/utils/seedVideos';

// Run the seed function
seedVideos()
  .then(() => {
    console.log('✅ Video seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Video seeding failed:', error);
    process.exit(1);
  });
