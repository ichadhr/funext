import { Table } from "@tanstack/react-table";

export const useTableSorting = <TData extends object>(table: Table<TData>) => {
    const sorting = table.getState().sorting;

    return {
        sorting,
        setSorting: table.setSorting, // Expose table's setSorting
        getSortedRowModel: table.getSortedRowModel(),
        onSortingChange: table.setSorting, // This is already correct
    };
};