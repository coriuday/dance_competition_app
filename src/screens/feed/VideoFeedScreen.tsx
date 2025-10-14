/**
 * VideoFeedScreen Component
 * 
 * Main video feed screen with vertical scrolling and auto-play functionality
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Dimensions, ViewToken, RefreshControl } from 'react-native';
import type { ViewabilityConfig } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { VideoControls } from '../../components/video/VideoControls';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useVideos, useIncrementViews } from '../../hooks/useVideos';
import type { VideoWithUser } from '../../types/video.types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const VideoFeedScreen: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Fetch videos
  const { data: videos, isLoading, error, refetch, isRefetching } = useVideos({
    limit: 20,
    orderBy: 'created_at',
    orderDirection: 'desc',
  });

  const incrementViewsMutation = useIncrementViews();

  // Handle viewability change for auto-play/pause
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleIndex = viewableItems[0].index;
        if (visibleIndex !== null && visibleIndex !== activeVideoIndex) {
          setActiveVideoIndex(visibleIndex);
          
          // Increment views for the newly visible video
          const visibleVideo = viewableItems[0].item as VideoWithUser;
          if (visibleVideo?.id) {
            incrementViewsMutation.mutate(visibleVideo.id);
          }
        }
      }
    }
  ).current;

  // Render individual video item
  const renderVideoItem = useCallback(
    ({ item, index }: { item: VideoWithUser; index: number }) => {
      const isActive = index === activeVideoIndex;

      return (
        <View style={{ height: SCREEN_HEIGHT }}>
          <VideoPlayer
            videoUrl={item.video_url}
            isActive={isActive}
            videoData={item}
          />
          <VideoControls videoData={item} />
        </View>
      );
    },
    [activeVideoIndex]
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: VideoWithUser) => item.id, []);

  // Get item layout for optimization
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  // Loading state
  if (isLoading && !videos) {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        className="flex-1 bg-black"
      >
        <LoadingSpinner size="large" color="#ffffff" />
      </Animated.View>
    );
  }

  // Error state
  if (error && !videos) {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        className="flex-1 bg-black items-center justify-center"
      >
        <ErrorMessage
          message="Failed to load videos. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </Animated.View>
    );
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        className="flex-1 bg-black items-center justify-center px-6"
      >
        <ErrorMessage
          message="No videos available at the moment."
          onRetry={() => refetch()}
        />
      </Animated.View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        windowSize={3}
        maxToRenderPerBatch={2}
        initialNumToRender={1}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#ffffff"
            colors={['#ffffff']}
          />
        }
      />
    </View>
  );
};
