import { ServerResponse, ServerSideParams } from '../../../types';

export interface GraphQLResponse<TData = unknown> {
    data: {
        tableData: {
            items: TData[];
            recordsFiltered: number;
            recordsTotal?: number;
        };
    };
}

/**
 * Validates and transforms a GraphQL response to the standard ServerResponse format
 */
export function transformGraphQLResponse<TData = unknown>(
    response: unknown
): ServerResponse<TData> {
    // Type guard to check if response matches expected GraphQL structure
    function isValidGraphQLResponse(obj: unknown): obj is GraphQLResponse<TData> {
        const resp = obj as Record<string, unknown>;
        return (
            obj !== null &&
            typeof obj === 'object' &&
            'data' in resp &&
            typeof resp.data === 'object' &&
            resp.data !== null &&
            'tableData' in (resp.data as Record<string, unknown>) &&
            typeof (resp.data as Record<string, unknown>).tableData === 'object' &&
            (resp.data as Record<string, unknown>).tableData !== null
        );
    }

    if (!isValidGraphQLResponse(response)) {
        throw new Error(
            'Invalid GraphQL response format. Expected { data: { tableData: { items: TData[], recordsFiltered: number, recordsTotal?: number } } }'
        );
    }

    const { data: { tableData } } = response;
    const { items, recordsFiltered, recordsTotal } = tableData;

    // Validate items array
    if (!Array.isArray(items)) {
        throw new Error('GraphQL response items must be an array');
    }

    // Validate recordsFiltered
    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('GraphQL response recordsFiltered must be a non-negative number');
    }

    // Validate recordsTotal if provided
    if (recordsTotal !== undefined && (typeof recordsTotal !== 'number' || recordsTotal < 0)) {
        throw new Error('GraphQL response recordsTotal must be a non-negative number');
    }

    return {
        data: items,
        recordsFiltered,
        recordsTotal,
    };
}

/**
 * Checks if a response appears to be in GraphQL format
 */
export function isGraphQLFormat(response: unknown): boolean {
    try {
        const resp = response as Record<string, unknown>;
        return (
            response !== null &&
            typeof response === 'object' &&
            'data' in resp &&
            typeof resp.data === 'object' &&
            resp.data !== null &&
            'tableData' in (resp.data as Record<string, unknown>) &&
            typeof (resp.data as Record<string, unknown>).tableData === 'object' &&
            (resp.data as Record<string, unknown>).tableData !== null &&
            'items' in ((resp.data as Record<string, unknown>).tableData as Record<string, unknown>) &&
            'recordsFiltered' in ((resp.data as Record<string, unknown>).tableData as Record<string, unknown>)
        );
    } catch {
        return false;
    }
}

/**
 * Creates a standardized GraphQL response
 */
export function createGraphQLResponse<TData = unknown>(
    items: TData[],
    recordsFiltered: number,
    recordsTotal?: number
): GraphQLResponse<TData> {
    if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
    }

    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('recordsFiltered must be a non-negative number');
    }

    if (recordsTotal !== undefined && (typeof recordsTotal !== 'number' || recordsTotal < 0)) {
        throw new Error('recordsTotal must be a non-negative number');
    }

    return {
        data: {
            tableData: {
                items,
                recordsFiltered,
                recordsTotal,
            },
        },
    };
}

/**
 * Extracts table data from a GraphQL response
 */
export function extractTableDataFromGraphQL<TData = unknown>(
    response: GraphQLResponse<TData>
): { items: TData[]; recordsFiltered: number; recordsTotal?: number } {
    return response.data.tableData;
}

/**
 * GraphQL query template for table data
 */
export const TABLE_DATA_QUERY = `
  query GetTableData(
    $pageIndex: Int!
    $pageSize: Int!
    $sorting: [SortInput!]!
    $globalFilter: String
  ) {
    tableData(
      pageIndex: $pageIndex
      pageSize: $pageSize
      sorting: $sorting
      globalFilter: $globalFilter
    ) {
      items {
        id
        name
        position
        office
        startDate
        salary
      }
      recordsFiltered
      recordsTotal
    }
  }
`;

/**
 * Formats server-side parameters for GraphQL request
 */
export function formatGraphQLRequest(params: ServerSideParams): {
    query: string;
    variables: Record<string, unknown>;
} {
    return {
        query: TABLE_DATA_QUERY,
        variables: {
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
            sorting: params.sorting,
            globalFilter: params.globalFilter,
        },
    };
}

/**
 * Makes a GraphQL request with proper formatting
 */
export async function makeGraphQLRequest(
    url: string,
    params: ServerSideParams
): Promise<unknown> {
    const { query, variables } = formatGraphQLRequest(params);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return result;
}

/**
 * Creates a GraphQL query function for use with TanStack Query
 */
export function createGraphQLQueryFn<TData = unknown>(url: string) {
    return async (params: ServerSideParams): Promise<ServerResponse<TData>> => {
        const response = await makeGraphQLRequest(url, params);
        return response as ServerResponse<TData>;
    };
}