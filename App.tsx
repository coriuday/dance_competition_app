import './global.css';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { logger } from './src/utils/logger';

// Create a client for React Query with comprehensive error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Set up global error handler for React Query
queryClient.getQueryCache().config.onError = (error) => {
  logger.error('Query Cache Error', error);
};

queryClient.getMutationCache().config.onError = (error) => {
  logger.error('Mutation Cache Error', error);
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
