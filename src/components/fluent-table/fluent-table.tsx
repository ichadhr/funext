import React, { useMemo, useRef } from "react";
import {
  useId,
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Label,
  mergeClasses,
} from "@fluentui/react-components";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
} from "@tanstack/react-table";

export type { ColumnDef };
import { useTableFiltering } from "./hooks/use-table-filtering";
import { useTablePagination } from "./hooks/use-table-pagination";
import { useTableSorting } from "./hooks/use-table-sorting";
import { useDebounce } from "./hooks/use-debounce"; // Import useDebounce hook
import { useIsMobile } from "@components/ui/hooks/use-mobile"; // Import useIsMobile hook
import { useTableEvents } from "./hooks/use-table-events"; // Import custom event handling hook
import { useTableConfig } from "./utils/table-config"; // Import table configuration hook
import { TableRenderer } from "./components/table-renderer"; // Import table renderer component
import { TableControl, TableLayout, FluentTableProps } from "./types";
import { SearchControl } from "./controls/search-control";
import { PageSizeControl } from "./controls/page-size-control";
import { PaginationControl } from "./controls/pagination-control";
import { InfoControl } from "./controls/info-control";
import { useStyles } from "./styles"; // Import useStyles
import ErrorBoundary from "./error-boundary"; // Import ErrorBoundary
import { ServerSideFluentTable } from "./ext/server-side/server-side"; // Import server-side extension



export const FluentTable = <TData extends object>({
  data,
  columns,
  layout = {
    topStart: "pageSize",
    topEnd: "search",
    bottomStart: "info",
    bottomEnd: "pagination",
  },
  striped,
  size = "small", // Destructure size prop and set default to "small"
  event, // Destructure event prop
  serverSide, // Destructure serverSide prop
}: FluentTableProps<TData>) => {
  const { onError } = event || {}; // Keep onError for ErrorBoundary
  // Create table instance using configuration hook
  const table = useTableConfig({ data, columns });

  const tableId = useId();

  // Extract state values
  const { globalFilter, setGlobalFilter, debouncedGlobalFilter } = useTableFiltering(table);
  const {
    pagination,
    setPagination,
    previousPage,
    nextPage,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    getStatePagination,
    setPageSize,
    setPageIndex,
  } = useTablePagination(table);
  const { sorting, setSorting } = useTableSorting(table);

  // Memoize table state values
  const memoizedPagination = useMemo(() => pagination, [pagination]);
  const memoizedSorting = useMemo(() => sorting, [sorting]);
  const currentColumnFilters = table.getState().columnFilters;
  const memoizedColumnFilters = useMemo(() => currentColumnFilters, [currentColumnFilters]);

  // Memoize onDraw dependencies
  const onDrawDependencies = useMemo(() => ({
    pagination: memoizedPagination,
    sorting: memoizedSorting,
    debouncedGlobalFilter,
    columnFilters: memoizedColumnFilters,
    data,
    columns,
  }), [
    memoizedPagination,
    memoizedSorting,
    debouncedGlobalFilter,
    memoizedColumnFilters,
    data,
    columns,
  ]);

  // Debounce the combined dependencies
  const debouncedOnDrawDependencies = useDebounce(onDrawDependencies, 100);

  // Use custom hook for event handling
  const { isProcessing, isInitializing } = useTableEvents({
    table,
    event,
    pagination: memoizedPagination,
    sorting: memoizedSorting,
    debouncedGlobalFilter,
    data,
    columns,
    debouncedOnDrawDependencies,
  });

  const classes = useStyles();
  const isMobile = useIsMobile();

  const renderControl = React.useCallback((controlType?: TableControl) => {
    switch (controlType) {
      case "pageSize":
        return <PageSizeControl table={table} getStatePagination={getStatePagination} setPageSize={setPageSize} />;
      case "search":
        return <SearchControl globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;
      case "info":
        return <InfoControl table={table} />;
      case "pagination":
        return <PaginationControl table={table} previousPage={previousPage} getCanPreviousPage={getCanPreviousPage} nextPage={nextPage} getCanNextPage={getCanNextPage} getPageCount={getPageCount} getStatePagination={getStatePagination} setPageIndex={setPageIndex} />;
      default:
        return null;
    }
  }, [table, getStatePagination, setPageSize, globalFilter, setGlobalFilter, previousPage, getCanPreviousPage, nextPage, getCanNextPage, getPageCount, setPageIndex]);

  // Check if server-side processing is enabled
  if (serverSide) {
    return (
      <ServerSideFluentTable
        columns={columns}
        layout={layout}
        striped={striped}
        size={size}
        event={event}
        serverSide={serverSide}
      />
    );
  }

  // Client-side processing (existing behavior)
  return (
    <ErrorBoundary onError={onError}>
      <div className={classes.topControlsWrapper} style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex" }}>{renderControl(layout?.topStart)}</div>
        <div style={{ display: "flex" }}>{renderControl(layout?.topEnd)}</div>
      </div>
      <TableRenderer
        tableId={tableId}
        table={table}
        columns={columns}
        data={data}
        striped={striped}
        size={size}
        isMobile={isMobile}
      />
      <div className={classes.bottomControlsWrapper} style={{ marginTop: "10px" }}>
        <div>{renderControl(layout?.bottomStart)}</div>
        <div>{renderControl(layout?.bottomEnd)}</div>
      </div>
    </ErrorBoundary>
  );
};
