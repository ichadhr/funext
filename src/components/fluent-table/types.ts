import { ColumnDef, SortingState } from "@tanstack/react-table";
import { QueryKey } from "@tanstack/react-query";

export type TableControl = "pageSize" | "search" | "info" | "pagination";

export interface TableLayout {
    topStart?: TableControl;
    topEnd?: TableControl;
    bottomStart?: TableControl;
    bottomEnd?: TableControl;
}

// Server-side processing types
export interface ServerSideParams {
    pageIndex: number;
    pageSize: number;
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    globalFilter: string;
}

export interface ServerResponse<TData = unknown> {
    data: TData[];
    recordsFiltered: number;
    recordsTotal?: number;
}

export interface ServerError extends Error {
    type: 'network' | 'server' | 'validation' | 'auth' | 'timeout';
    statusCode?: number;
    retryable: boolean;
    details?: unknown;
}

export interface ServerSideOptions<TData> {
    url: string;
    queryKey: (params: ServerSideParams) => QueryKey;
    queryFn: (params: ServerSideParams) => Promise<ServerResponse<TData>>;
    dataFormat?: 'rest' | 'graphql' | 'datatables';
    staleTime?: number;
    cacheTime?: number;
    retry?: number | boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchInterval?: number | false;
}

export interface FluentTableEventHandlers {
    onInitializing?: (initializing: boolean) => void;
    onPreInit?: () => void;
    onInit?: () => void;
    onPreDraw?: () => void;
    onDraw?: () => void;
    onSearch?: (filterValue: string) => void;
    onOrder?: (sorting: SortingState) => void;
    onPageChange?: (pageIndex: number, pageSize: number) => void;
    onPageLengthChange?: (pageSize: number) => void;
    onProcessing?: (processing: boolean) => void;
    onError?: (error: Error | ServerError) => void;
    // Server-side specific events
    onServerRequest?: (params: ServerSideParams) => void;
    onServerResponse?: (response: ServerResponse) => void;
    onServerError?: (error: ServerError) => void;
}

export interface FluentTableProps<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData>[];
    layout?: TableLayout;
    striped?: boolean;
    size?: "small" | "medium" | "extra-small";
    event?: FluentTableEventHandlers;
    serverSide?: ServerSideOptions<TData>;
}