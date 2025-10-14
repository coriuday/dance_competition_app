/**
 * VideoPlayer Component
 * 
 * Video player component using expo-av with auto-play/pause functionality
 * based on viewport visibility.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import type { VideoWithUser } from '../../types/video.types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

interface VideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
  videoData: VideoWithUser;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  isActive,
  videoData: _videoData,
  onPlaybackStatusUpdate,
}) => {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { height: screenHeight } = Dimensions.get('window');

  // Handle auto-play/pause based on isActive prop
  useEffect(() => {
    const handlePlayback = async () => {
      if (!videoRef.current) return;

      try {
        if (isActive) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
      } catch (error) {
        console.error('Error controlling video playback:', error);
      }
    };

    handlePlayback();
  }, [isActive]);

  // Handle playback status updates
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setHasError(false);
    }

    if (onPlaybackStatusUpdate) {
      onPlaybackStatusUpdate(status);
    }
  };

  // Handle video load error
  const handleError = (error: string) => {
    console.error('Video load error:', error);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load video. Please try again.');
  };

  // Retry loading the video
  const handleRetry = async () => {
    setHasError(false);
    setIsLoading(true);
    setErrorMessage('');

    if (videoRef.current) {
      try {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          { uri: videoUrl },
          { shouldPlay: isActive },
          false
        );
      } catch (error) {
        handleError('Retry failed');
      }
    }
  };

  return (
    <View className="flex-1 bg-black" style={{ height: screenHeight }}>
      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isActive}
        isLooping
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => handleError(error)}
        className="absolute inset-0"
      />

      {/* Loading State */}
      {isLoading && !hasError && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <LoadingSpinner size="large" color="#ffffff" />
          <Text className="text-white mt-4 text-base">Loading video...</Text>
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View className="absolute inset-0 items-center justify-center bg-black px-6">
          <ErrorMessage
            message={errorMessage}
            onRetry={handleRetry}
          />
        </View>
      )}
    </View>
  );
};
