import { Table } from "@tanstack/react-table";

export const useTablePagination = <TData extends object>(table: Table<TData>) => {
    const pagination = table.getState().pagination;

    return {
        pagination,
        setPagination: table.setPagination, // Expose table's setPagination
        getPaginationRowModel: table.getPaginationRowModel(),
        onPaginationChange: table.setPagination, // This is already correct
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