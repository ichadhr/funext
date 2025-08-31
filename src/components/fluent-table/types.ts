import { ColumnDef, SortingState } from "@tanstack/react-table";

export type TableControl = "pageSize" | "search" | "info" | "pagination";

export interface TableLayout {
    topStart?: TableControl;
    topEnd?: TableControl;
    bottomStart?: TableControl;
    bottomEnd?: TableControl;
}

export interface FluentTableEventHandlers {
    onDraw?: () => void;
    onError?: (error: Error) => void;
    onInit?: () => void;
    onSearch?: (filterValue: string) => void;
    onOrder?: (sorting: SortingState) => void; // Add onOrder event handler
}

export interface FluentTableProps<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData>[];
    layout?: TableLayout;
    striped?: boolean;
    size?: "small" | "medium" | "extra-small";
    event?: FluentTableEventHandlers;
}