import { ServerResponse, ServerSideParams } from '../../../types';
import { ColumnDef } from '@tanstack/react-table';

export interface DataTablesResponse {
    recordsTotal: number;
    recordsFiltered: number;
    data: unknown[][];
    draw?: number;
}

/**
 * Transforms DataTables.net array format to standard ServerResponse format
 */
export function transformDataTablesResponse<TData = unknown>(
    response: unknown,
    columns: ColumnDef<TData>[]
): ServerResponse<TData> {
    // Type guard to check if response matches DataTables format
    function isValidDataTablesResponse(obj: unknown): obj is DataTablesResponse {
        const resp = obj as Record<string, unknown>;
        return (
            obj !== null &&
            typeof obj === 'object' &&
            'recordsTotal' in resp &&
            typeof resp.recordsTotal === 'number' &&
            'recordsFiltered' in resp &&
            typeof resp.recordsFiltered === 'number' &&
            'data' in resp &&
            Array.isArray(resp.data)
        );
    }

    if (!isValidDataTablesResponse(response)) {
        throw new Error(
            'Invalid DataTables response format. Expected { recordsTotal: number, recordsFiltered: number, data: any[][], draw?: number }'
        );
    }

    const { recordsTotal, recordsFiltered, data } = response;

    // Validate recordsTotal and recordsFiltered
    if (typeof recordsTotal !== 'number' || recordsTotal < 0) {
        throw new Error('DataTables response recordsTotal must be a non-negative number');
    }

    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('DataTables response recordsFiltered must be a non-negative number');
    }

    // Validate data array
    if (!Array.isArray(data)) {
        throw new Error('DataTables response data must be an array');
    }

    // Transform array data to object data using column indices
    const transformedData: TData[] = data.map((row, rowIndex) => {
        if (!Array.isArray(row)) {
            throw new Error(`DataTables response data[${rowIndex}] must be an array`);
        }

        const rowObject: Record<string, unknown> = {};

        columns.forEach((column, colIndex) => {
            // Use column index as the key for mapping array data to object
            const columnKey = `col_${colIndex}`;
            rowObject[columnKey] = row[colIndex];
        });

        return rowObject as TData;
    });

    return {
        data: transformedData,
        recordsFiltered,
        recordsTotal,
    };
}

/**
 * Checks if a response appears to be in DataTables.net format
 */
export function isDataTablesFormat(response: unknown): boolean {
    try {
        const resp = response as Record<string, unknown>;
        return (
            response !== null &&
            typeof response === 'object' &&
            'recordsTotal' in resp &&
            typeof resp.recordsTotal === 'number' &&
            'recordsFiltered' in resp &&
            typeof resp.recordsFiltered === 'number' &&
            'data' in resp &&
            Array.isArray(resp.data) &&
            resp.data.every((row: unknown) => Array.isArray(row))
        );
    } catch {
        return false;
    }
}

/**
 * Creates a standardized DataTables.net response
 */
export function createDataTablesResponse(
    recordsTotal: number,
    recordsFiltered: number,
    data: unknown[][],
    draw?: number
): DataTablesResponse {
    if (typeof recordsTotal !== 'number' || recordsTotal < 0) {
        throw new Error('recordsTotal must be a non-negative number');
    }

    if (typeof recordsFiltered !== 'number' || recordsFiltered < 0) {
        throw new Error('recordsFiltered must be a non-negative number');
    }

    if (!Array.isArray(data)) {
        throw new Error('Data must be an array of arrays');
    }

    // Validate that all rows are arrays
    data.forEach((row, index) => {
        if (!Array.isArray(row)) {
            throw new Error(`Data row ${index} must be an array`);
        }
    });

    return {
        recordsTotal,
        recordsFiltered,
        data,
        draw,
    };
}

/**
 * Transforms object data to DataTables array format
 */
export function transformToDataTablesArray<TData = unknown>(
    data: TData[],
    columns: ColumnDef<TData>[]
): unknown[][] {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }

    return data.map((item) => {
        const row: unknown[] = [];

        columns.forEach((column, colIndex) => {
            // Use column index to map object properties to array
            const columnKey = `col_${colIndex}`;
            if (typeof item === 'object' && item !== null) {
                const itemObj = item as Record<string, unknown>;
                row.push(itemObj[columnKey] ?? null);
            } else {
                row.push(null);
            }
        });

        return row;
    });
}

/**
 * Formats server-side parameters for DataTables request
 */
export function formatDataTablesRequest(
    params: ServerSideParams,
    columns: ColumnDef<unknown>[]
): {
    body: string;
    headers: Record<string, string>;
} {
    // Create form data in DataTables format
    const formData = new URLSearchParams();

    // Add basic parameters
    formData.append('draw', Math.floor(Math.random() * 1000000).toString());
    formData.append('start', (params.pageIndex * params.pageSize).toString());
    formData.append('length', params.pageSize.toString());
    formData.append('search[value]', params.globalFilter || '');
    formData.append('search[regex]', 'false');

    // Add order parameters
    params.sorting.forEach((sort, index) => {
        // Map the accessor key to column index
        const columnIndex = columns.findIndex(col =>
            'accessorKey' in col && col.accessorKey === sort.id
        );
        formData.append(`order[${index}][column]`, (columnIndex >= 0 ? columnIndex : 0).toString());
        formData.append(`order[${index}][dir]`, sort.desc ? 'desc' : 'asc');
    });

    // Add column parameters
    columns.forEach((column, index) => {
        formData.append(`columns[${index}][data]`, index.toString());
        formData.append(`columns[${index}][name]`, column.header as string);
        formData.append(`columns[${index}][searchable]`, 'true');
        formData.append(`columns[${index}][orderable]`, 'true');
        formData.append(`columns[${index}][search][value]`, '');
        formData.append(`columns[${index}][search][regex]`, 'false');
    });

    // Add cache buster
    formData.append('_', Date.now().toString());

    return {
        body: formData.toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
}

/**
 * Makes a DataTables request with proper formatting
 */
export async function makeDataTablesRequest(
  url: string,
  params: ServerSideParams,
  columns: ColumnDef<unknown>[]
): Promise<unknown> {
  const { body, headers } = formatDataTablesRequest(params, columns);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`DataTables request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Creates a DataTables query function for use with TanStack Query
 */
export function createDataTablesQueryFn<TData = unknown>(url: string, columns: ColumnDef<unknown>[]) {
  return async (params: ServerSideParams): Promise<ServerResponse<TData>> => {
    const response = await makeDataTablesRequest(url, params, columns);
    return response as ServerResponse<TData>;
  };
}