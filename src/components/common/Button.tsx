/**
 * Button Component
 * 
 * Reusable button component with multiple variants and loading state
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}) => {
  const isDisabled = disabled || loading;

  // Base styles
  const baseStyles = 'py-4 px-6 rounded-lg items-center justify-center';
  
  // Variant styles
  const variantStyles = {
    primary: isDisabled 
      ? 'bg-blue-300' 
      : 'bg-blue-600 active:bg-blue-700',
    secondary: isDisabled 
      ? 'bg-gray-300' 
      : 'bg-gray-600 active:bg-gray-700',
    outline: isDisabled 
      ? 'border-2 border-gray-300 bg-transparent' 
      : 'border-2 border-blue-600 bg-transparent active:bg-blue-50',
  };

  // Text styles
  const textStyles = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-white font-semibold text-base',
    outline: isDisabled 
      ? 'text-gray-300 font-semibold text-base' 
      : 'text-blue-600 font-semibold text-base',
  };

  const handlePress = async () => {
    if (!isDisabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#2563eb' : '#ffffff'} 
          size="small" 
        />
      ) : (
        <Text className={textStyles[variant]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
