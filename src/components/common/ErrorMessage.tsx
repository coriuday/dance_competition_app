/**
 * ErrorMessage Component
 * 
 * User-friendly error display with retry functionality
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? 'flex-1 justify-center items-center bg-gray-50 px-6'
    : 'justify-center items-center py-8 px-6';

  const handleRetry = async () => {
    if (onRetry) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onRetry();
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} className={containerClass}>
      <Animated.View 
        entering={BounceIn.delay(100)}
        className="bg-white rounded-lg p-6 shadow-md max-w-md w-full"
      >
        <Text className="text-xl font-bold text-red-600 mb-3 text-center">
          Error
        </Text>
        
        <Text className="text-gray-700 text-base mb-6 text-center">
          {message}
        </Text>

        {onRetry && (
          <TouchableOpacity
            onPress={handleRetry}
            className="bg-blue-600 py-3 px-6 rounded-lg active:bg-blue-700"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base text-center">
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};
