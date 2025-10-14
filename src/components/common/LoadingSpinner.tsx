/**
 * LoadingSpinner Component
 * 
 * Consistent loading indicator used throughout the app
 */

import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#2563eb',
  message,
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? 'flex-1 justify-center items-center bg-gray-50'
    : 'justify-center items-center py-8';

  return (
    <Animated.View entering={FadeIn.duration(300)} className={containerClass}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-gray-600 text-base mt-4 text-center">
          {message}
        </Text>
      )}
    </Animated.View>
  );
};
