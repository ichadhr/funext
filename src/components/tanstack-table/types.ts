import { ColumnDef, Table, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { DataGridProps } from '@fluentui/react-components';

export interface TableData {
    id: string | number;
    [key: string]: unknown;
}

// FluentTable will accept Fluent UI's TableColumnDefinition
export type FluentColumnDef<TData extends TableData, TValue = unknown> = ColumnDef<TData, TValue> & {
    compare?: (a: TData, b: TData) => number;
};
export type { ColumnDef };

export interface FluentTableProps<TData extends TableData> {
    data: TData[];
    dataColumns: FluentColumnDef<TData>[]; // TanStack specific column definitions (now required)
    // Allow passing through any other DataGridProps
    dataGridProps?: Omit<DataGridProps, 'items' | 'columns'>;
    getRowId?: (originalRow: TData) => string;
    topStartContent?: React.ReactNode;
    topEndContent?: React.ReactNode;
    bottomStartContent?: React.ReactNode;
    bottomEndContent?: React.ReactNode;
    layout?: TableLayout;
    optionControl?: OptionControlConfig; // New prop for detailed control options
    // New props for server-side processing
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    rowCount?: number; // Total items from server
    onFetchData?: (state: TableState) => void; // Callback for server data fetch
    loading?: boolean; // Server-side loading status
    error?: string | null; // Server-side error message
    onColumnFiltersChange?: (updater: Updater<ColumnFiltersState>) => void;
}

export interface TableState {
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    sorting: Array<{
        id: string;
        desc: boolean;
    }>;
    globalFilter: string;
    columnFilters: ColumnFiltersState;
}

export type TableLayoutKey = 'topStart' | 'topEnd' | 'bottomStart' | 'bottomEnd';

export type TableControlPlacement = 'search' | 'pageLength' | 'info' | 'paging' | 'none';

export type TableLayout = {
    [key in TableLayoutKey]?: TableControlPlacement;
};

export interface OptionControlConfig {
    search?: { label?: string; placeholder?: string; };
    pageLength?: { label?: string; length?: number[]; };
    info?: object;
    paging?: object;
}

export interface TablePaginationControlsProps<TData extends TableData> {
    table: Table<TData>;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    totalRows: number;
    loading?: boolean;
}

export interface TablePageSizeSelectProps<TData extends TableData> {
    table: Table<TData>;
    label?: string;
    length?: number[];
    totalRows: number;
    loading?: boolean;
}

export interface TableSearchInputProps<TData extends TableData> {
    table: Table<TData>;
}

export interface TableInfoProps<TData extends TableData> {
    table: Table<TData>;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalRows: number;
}