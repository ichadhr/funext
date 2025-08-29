import { useState } from "react";
import { Table } from "@tanstack/react-table";

export const useTablePagination = <TData extends object>(table: Table<TData>) => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    return {
        pagination,
        setPagination,
        getPaginationRowModel: table.getPaginationRowModel(),
        onPaginationChange: table.setPagination,
        previousPage: table.previousPage,
        nextPage: table.nextPage,
        getCanPreviousPage: table.getCanPreviousPage,
        getCanNextPage: table.getCanNextPage,
        getPageCount: table.getPageCount,
        getStatePagination: table.getState().pagination,
        setPageSize: table.setPageSize,
        setPageIndex: table.setPageIndex, // Expose setPageIndex
    };
};