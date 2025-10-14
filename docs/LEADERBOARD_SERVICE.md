# Leaderboard Service Documentation

This document provides an overview of the leaderboard implementation for the Dance Competition App.

## Overview

The leaderboard system displays competition rankings with user scores, automatically sorted in descending order. It includes auto-refresh functionality to keep rankings up-to-date in real-time.

## Architecture

### Components

1. **LeaderboardScreen** - Main screen displaying the leaderboard
2. **LeaderboardItem** - Individual entry component with rank, user info, and score
3. **useLeaderboard** - React-Query hook for data fetching
4. **leaderboard.service** - API service functions

### Data Flow

```
LeaderboardScreen
    ↓
useLeaderboard Hook (React-Query)
    ↓
leaderboard.service.ts
    ↓
Supabase Database
```

## Features

### Auto-Refresh

The leaderboard automatically refreshes every 30 seconds to show the latest rankings:

```typescript
refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
```

### Visual Distinction for Top 3

Top 3 ranks receive special styling:
- 🥇 **1st Place**: Gold background and badge
- 🥈 **2nd Place**: Silver background and badge
- 🥉 **3rd Place**: Bronze background and badge
- **Other Ranks**: Standard blue badge with rank number

### Pull-to-Refresh

Users can manually refresh the leaderboard by pulling down on the list.

### Loading States

- Initial load shows a full-screen loading spinner
- Pull-to-refresh shows a refresh indicator
- Background refetches are silent

### Error Handling

- Network errors display a user-friendly error message
- Retry button allows users to attempt fetching again
- Errors are logged to console for debugging

## API Functions

### fetchLeaderboard

Fetches leaderboard entries with user and video data joined.

```typescript
const leaderboard = await fetchLeaderboard({ limit: 100, offset: 0 });
```

**Parameters:**
- `limit` (optional): Number of entries to fetch (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Returns:** Array of `LeaderboardEntryWithUser` objects

**Features:**
- Automatically sorts by score (descending)
- Joins user data (username, avatar)
- Joins video data (title, URL)
- Error handling with descriptive messages

### fetchUserRank

Fetches rank information for a specific user.

```typescript
const userRank = await fetchUserRank(userId);
```

**Parameters:**
- `userId`: The ID of the user to fetch rank for

**Returns:** `UserRank` object or `null` if user not found

**Features:**
- Returns null if user not in leaderboard (instead of throwing)
- Includes total number of entries for context
- Error handling for network issues

## React-Query Hooks

### useLeaderboard

Main hook for fetching leaderboard data.

```typescript
const { data, isLoading, error, refetch } = useLeaderboard({ limit: 100 });
```

**Configuration:**
- `staleTime`: 30 seconds
- `refetchInterval`: 30 seconds (auto-refresh)
- `refetchOnWindowFocus`: true
- `retry`: 3 attempts with exponential backoff

### useUserRank

Hook for fetching a specific user's rank.

```typescript
const { data: userRank } = useUserRank(userId, enabled);
```

**Parameters:**
- `userId`: User ID to fetch rank for
- `enabled`: Whether the query should run (default: true)

## Database Schema

### leaderboard Table

```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  video_id UUID REFERENCES videos(id),
  score INTEGER NOT NULL,
  rank INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Foreign key on `user_id`
- Foreign key on `video_id`
- Index on `score` for efficient sorting

## Seeding Data

### Seed Leaderboard

To populate the leaderboard with sample data:

```bash
npx tsx scripts/seed-leaderboard.ts
```

**What it does:**
1. Checks if leaderboard entries already exist
2. Fetches existing users and videos
3. Creates one entry per user with random scores
4. Assigns ranks based on scores (sorted descending)
5. Inserts data in batches for performance

**Score Generation:**
- Top user: ~10,000 points
- Scores decrease by ~500 per rank
- Random variation of ±100 points added
- Minimum score: 100 points

### Clear Leaderboard

To remove all leaderboard entries:

```typescript
import { clearLeaderboard } from './src/utils/seedLeaderboard';
await clearLeaderboard();
```

⚠️ **Warning**: This deletes ALL leaderboard data!

## Styling

The leaderboard uses NativeWind (Tailwind CSS) for styling:

- **Container**: Light gray background (`bg-gray-50`)
- **Items**: White cards with shadows and borders
- **Top 3**: Special colored backgrounds (yellow, gray, orange)
- **Rank Badges**: Circular badges with rank number or medal emoji
- **Avatars**: Circular images or initials for users without avatars
- **Scores**: Large, bold numbers with "points" label

## Usage Example

### Basic Implementation

```typescript
import { LeaderboardScreen } from './screens/leaderboard/LeaderboardScreen';

// In your navigation
<Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
```

### Custom Hook Usage

```typescript
import { useLeaderboard } from './hooks/useLeaderboard';

function MyComponent() {
  const { data, isLoading, error } = useLeaderboard({ limit: 50 });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <LeaderboardItem entry={item} />}
    />
  );
}
```

## Performance Considerations

### Optimization Strategies

1. **Pagination**: Fetch limited entries (default 50, max 100)
2. **Batch Inserts**: Seed data in batches of 50 to avoid timeouts
3. **Efficient Queries**: Use Supabase's join syntax for single query
4. **Caching**: React-Query caches data for 30 seconds
5. **FlatList**: Uses React Native's optimized list component

### Auto-Refresh Impact

The 30-second auto-refresh is a balance between:
- **Real-time updates**: Users see latest rankings
- **Network usage**: Not too frequent to drain battery/data
- **Server load**: Reasonable request frequency

To adjust the refresh interval, modify the `refetchInterval` in `useLeaderboard.ts`.

## Troubleshooting

### Leaderboard Not Loading

**Possible causes:**
- No data in database (run seed script)
- Network connection issues
- Supabase configuration incorrect
- RLS policies blocking reads

**Solution:**
1. Check browser/app console for errors
2. Verify Supabase connection in `.env`
3. Ensure leaderboard table exists
4. Check RLS policies allow reads for authenticated users

### Ranks Not Updating

**Possible causes:**
- Rank field not calculated during insert
- Scores not sorted correctly
- Cache not invalidating

**Solution:**
1. Re-seed leaderboard data
2. Check sort order in query (should be descending)
3. Force refresh by pulling down on list

### Auto-Refresh Not Working

**Possible causes:**
- App in background (React-Query pauses queries)
- Network connection lost
- Query disabled or error state

**Solution:**
1. Bring app to foreground
2. Check network connection
3. Pull to refresh manually
4. Check console for errors

## Future Enhancements

Potential improvements for the leaderboard:

1. **Real-time Updates**: Use Supabase real-time subscriptions
2. **Infinite Scroll**: Load more entries as user scrolls
3. **Filters**: Filter by time period, category, etc.
4. **Search**: Search for specific users
5. **User Highlight**: Highlight current user's position
6. **Animations**: Animate rank changes
7. **Share**: Share leaderboard position to social media
8. **Achievements**: Display badges for top performers

## Related Documentation

- [Seeding Guide](./SEEDING.md) - How to seed database with sample data
- [Video Service](./VIDEO_SERVICE.md) - Video feed implementation
- [README](../README.md) - Project overview and setup
