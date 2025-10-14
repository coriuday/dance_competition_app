#!/usr/bin/env tsx

/**
 * Leaderboard Seeding Script
 * 
 * This script seeds the Supabase database with sample leaderboard data.
 * Run this after seeding users and videos.
 * 
 * Usage:
 *   npx tsx scripts/seed-leaderboard.ts
 */

import { seedLeaderboard } from '../src/utils/seedLeaderboard';

async function main() {
  console.log('🏆 Dance Competition App - Leaderboard Seeding\n');
  
  try {
    await seedLeaderboard();
    console.log('\n✅ Leaderboard seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Leaderboard seeding failed:', error);
    process.exit(1);
  }
}

main();
