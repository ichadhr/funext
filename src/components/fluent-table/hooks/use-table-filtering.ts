import { useState } from "react";
import { Table } from "@tanstack/react-table";

export const useTableFiltering = <TData extends object>(table: Table<TData>) => {
    const [globalFilter, setGlobalFilter] = useState("");
    return {
        globalFilter,
        setGlobalFilter,
        getFilteredRowModel: table.getFilteredRowModel(),
        onGlobalFilterChange: table.setGlobalFilter,
    };
};