/**
 * LeaderboardItem Component
 * 
 * Displays an individual leaderboard entry with rank, user info, and score
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { LeaderboardEntryWithUser } from '../../types/leaderboard.types';

interface LeaderboardItemProps {
  entry: LeaderboardEntryWithUser;
  index: number;
}

/**
 * Get rank display styling based on position
 */
const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        container: 'bg-yellow-50 border-yellow-400',
        rank: 'bg-yellow-400 text-yellow-900',
        icon: '🥇',
      };
    case 2:
      return {
        container: 'bg-gray-50 border-gray-400',
        rank: 'bg-gray-400 text-gray-900',
        icon: '🥈',
      };
    case 3:
      return {
        container: 'bg-orange-50 border-orange-400',
        rank: 'bg-orange-400 text-orange-900',
        icon: '🥉',
      };
    default:
      return {
        container: 'bg-white border-gray-200',
        rank: 'bg-blue-500 text-white',
        icon: null,
      };
  }
};

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ entry, index }) => {
  const rank = entry.rank || index + 1;
  const username = entry.user?.username || 'Unknown User';
  const avatarUrl = entry.user?.avatar_url;
  const score = entry.score;

  const style = getRankStyle(rank);

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()}
      className={`flex-row items-center p-4 mb-3 rounded-xl border-2 ${style.container} shadow-sm`}
    >
      {/* Rank Badge */}
      <View className="items-center justify-center mr-4">
        <View 
          className={`w-12 h-12 rounded-full items-center justify-center ${style.rank}`}
        >
          {style.icon ? (
            <Text className="text-2xl">{style.icon}</Text>
          ) : (
            <Text className="text-white text-lg font-bold">#{rank}</Text>
          )}
        </View>
      </View>

      {/* User Avatar */}
      <View className="mr-3">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-12 h-12 rounded-full bg-gray-200"
            resizeMode="cover"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
            <Text className="text-blue-600 text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View className="flex-1">
        <Text className="text-gray-900 text-lg font-semibold" numberOfLines={1}>
          {username}
        </Text>
        <Text className="text-gray-500 text-sm">
          Rank #{rank}
        </Text>
      </View>

      {/* Score */}
      <View className="items-end">
        <Text className="text-gray-900 text-2xl font-bold">
          {score.toLocaleString()}
        </Text>
        <Text className="text-gray-500 text-xs">points</Text>
      </View>
    </Animated.View>
  );
};
