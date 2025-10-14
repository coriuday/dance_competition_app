/**
 * RegisterScreen Component
 * 
 * Handles user registration with email, password, and username
 */

import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button, Input, ErrorMessage } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import type { AuthStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { register, isRegistering, registerError } = useAuth();

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      username?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle registration submission
   */
  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      register({
        email: email.trim(),
        password,
        username: username.trim(),
      });
      // Navigation to main app is handled automatically by AppNavigator
      // when authentication state changes
    } catch (error) {
      // Error is handled by useAuth hook
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Registration error:', error);
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
              Create Account
            </Text>
            <Text className="text-base text-gray-400 text-center">
              Join the Dance Competition community
            </Text>
          </Animated.View>

          {/* Error Message */}
          {registerError && (
            <View className="mb-4">
              <ErrorMessage
                message={
                  registerError.message || 
                  'Registration failed. Please try again or use a different email.'
                }
                onRetry={clearError}
              />
            </View>
          )}

          {/* Registration Form */}
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
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              autoCapitalize="none"
              autoComplete="username"
              error={errors.username}
              className="mb-4"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              error={errors.password}
              className="mb-4"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              error={errors.confirmPassword}
              className="mb-6"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isRegistering}
              disabled={isRegistering}
              variant="primary"
              className="mb-4"
            />
          </Animated.View>

          {/* Login Link */}
          <Animated.View entering={FadeInUp.delay(300).springify()} className="mt-6 flex-row justify-center items-center">
            <Text className="text-gray-400 text-base">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary font-semibold text-base">
                Sign In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
