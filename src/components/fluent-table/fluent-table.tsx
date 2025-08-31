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
import { TableControl, TableLayout, FluentTableProps } from "./types";
import { SearchControl } from "./controls/search-control";
import { PageSizeControl } from "./controls/page-size-control";
import { PaginationControl } from "./controls/pagination-control";
import { InfoControl } from "./controls/info-control";
import { useStyles } from "./styles"; // Import useStyles
import ErrorBoundary from "./error-boundary"; // Import ErrorBoundary



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
}: FluentTableProps<TData>) => {
  const { onInitializing, onInit, onSearch, onDraw, onOrder, onPageChange, onPageLengthChange, onPreDraw, onPreInit, onProcessing, onError } = event || {}; // Destructure individual event handlers from event

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  const tableId = useId();

  // Extract state values for useEffect dependencies
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
    setPageIndex, // Destructure setPageIndex
  } = useTablePagination(table);
  const { sorting, setSorting } = useTableSorting(table);

  // Memoize table state values to ensure stable references for useEffect dependencies
  const memoizedPagination = useMemo(() => pagination, [pagination]);
  const memoizedSorting = useMemo(() => sorting, [sorting]);

  // Memoize the combined stable table state for onDraw dependencies
  // Memoize columnFilters separately to ensure referential stability
  const currentColumnFilters = table.getState().columnFilters;
  const memoizedColumnFilters = useMemo(() => currentColumnFilters, [currentColumnFilters]);

  // Memoize the combined stable table state for onDraw dependencies
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

  // Use useEffect to trigger onDraw when the debounced dependencies change
  // Ref to track if onDraw has already been called on mount (for StrictMode)
  const isMounted = useRef(false); // New ref to track if component is mounted
  const processingStartedRef = useRef(false); // New ref
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true); // New state for initialization

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      onInitializing?.(true); // Notify that initialization has started
    }
  }, [onInitializing]); // This useEffect runs only once on mount

  React.useEffect(() => {
    if (isMounted.current) { // Ensure it runs only after initial mount setup
      onPreInit?.(); // Call onPreInit before onInit
      onInit?.(); // Call onInit after onPreInit
      setIsInitializing(false); // Initialization ends
      onInitializing?.(false); // Notify that initialization has ended
    }
  }, [onPreInit, onInit, onInitializing, isMounted]); // Remove table state dependencies

  React.useEffect(() => {
    if (onDraw && !isInitializing) { // Only fire if not initializing
      onPreDraw?.(); // Call onPreDraw before onDraw
      onDraw();
      setIsProcessing(false); // Processing ends after draw
      onProcessing?.(false); // Notify that processing has ended
      processingStartedRef.current = false; // Reset processing started flag
    }
  }, [debouncedOnDrawDependencies, onDraw, onPreDraw, onProcessing, isInitializing]);

  React.useEffect(() => {
    if (onOrder) { // Removed !isInitializing guard
      onOrder?.(memoizedSorting);
    }
  }, [memoizedSorting, onOrder]); // Removed isInitializing from dependencies

  React.useEffect(() => {
    if (onPageChange) { // Removed !isInitializing guard
      onPageChange?.(memoizedPagination.pageIndex, memoizedPagination.pageSize);
    }
  }, [memoizedPagination.pageIndex, memoizedPagination.pageSize, onPageChange]); // Removed isInitializing from dependencies

  React.useEffect(() => {
    if (onPageLengthChange) { // Removed !isInitializing guard
      onPageLengthChange?.(memoizedPagination.pageSize);
    }
  }, [memoizedPagination.pageSize, onPageLengthChange]); // Removed isInitializing from dependencies


  const classes = useStyles(); // Call useStyles at the top level
  const isMobile = useIsMobile(); // Use the useIsMobile hook

  React.useMemo(
    () => {
      // Only start processing if not in the initial initialization phase AND processing hasn't started yet for this cycle
      if (!isInitializing && !processingStartedRef.current) { // Add processingStartedRef.current check
        setIsProcessing(true); // Processing starts
        onProcessing?.(true); // Notify that processing has started
        processingStartedRef.current = true; // Mark processing as started
      }
      table.setGlobalFilter(debouncedGlobalFilter);
      table.setPagination(memoizedPagination);
      table.setSorting(memoizedSorting);
    },
    [debouncedGlobalFilter, memoizedPagination, memoizedSorting, table, onProcessing, isInitializing]
  );

  React.useEffect(() => {
    if (onSearch) { // Removed !isInitializing guard
      onSearch?.(debouncedGlobalFilter);
    }
  }, [debouncedGlobalFilter, onSearch]); // Removed isInitializing from dependencies

  const sortableColumns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanSort()),
    [table]
  );

  const isSingleSortableColumn = sortableColumns.length === 1;
  const singleSortableColumn = isSingleSortableColumn ? sortableColumns[0] : undefined;

  const handleRowClick = React.useCallback(() => {
    if (singleSortableColumn) {
      singleSortableColumn.toggleSorting();
    }
  }, [singleSortableColumn]);

  const TableHeaderContent = React.useCallback((props: { classes: ReturnType<typeof useStyles> }) => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          onClick={isSingleSortableColumn ? handleRowClick : undefined}
          style={{
            cursor: isSingleSortableColumn ? "pointer" : "default",
          }}
        >
          {headerGroup.headers.map((header) => (
            <TableHeaderCell
              key={header.id}
              onClick={!isSingleSortableColumn ? header.column.getToggleSortingHandler() : undefined}
              sortDirection={header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : undefined}
              style={{
                cursor: !isSingleSortableColumn && header.column.getCanSort() ? "pointer" : "default",
              }}
            >
              {header.isPlaceholder ? null : (
                <Label
                  weight="semibold"
                  style={{ cursor: "inherit" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Label>
              )}
            </TableHeaderCell>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  ), [table, isSingleSortableColumn, handleRowClick]);

  const TableBodySection = React.useCallback((props: { classes: ReturnType<typeof useStyles> }) => (
    <TableBody className={striped ? props.classes.stripedRows : undefined}>
      {table.getRowModel().rows.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            style={{ textAlign: "center" }}
          >
            No data available
          </TableCell>
        </TableRow>
      ) : (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  ), [table, striped, columns.length]);

  const renderControl = React.useCallback((controlType?: TableControl) => {
    switch (controlType) {
      case "pageSize":
        return <PageSizeControl table={table} getStatePagination={getStatePagination} setPageSize={setPageSize} />;
      case "search":
        return <SearchControl table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;
      case "info":
        return <InfoControl table={table} />;
      case "pagination":
        return <PaginationControl table={table} previousPage={previousPage} getCanPreviousPage={getCanPreviousPage} nextPage={nextPage} getCanNextPage={getCanNextPage} getPageCount={getPageCount} getStatePagination={getStatePagination} setPageIndex={setPageIndex} />;
      default:
        return null;
    }
  }, [table, getStatePagination, setPageSize, globalFilter, setGlobalFilter, previousPage, getCanPreviousPage, nextPage, getCanNextPage, getPageCount, setPageIndex]);

  const MobileCardRow = React.memo<{ row: Row<TData>; classes: ReturnType<typeof useStyles> }>(({ row, classes }) => (
    <div className={classes.mobileCard}>
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className={classes.mobileCardItem}>
          <span className={classes.mobileCardLabel}>
            {typeof cell.column.columnDef.header === 'string'
              ? cell.column.columnDef.header
              : cell.column.id}: {/* Fallback to column ID if header is not a string */}
          </span>
          <span className={classes.mobileCardValue}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </span>
        </div>
      ))}
    </div>
  ));
  MobileCardRow.displayName = 'MobileCardRow';

  return (
    <ErrorBoundary onError={onError}>
      <div className={classes.topControlsWrapper} style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex" }}>{renderControl(layout?.topStart)}</div>
        <div style={{ display: "flex" }}>{renderControl(layout?.topEnd)}</div>
      </div>
      {isMobile ? (
        <div className={mergeClasses(classes.mobileCardViewContainer, striped && classes.stripedCards)}>
          {table.getRowModel().rows.map((row) => (
            <MobileCardRow key={row.id} row={row} classes={classes} />
          ))}
        </div>
      ) : (
        <div className={classes.tableScrollContainer}>
          <Table
            id={tableId}
            size={size} // Pass the size prop here
            aria-label="Fluent table"
          >
            <TableHeaderContent classes={classes} /><TableBodySection classes={classes} />
          </Table>
        </div>
      )}
      <div className={classes.bottomControlsWrapper} style={{ marginTop: "10px" }}>
        <div>{renderControl(layout?.bottomStart)}</div>
        <div>{renderControl(layout?.bottomEnd)}</div>
      </div>
    </ErrorBoundary>
  );
};
