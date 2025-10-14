/**
 * VideoControls Component
 * 
 * Video interaction controls including like button and metadata display
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { VideoWithUser } from '../../types/video.types';
import { useToggleLike } from '../../hooks/useVideos';

interface VideoControlsProps {
  videoData: VideoWithUser;
  className?: string;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  videoData,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const likeScale = useSharedValue(1);
  const toggleLikeMutation = useToggleLike();

  const handleLikePress = async () => {
    // Trigger haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate the like button with spring
    likeScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );

    // Toggle like state
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Call mutation
    toggleLikeMutation.mutate({
      videoId: videoData.id,
      isLiked: isLiked, // Pass current state (before toggle)
    });
  };

  const animatedLikeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  // Format likes count for display
  const formatLikesCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View className={`absolute bottom-0 left-0 right-0 p-4 ${className}`}>
      {/* Gradient overlay for better text visibility */}
      <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      <View className="flex-row justify-between items-end">
        {/* Video Metadata */}
        <View className="flex-1 mr-4">
          {/* Username */}
          <Text className="text-white font-bold text-lg mb-1">
            @{videoData.user?.username || 'Unknown'}
          </Text>
          
          {/* Title */}
          <Text className="text-white text-base mb-2" numberOfLines={2}>
            {videoData.title}
          </Text>
          
          {/* Description (if available) */}
          {videoData.description && (
            <Text className="text-white/80 text-sm" numberOfLines={2}>
              {videoData.description}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="items-center space-y-4">
          {/* Like Button */}
          <TouchableOpacity
            onPress={handleLikePress}
            activeOpacity={0.7}
            className="items-center"
          >
            <Animated.View
              style={animatedLikeStyle}
              className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1"
            >
              <Text className="text-3xl">
                {isLiked ? '❤️' : '🤍'}
              </Text>
            </Animated.View>
            <Text className="text-white text-xs font-semibold">
              {formatLikesCount(videoData.likes)}
            </Text>
          </TouchableOpacity>

          {/* Views Count */}
          <View className="items-center mt-4">
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1">
              <Text className="text-2xl">👁️</Text>
            </View>
            <Text className="text-white text-xs font-semibold">
              {formatLikesCount(videoData.views)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
