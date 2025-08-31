import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { useDebounce } from "./use-debounce";

export const useTableFiltering = <TData extends object>(table: Table<TData>, debounceDelay: number = 500) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const debouncedGlobalFilter = useDebounce(globalFilter, debounceDelay);

    return {
        globalFilter,
        setGlobalFilter,
        debouncedGlobalFilter,
        getFilteredRowModel: table.getFilteredRowModel(),
        onGlobalFilterChange: table.setGlobalFilter,
    };
};