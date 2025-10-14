# Video Service Documentation

This document provides an overview of the video service implementation, including API functions, React hooks, and usage examples.

## Overview

The video service layer handles all video-related operations including:
- Fetching videos with pagination
- Fetching individual videos
- Incrementing view counts
- Toggling like status
- Caching and optimistic updates

## Architecture

```
┌─────────────────────────────────────┐
│   Components (VideoFeedScreen)     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   Hooks (useVideos, useToggleLike)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   Service (video.service.ts)        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   Supabase Client                   │
└─────────────────────────────────────┘
```

## Files Created

### 1. `src/services/api/video.service.ts`

Core service functions for video operations:

- **`fetchVideos(params)`**: Fetch paginated videos with user data
- **`fetchVideoById(id)`**: Fetch a single video by ID
- **`incrementViews(videoId)`**: Increment view count for a video
- **`toggleLike(videoId, isLiked)`**: Toggle like status (increment/decrement)

All functions include:
- ✅ Error handling
- ✅ TypeScript types
- ✅ Console logging for debugging
- ✅ Proper Supabase queries with joins

### 2. `src/hooks/useVideos.ts`

React-Query hooks for video data management:

- **`useVideos(params)`**: Fetch and cache videos with pagination
- **`useVideo(id, enabled)`**: Fetch a single video
- **`useIncrementViews()`**: Mutation hook for incrementing views
- **`useToggleLike()`**: Mutation hook with optimistic updates for likes
- **`usePrefetchVideos(params)`**: Prefetch next page for smooth pagination

Features:
- ✅ 5-minute cache time (staleTime)
- ✅ Optimistic updates for likes
- ✅ Automatic cache invalidation
- ✅ Query key factory for organized caching
- ✅ Error handling and rollback

### 3. `src/utils/seedVideos.ts`

Database seeding utility:

- **`seedVideos()`**: Populate database with sample videos
- **`clearVideos()`**: Remove all videos from database

Features:
- ✅ Checks for existing videos (no duplicates)
- ✅ Associates videos with existing users
- ✅ Uses external video URLs (Google Cloud Storage)
- ✅ Includes diverse video metadata

### 4. `scripts/seed-videos.ts`

Executable script to run the seeding process:

```bash
npx tsx scripts/seed-videos.ts
```

### 5. `docs/SEEDING.md`

Comprehensive guide for database seeding.

## Usage Examples

### Fetching Videos in a Component

```typescript
import { useVideos } from '../hooks/useVideos';

function VideoFeedScreen() {
  const { data: videos, isLoading, error } = useVideos({
    limit: 10,
    offset: 0,
    orderBy: 'created_at',
    orderDirection: 'desc',
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <FlatList
      data={videos}
      renderItem={({ item }) => <VideoPlayer video={item} />}
    />
  );
}
```

### Incrementing Views

```typescript
import { useIncrementViews } from '../hooks/useVideos';

function VideoPlayer({ videoId }) {
  const incrementViews = useIncrementViews();

  useEffect(() => {
    // Increment views when video starts playing
    incrementViews.mutate(videoId);
  }, [videoId]);

  // ...
}
```

### Toggling Likes with Optimistic Updates

```typescript
import { useToggleLike } from '../hooks/useVideos';

function LikeButton({ videoId, isLiked }) {
  const toggleLike = useToggleLike();

  const handleLike = () => {
    toggleLike.mutate({ videoId, isLiked });
  };

  return (
    <Button
      onPress={handleLike}
      disabled={toggleLike.isPending}
    >
      {isLiked ? '❤️' : '🤍'} Like
    </Button>
  );
}
```

### Pagination Support

```typescript
import { useVideos, usePrefetchVideos } from '../hooks/useVideos';

function VideoFeed() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: videos } = useVideos({
    limit,
    offset: page * limit,
  });

  // Prefetch next page
  const prefetchNext = usePrefetchVideos({
    limit,
    offset: (page + 1) * limit,
  });

  useEffect(() => {
    prefetchNext(); // Prefetch when component mounts
  }, [page]);

  // ...
}
```

## Caching Strategy

### Query Keys

The service uses a hierarchical query key structure:

```typescript
videoKeys = {
  all: ['videos'],
  lists: ['videos', 'list'],
  list: ['videos', 'list', { params }],
  details: ['videos', 'detail'],
  detail: ['videos', 'detail', id],
}
```

### Cache Times

- **staleTime**: 5 minutes - Data is considered fresh for 5 minutes
- **gcTime**: 10 minutes - Unused data is garbage collected after 10 minutes

### Invalidation

Cache is automatically invalidated when:
- Views are incremented
- Likes are toggled
- Videos are updated

## Optimistic Updates

The `useToggleLike` hook implements optimistic updates:

1. **onMutate**: Immediately update the cache before the API call
2. **onError**: Roll back to previous value if the API call fails
3. **onSettled**: Refetch data to ensure consistency

This provides instant UI feedback while maintaining data integrity.

## Error Handling

All service functions include comprehensive error handling:

```typescript
try {
  // API call
} catch (error) {
  console.error('Error description:', error);
  throw error; // Re-throw for React-Query to handle
}
```

React-Query hooks automatically:
- Retry failed requests (3 times with exponential backoff)
- Provide error states to components
- Log errors to console in development

## Sample Video Data

The seed script includes 8 sample videos:

1. Hip Hop Dance Battle
2. Contemporary Dance Solo
3. Breakdance Showcase
4. Ballet Performance
5. Street Dance Crew
6. Latin Dance Fusion
7. Freestyle Dance
8. Jazz Dance Routine

All videos use external URLs from Google Cloud Storage's public sample videos.

## Next Steps

After implementing the video service:

1. ✅ Build video feed UI components (Task 7)
2. ✅ Implement VideoPlayer component
3. ✅ Add video controls (like, share)
4. ✅ Test pagination and infinite scroll
5. ✅ Optimize video playback performance

## Testing

To test the video service:

1. **Seed the database**:
   ```bash
   npx tsx scripts/seed-videos.ts
   ```

2. **Verify in Supabase dashboard**:
   - Check the `videos` table
   - Ensure 8 videos are inserted
   - Verify user associations

3. **Test in the app**:
   - Fetch videos in VideoFeedScreen
   - Test like functionality
   - Verify view counts increment
   - Check caching behavior

## Troubleshooting

### Videos not loading

- Check Supabase connection
- Verify environment variables
- Check RLS policies
- Ensure videos are seeded

### Likes not updating

- Check network tab for API errors
- Verify optimistic updates in React DevTools
- Check Supabase logs

### Cache not invalidating

- Check query keys match
- Verify invalidation logic in mutations
- Clear React-Query cache manually if needed

## Requirements Satisfied

This implementation satisfies the following requirements:

- ✅ **3.1**: Fetch video metadata from Supabase using React-Query
- ✅ **3.2**: Load video files from external URLs
- ✅ **5.4**: Use React-Query hooks to fetch data from Supabase
- ✅ **5.7**: Proper error handling for database operations
- ✅ **6.4**: React-Query for server state management
