/**
 * LoginScreen Component
 * 
 * Handles user authentication with email and password
 */

import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button, Input, ErrorMessage } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import type { AuthStackParamList } from '../../navigation/AppNavigator';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, isLoggingIn, loginError } = useAuth();

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle login submission
   */
  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      login({ email: email.trim(), password });
      // Navigation to main app is handled automatically by AppNavigator
      // when authentication state changes
    } catch (error) {
      // Error is handled by useAuth hook
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Login error:', error);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md mx-auto">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).springify()} className="mb-8">
            <Text className="text-4xl font-bold text-text text-center mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-400 text-center">
              Sign in to continue to Dance Competition
            </Text>
          </Animated.View>

          {/* Error Message */}
          {loginError && (
            <View className="mb-4">
              <ErrorMessage
                message={loginError.message || 'Login failed. Please check your credentials.'}
                onRetry={clearError}
              />
            </View>
          )}

          {/* Login Form */}
          <Animated.View entering={FadeInUp.delay(200).springify()} className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              className="mb-4"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              error={errors.password}
              className="mb-6"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoggingIn}
              disabled={isLoggingIn}
              variant="primary"
              className="mb-4"
            />
          </Animated.View>

          {/* Register Link */}
          <Animated.View entering={FadeInUp.delay(300).springify()} className="mt-6 flex-row justify-center items-center">
            <Text className="text-gray-400 text-base">
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary font-semibold text-base">
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
