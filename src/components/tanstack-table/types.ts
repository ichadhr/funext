import { ColumnDef, Table } from '@tanstack/react-table';
import { DataGridProps } from '@fluentui/react-components';

export interface TableData {
    id: string | number;
    [key: string]: unknown;
}

// FluentTable will accept Fluent UI's TableColumnDefinition
export type FluentColumnDef<TData extends TableData, TValue = unknown> = ColumnDef<TData, TValue>;

export interface FluentTableProps<TData extends TableData> {
    data: TData[];
    tanStackColumns: FluentColumnDef<TData>[]; // TanStack specific column definitions (now required)
    // Allow passing through any other DataGridProps
    dataGridProps?: Omit<DataGridProps, 'items' | 'columns'>;
    getRowId?: (originalRow: TData) => string;
    topStartContent?: React.ReactNode;
    topEndContent?: React.ReactNode;
    bottomStartContent?: React.ReactNode;
    bottomEndContent?: React.ReactNode;
    layout?: TableLayout;
}

export type TableLayoutKey = 'topStart' | 'topEnd' | 'bottomStart' | 'bottomEnd';
export type TableControlKey = 'pageLength' | 'search' | 'info' | 'paging';

export type TableLayout = {
    [key in TableLayoutKey]?: TableControlKey;
};

export interface TablePaginationControlsProps<TData extends TableData> {
    table: Table<TData>;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    totalItems: number;
}

export interface TablePageSizeSelectProps<TData extends TableData> {
    table: Table<TData>;
    pageSize: number;
}

export interface TableSearchInputProps<TData extends TableData> {
    table: Table<TData>;
}

export interface TableInfoProps<TData extends TableData> {
    table: Table<TData>;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems: number;
}