/**
 * LeaderboardScreen Component
 * 
 * Displays the competition leaderboard with rankings and scores
 */

import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardItem } from '../../components/leaderboard/LeaderboardItem';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import type { LeaderboardEntryWithUser } from '../../types/leaderboard.types';

export const LeaderboardScreen: React.FC = () => {
  const { data: leaderboard, isLoading, error, refetch, isRefetching } = useLeaderboard({
    limit: 100,
  });

  /**
   * Render individual leaderboard item
   */
  const renderItem = ({ item, index }: { item: LeaderboardEntryWithUser; index: number }) => (
    <LeaderboardItem entry={item} index={index} />
  );

  /**
   * Render header with title and description
   */
  const renderHeader = () => (
    <Animated.View entering={FadeInDown.springify()} className="mb-6">
      <Text className="text-3xl font-bold text-gray-900 mb-2">
        Leaderboard
      </Text>
      <Text className="text-gray-600 text-base">
        Top dancers competing for the crown 👑
      </Text>
    </Animated.View>
  );

  /**
   * Render empty state when no data
   */
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View className="items-center justify-center py-12">
        <Text className="text-6xl mb-4">🏆</Text>
        <Text className="text-gray-900 text-xl font-semibold mb-2">
          No Rankings Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
          Be the first to compete and claim the top spot!
        </Text>
      </View>
    );
  };

  /**
   * Show loading spinner on initial load
   */
  if (isLoading && !leaderboard) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  /**
   * Show error message if fetch failed
   */
  if (error && !leaderboard) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 px-4 justify-center">
          <ErrorMessage
            message={error.message || 'Failed to load leaderboard'}
            onRetry={() => refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <FlatList
        data={leaderboard || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 32,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#2563eb"
            colors={['#2563eb']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
