import { ServerResponse, ServerSideParams } from '../../../types';

export interface RestResponse<TData = unknown> {
    data: TData[];
    recordsFiltered: number;
    recordsTotal?: number;
}

/**
 * Validates and transforms a REST API response to the standard ServerResponse format
 */
export function transformRestResponse<TData = unknown>(
    response: unknown
): ServerResponse<TData> {
    // Type guard to check if response matches expected structure
    function isValidRestResponse(obj: unknown): obj is RestResponse<TData> {
        const response = obj as Record<string, unknown>;
        return (
            obj !== null &&
            typeof obj === 'object' &&
            'data' in response &&
            Array.isArray(response.data) &&
            'recordsFiltered' in response &&
            typeof response.recordsFiltered === 'number'
        );
    }

    if (!isValidRestResponse(response)) {
        throw new Error(
            'Invalid REST API response format. Expected { data: TData[], recordsFiltered: number, recordsTotal?: number }'
        );
    }

    const { data, recordsFiltered, recordsTotal } = response;

    // Validate data array
    if (!Array.isArray(data)) {
        throw new Error('REST API response data must be an array');
    }

    // Validate recordsFiltered
    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('REST API response recordsFiltered must be a non-negative number');
    }

    // Validate recordsTotal if provided
    if (recordsTotal !== undefined && (typeof recordsTotal !== 'number' || recordsTotal < 0)) {
        throw new Error('REST API response recordsTotal must be a non-negative number');
    }

    return {
        data,
        recordsFiltered,
        recordsTotal,
    };
}

/**
 * Checks if a response appears to be in REST API format
 */
export function isRestFormat(response: unknown): boolean {
    try {
        const resp = response as Record<string, unknown>;
        return (
            response !== null &&
            typeof response === 'object' &&
            'data' in resp &&
            Array.isArray(resp.data) &&
            'recordsFiltered' in resp &&
            typeof resp.recordsFiltered === 'number'
        );
    } catch {
        return false;
    }
}

/**
 * Creates a standardized REST API response
 */
export function createRestResponse<TData = unknown>(
    data: TData[],
    recordsFiltered: number,
    recordsTotal?: number
): RestResponse<TData> {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }

    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('recordsFiltered must be a non-negative number');
    }

    if (recordsTotal !== undefined && (typeof recordsTotal !== 'number' || recordsTotal < 0)) {
        throw new Error('recordsTotal must be a non-negative number');
    }

    return {
        data,
        recordsFiltered,
        recordsTotal,
    };
}

/**
 * Formats server-side parameters for REST API request
 */
export function formatRestRequest(params: ServerSideParams): {
    body: string;
    headers: Record<string, string>;
} {
    return {
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

/**
 * Makes a complete REST API request with proper formatting
 */
export async function makeRestRequest(
    url: string,
    params: ServerSideParams
): Promise<unknown> {
    const { body, headers } = formatRestRequest(params);

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`REST API request failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Creates a REST API query function for use with TanStack Query
 */
export function createRestQueryFn<TData = unknown>(url: string) {
    return async (params: ServerSideParams): Promise<ServerResponse<TData>> => {
        const response = await makeRestRequest(url, params);
        return response as ServerResponse<TData>;
    };
}