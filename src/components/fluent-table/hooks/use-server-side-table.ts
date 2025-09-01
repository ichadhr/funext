import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
    ServerSideParams,
    ServerResponse,
    ServerSideOptions,
    ServerError
} from '../types';
import { transformDataTablesResponse, isDataTablesFormat, makeDataTablesRequest } from '../ext/server-side/api/datatables';
import { makeRestRequest } from '../ext/server-side/api/rest';
import { makeGraphQLRequest, transformGraphQLResponse } from '../ext/server-side/api/graphql';
import { ColumnDef } from '@tanstack/react-table';

export interface UseServerSideTableResult<TData> {
    data: TData[];
    isLoading: boolean;
    isFetching: boolean;
    isRefetching: boolean; // Background refetch indicator
    isError: boolean;
    error: ServerError | null;
    recordsFiltered: number;
    recordsTotal: number;
    refetch: () => void;
}

export function useServerSideTable<TData extends object>(
    params: ServerSideParams,
    options: ServerSideOptions<TData>,
    columns: ColumnDef<TData>[],
    eventHandlers?: {
        onServerRequest?: (params: ServerSideParams) => void;
        onServerResponse?: (response: ServerResponse<TData>) => void;
        onServerError?: (error: ServerError) => void;
    }
): UseServerSideTableResult<TData> {
    // Notify about server request
    useMemo(() => {
        eventHandlers?.onServerRequest?.(params);
    }, [params, eventHandlers]);

    const queryKey = options.queryKey(params);
    console.log('🔑 useServerSideTable Query key:', queryKey);

    const query = useQuery({
        queryKey,
        queryFn: async (): Promise<ServerResponse<TData>> => {
            console.log('🚀 useServerSideTable queryFn triggered for queryKey:', queryKey);
            try {
                let rawResponse: unknown;

                // Use appropriate request method based on data format
                if (options.dataFormat === 'datatables') {
                    // For DataTables, make request with proper form-encoded format
                    rawResponse = await makeDataTablesRequest(options.url, params, columns as ColumnDef<unknown>[]);
                } else if (options.dataFormat === 'graphql') {
                    // For GraphQL, make GraphQL request
                    rawResponse = await makeGraphQLRequest(options.url, params);
                } else {
                    // For REST API, use the provided queryFn
                    rawResponse = await options.queryFn(params);
                }

                // Transform response based on data format
                let transformedResponse: ServerResponse<TData> = rawResponse as ServerResponse<TData>;

                if (options.dataFormat === 'datatables') {
                    // Transform DataTables format to standard format
                    transformedResponse = transformDataTablesResponse(rawResponse, columns) as ServerResponse<TData>;
                } else if (options.dataFormat === 'graphql') {
                    // Transform GraphQL format to standard format
                    transformedResponse = transformGraphQLResponse(rawResponse) as ServerResponse<TData>;
                } else {
                    // Auto-detect format for 'rest' or unspecified
                    if (isDataTablesFormat(rawResponse)) {
                        transformedResponse = transformDataTablesResponse(rawResponse, columns) as ServerResponse<TData>;
                    }
                }

                // Notify about successful server response
                eventHandlers?.onServerResponse?.(transformedResponse);
                return transformedResponse;
            } catch (error) {
                // Transform error to ServerError format
                const serverError: ServerError = {
                    name: 'ServerError',
                    message: error instanceof Error ? error.message : 'Unknown server error',
                    type: 'server',
                    retryable: true,
                };

                // Add additional error properties if available
                if (error && typeof error === 'object') {
                    const errorObj = error as Record<string, unknown>;
                    if ('statusCode' in errorObj && typeof errorObj.statusCode === 'number') {
                        serverError.statusCode = errorObj.statusCode;
                    }
                    if ('type' in errorObj && typeof errorObj.type === 'string') {
                        serverError.type = errorObj.type as ServerError['type'];
                    }
                    if ('retryable' in errorObj && typeof errorObj.retryable === 'boolean') {
                        serverError.retryable = errorObj.retryable;
                    }
                    if ('details' in errorObj) {
                        serverError.details = errorObj.details;
                    }
                }

                eventHandlers?.onServerError?.(serverError);
                throw serverError;
            }
        },
        staleTime: 0, // Always fetch fresh data
        gcTime: 0, // Disable caching completely
        retry: options.retry ?? 3,
        refetchOnWindowFocus: options.refetchOnWindowFocus ?? false, // Disable automatic refetch
        refetchOnReconnect: options.refetchOnReconnect ?? false, // Disable automatic refetch
        refetchInterval: options.refetchInterval ?? false,
    });

    const result: UseServerSideTableResult<TData> = useMemo(() => ({
        data: query.data?.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isRefetching: query.isFetching && !query.isLoading, // Background refetch
        isError: query.isError,
        error: query.error as ServerError | null,
        recordsFiltered: query.data?.recordsFiltered ?? 0,
        recordsTotal: query.data?.recordsTotal ?? 0,
        refetch: query.refetch,
    }), [query]);

    console.log('📊 useServerSideTable result:', {
        dataLength: query.data?.data?.length ?? 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isRefetching: query.isFetching && !query.isLoading,
        isError: query.isError,
        recordsFiltered: query.data?.recordsFiltered ?? 0,
        recordsTotal: query.data?.recordsTotal ?? 0,
    });
    return result;
}