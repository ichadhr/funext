'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryClientProviderProps {
    children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Default stale time for queries (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Default cache time (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry failed queries up to 3 times
            retry: 3,
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
        },
    },
});

export const QueryProvider: React.FC<QueryClientProviderProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryProvider;