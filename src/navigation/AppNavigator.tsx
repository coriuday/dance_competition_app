import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth screens
import { LoginScreen, RegisterScreen } from '../screens/auth';

// Main screens
import { VideoFeedScreen } from '../screens/feed';
import { LeaderboardScreen } from '../screens/leaderboard';

// Components
import { SplashScreen } from '../components/common';

// Store
import { useAuthStore } from '../store/authStore';

// Navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  VideoFeed: undefined;
  Leaderboard: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack Navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Main Tab Navigator
function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        animation: 'shift',
      }}
    >
      <MainTab.Screen
        name="VideoFeed"
        component={VideoFeedScreen}
        options={{
          tabBarLabel: 'Videos',
        }}
      />
      <MainTab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Leaderboard',
        }}
      />
    </MainTab.Navigator>
  );
}

// Root App Navigator with conditional rendering
export default function AppNavigator() {
  const { isAuthenticated, isLoading, restoreAuth } = useAuthStore();

  useEffect(() => {
    // Restore authentication state from secure storage on app initialization
    restoreAuth();
  }, [restoreAuth]);

  // Show splash screen while checking authentication
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
