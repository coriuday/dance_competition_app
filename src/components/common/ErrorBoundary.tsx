/**
 * ErrorBoundary Component
 * 
 * Catches React errors and displays a fallback UI
 * Logs errors for debugging in development mode
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging in development mode
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
          <View className="bg-white rounded-lg p-6 shadow-lg max-w-md">
            <Text className="text-2xl font-bold text-red-600 mb-4 text-center">
              Oops! Something went wrong
            </Text>
            
            <Text className="text-gray-700 text-base mb-6 text-center">
              We encountered an unexpected error. Please try again.
            </Text>

            {__DEV__ && this.state.error && (
              <View className="bg-gray-100 p-4 rounded mb-4">
                <Text className="text-xs font-mono text-gray-800 mb-2">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-xs font-mono text-gray-600" numberOfLines={5}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={this.handleReset}
              className="bg-blue-600 py-3 px-6 rounded-lg active:bg-blue-700"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
