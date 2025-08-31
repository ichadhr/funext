import { ColumnDef, SortingState } from "@tanstack/react-table";

export type TableControl = "pageSize" | "search" | "info" | "pagination";

export interface TableLayout {
    topStart?: TableControl;
    topEnd?: TableControl;
    bottomStart?: TableControl;
    bottomEnd?: TableControl;
}

export interface FluentTableEventHandlers {
    onInitializing?: (initializing: boolean) => void;
    onPreInit?: () => void;
    onInit?: () => void;
    onPreDraw?: () => void;
    onDraw?: () => void;
    onSearch?: (filterValue: string) => void;
    onOrder?: (sorting: SortingState) => void; // Add onOrder event handler
    onPageChange?: (pageIndex: number, pageSize: number) => void; // table's paging is updated
    onPageLengthChange?: (pageSize: number) => void;
    onProcessing?: (processing: boolean) => void;
    onError?: (error: Error) => void;
}

export interface FluentTableProps<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData>[];
    layout?: TableLayout;
    striped?: boolean;
    size?: "small" | "medium" | "extra-small";
    event?: FluentTableEventHandlers;
}