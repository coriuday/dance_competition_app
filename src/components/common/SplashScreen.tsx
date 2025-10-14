/**
 * Splash Screen Component
 * 
 * Displays a loading screen while the app initializes and checks for existing session.
 * Shows app branding and a loading indicator.
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const SplashScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center">
      {/* App Logo/Title */}
      <View className="mb-8">
        <Text className="text-4xl font-bold text-blue-500 mb-2">
          Dance Competition
        </Text>
        <Text className="text-lg text-slate-400 text-center">
          Loading your experience...
        </Text>
      </View>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
};
