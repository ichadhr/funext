import { useState } from "react";
import { Table, SortingState } from "@tanstack/react-table";

export const useTableSorting = <TData extends object>(table: Table<TData>) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    return {
        sorting,
        setSorting,
        getSortedRowModel: table.getSortedRowModel(),
        onSortingChange: table.setSorting,
    };
};