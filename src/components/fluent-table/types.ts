import { ColumnDef } from "@tanstack/react-table";

export type TableControl = "pageSize" | "search" | "info" | "pagination";

export interface TableLayout {
    topStart?: TableControl;
    topEnd?: TableControl;
    bottomStart?: TableControl;
    bottomEnd?: TableControl;
}

export interface FluentTableProps<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData>[];
    layout?: TableLayout;
    striped?: boolean;
    size?: "small" | "medium" | "extra-small";
}