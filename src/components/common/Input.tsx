/**
 * Input Component
 * 
 * Reusable text input component with error display and validation
 */

import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  label,
  className = '',
  ...rest
}) => {
  const hasError = Boolean(error);

  return (
    <View className={`w-full ${className}`}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">
          {label}
        </Text>
      )}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9ca3af"
        className={`
          w-full px-4 py-3 rounded-lg border-2 text-base
          ${hasError 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white focus:border-blue-600'
          }
        `}
        {...rest}
      />
      
      {hasError && (
        <Animated.View entering={FadeInDown.duration(200)} className="mt-1">
          <Text className="text-red-500 text-sm">
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};
