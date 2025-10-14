# Database Seeding Guide

This guide explains how to seed your Supabase database with sample video data for development and testing.

## Prerequisites

Before seeding the database, ensure you have:

1. ✅ Created a Supabase project
2. ✅ Set up the database schema (run migrations)
3. ✅ Created at least one user account (via the app or Supabase dashboard)
4. ✅ Configured environment variables in `.env` file

## Seeding Videos

### Option 1: Using the Seed Script (Recommended)

Run the following command from the project root:

```bash
npx tsx scripts/seed-videos.ts
```

This will:
- Check if videos already exist (to avoid duplicates)
- Fetch the first user from your database
- Insert 8 sample videos with external URLs
- Display success message with video IDs

### Option 2: Using the Utility Function

You can also import and use the `seedVideos` function in your code:

```typescript
import { seedVideos } from './src/utils/seedVideos';

// Call the function
await seedVideos();
```

## Sample Video Data

The seed script includes 8 sample videos with:
- **Titles**: Various dance styles (Hip Hop, Ballet, Contemporary, etc.)
- **Descriptions**: Brief descriptions of each dance performance
- **Video URLs**: External URLs from Google's sample video bucket
- **Thumbnail URLs**: Placeholder images from Pexels
- **Views & Likes**: Pre-populated engagement metrics

## Video Sources

The sample videos use external URLs from:
- **Google Cloud Storage**: Public sample videos (Big Buck Bunny, Sintel, etc.)
- **Thumbnails**: Pexels free stock photos

These are temporary placeholders. In production, you would:
1. Upload videos to Supabase Storage
2. Generate thumbnails automatically
3. Use proper video CDN for streaming

## Clearing Videos

To remove all videos from the database:

```typescript
import { clearVideos } from './src/utils/seedVideos';

await clearVideos();
```

⚠️ **Warning**: This will delete ALL videos from your database. Use with caution!

## Troubleshooting

### Error: "No users found in database"

**Solution**: Create a user account first:
1. Run the app and register a new user
2. Or manually insert a user via Supabase dashboard
3. Then run the seed script again

### Error: "Failed to insert videos"

**Possible causes**:
- Database schema not set up correctly
- Missing environment variables
- Network connection issues
- RLS policies blocking inserts

**Solution**: 
1. Check your Supabase connection
2. Verify database schema matches the types
3. Ensure RLS policies allow inserts for authenticated users

### Videos Already Exist

The seed script checks for existing videos and skips seeding if any are found. To re-seed:
1. Clear existing videos using `clearVideos()`
2. Run the seed script again

## Seeding Leaderboard

### Option 1: Using the Seed Script (Recommended)

Run the following command from the project root:

```bash
npx tsx scripts/seed-leaderboard.ts
```

This will:
- Check if leaderboard entries already exist (to avoid duplicates)
- Fetch existing users and videos from your database
- Create leaderboard entries with scores for each user
- Automatically calculate and assign ranks based on scores
- Display success message with top 5 entries

### Option 2: Using the Utility Function

You can also import and use the `seedLeaderboard` function in your code:

```typescript
import { seedLeaderboard } from './src/utils/seedLeaderboard';

// Call the function
await seedLeaderboard();
```

### Prerequisites for Leaderboard Seeding

Before seeding the leaderboard, ensure you have:

1. ✅ Seeded users (at least one user account)
2. ✅ Seeded videos (at least one video)
3. ✅ Set up the leaderboard table in Supabase

### Sample Leaderboard Data

The seed script will:
- Create one leaderboard entry per user
- Assign scores ranging from 10,000 (top rank) down to 100
- Associate each user with a video from the database
- Calculate ranks automatically based on scores (sorted descending)

### Clearing Leaderboard

To remove all leaderboard entries from the database:

```typescript
import { clearLeaderboard } from './src/utils/seedLeaderboard';

await clearLeaderboard();
```

⚠️ **Warning**: This will delete ALL leaderboard entries from your database. Use with caution!

## Next Steps

After seeding:
1. ✅ Videos are ready to display in the app
2. ✅ Test the video feed screen
3. ✅ Verify video playback works
4. ✅ Test like and view increment functionality
5. ✅ Leaderboard is populated with rankings
6. ✅ Test the leaderboard screen with auto-refresh

## Custom Video Data

To add your own videos, edit `src/utils/seedVideos.ts` and modify the `sampleVideos` array:

```typescript
const sampleVideos = [
  {
    title: 'Your Video Title',
    description: 'Your description',
    video_url: 'https://your-video-url.mp4',
    thumbnail_url: 'https://your-thumbnail-url.jpg',
    views: 0,
    likes: 0,
  },
  // Add more videos...
];
```

Make sure video URLs:
- Point to publicly accessible MP4 files
- Are from reliable CDN or storage services
- Support CORS for web playback
- Are optimized for mobile streaming
