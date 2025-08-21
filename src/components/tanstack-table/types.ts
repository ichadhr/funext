import { ColumnDef } from '@tanstack/react-table';
import { DataGridProps, TableColumnDefinition } from '@fluentui/react-components';

export interface TableData {
    [key: string]: any; // This will be addressed later if needed
}

// FluentTable will accept Fluent UI's TableColumnDefinition
export type FluentColumnDef<TData extends TableData, TValue = unknown> = ColumnDef<TData, TValue>;

export interface FluentTableProps<TData extends TableData> {
    data: TData[];
    columns: TableColumnDefinition<TData>[]; // Fluent UI's column definitions
    tanStackColumns: FluentColumnDef<TData>[]; // TanStack specific column definitions (now required)
    // Allow passing through any other DataGridProps
    dataGridProps?: Omit<DataGridProps, 'items' | 'columns'>;
    topStartContent?: React.ReactNode;
    topEndContent?: React.ReactNode;
    bottomStartContent?: React.ReactNode;
    bottomEndContent?: React.ReactNode;
}