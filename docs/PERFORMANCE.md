# Performance Optimization Guide

This document outlines the performance optimizations implemented in the Dance Competition App and best practices for maintaining optimal performance.

## Implemented Optimizations

### 1. Video Feed Performance

#### FlatList Optimizations
- **windowSize**: Set to 3 to render only 3 screen heights of content
- **maxToRenderPerBatch**: Limited to 2 items per batch
- **initialNumToRender**: Set to 1 for faster initial load
- **removeClippedSubviews**: Enabled to unmount off-screen components
- **getItemLayout**: Implemented for consistent item heights
- **keyExtractor**: Uses stable video IDs for efficient re-renders

#### Video Player Optimizations
- Auto-play/pause based on viewport visibility
- Only one video plays at a time
- Video resources are released when out of view
- Proper cleanup in useEffect hooks

### 2. React-Query Caching Strategy

#### Video Feed
- **staleTime**: 5 minutes - reduces unnecessary refetches
- **cacheTime**: Default (5 minutes after last use)
- Optimistic updates for like interactions

#### Leaderboard
- **refetchInterval**: 30 seconds for real-time updates
- **staleTime**: 30 seconds to prevent excessive requests

### 3. Animation Performance

#### React Native Reanimated
- All animations run on the UI thread
- Uses `useSharedValue` and `useAnimatedStyle` for optimal performance
- Spring animations with optimized damping and stiffness
- Entrance animations with staggered delays

#### Animation Best Practices
- Avoid animating layout properties when possible
- Use `transform` and `opacity` for smooth 60fps animations
- Implement `entering` and `exiting` animations for better UX

### 4. Memory Management

#### Component Cleanup
- All event listeners are properly removed in cleanup functions
- Video refs are cleared when components unmount
- Timers and intervals are cleared in useEffect cleanup

#### Image Optimization
- Avatar images use proper `resizeMode`
- Placeholder components for missing images
- Lazy loading for off-screen content

### 5. Re-render Optimization

#### Memoization
- `useCallback` for stable function references in FlatList
- `useMemo` for expensive computations (if needed)
- Stable callback references prevent unnecessary child re-renders

#### Component Structure
- Presentational components are pure when possible
- State is lifted only when necessary
- Context usage is minimized to prevent cascade re-renders

## Performance Monitoring

### Development Tools

#### React DevTools Profiler
```bash
# Enable profiling in development
npm start
# Open React DevTools and use the Profiler tab
```

#### Performance Utilities
```typescript
import { useRenderPerformance, logMemoryUsage } from '../utils/performance';

// In your component
useRenderPerformance('VideoFeedScreen', 16); // 16ms = 60fps

// Log memory usage
logMemoryUsage();
```

### Key Metrics to Monitor

1. **Frame Rate**: Should maintain 60fps during scrolling
2. **Memory Usage**: Watch for memory leaks during extended use
3. **Bundle Size**: Keep JavaScript bundle under 5MB
4. **Time to Interactive**: App should be interactive within 3 seconds

## Common Performance Issues

### Issue: Slow Scrolling in Video Feed

**Symptoms**: Janky scrolling, dropped frames

**Solutions**:
- Reduce `windowSize` if needed
- Ensure video player properly pauses off-screen videos
- Check for unnecessary re-renders in VideoPlayer component
- Verify `removeClippedSubviews` is enabled

### Issue: Memory Leaks

**Symptoms**: App becomes sluggish over time, crashes on low-end devices

**Solutions**:
- Verify all useEffect cleanup functions are implemented
- Check for retained video refs
- Ensure event listeners are removed
- Use React DevTools Profiler to identify leaking components

### Issue: Slow Initial Load

**Symptoms**: Long white screen on app launch

**Solutions**:
- Reduce `initialNumToRender` in FlatList
- Implement code splitting if bundle is large
- Optimize image assets
- Use Hermes JavaScript engine (enabled by default in Expo)

## Testing Performance

### Manual Testing Checklist

- [ ] Scroll through video feed smoothly (60fps)
- [ ] Videos auto-play/pause correctly
- [ ] No memory leaks after 10+ minutes of use
- [ ] Leaderboard refreshes without lag
- [ ] Animations are smooth and responsive
- [ ] App responds quickly to user interactions
- [ ] Pull-to-refresh works smoothly
- [ ] Haptic feedback is responsive

### Automated Performance Testing

```bash
# Run performance tests (if implemented)
npm run test:performance

# Profile bundle size
npx expo-cli export --dump-sourcemap
npx source-map-explorer bundle.js
```

## Platform-Specific Optimizations

### iOS
- Haptic feedback uses native iOS APIs
- Smooth scrolling with native driver
- Optimized for 60fps on iPhone 8 and newer

### Android
- Hermes JavaScript engine enabled
- ProGuard/R8 optimization in production builds
- Optimized for 60fps on mid-range devices (2GB+ RAM)

## Future Optimization Opportunities

1. **Video Preloading**: Preload next/previous videos for instant playback
2. **Image CDN**: Use CDN for avatar and thumbnail images
3. **Code Splitting**: Split large features into separate bundles
4. **Service Workers**: Cache API responses for offline support
5. **Virtual Scrolling**: Implement for very long leaderboards (1000+ items)

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Expo Performance](https://docs.expo.dev/guides/performance/)
