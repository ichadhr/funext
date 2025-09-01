'use client';

import React, { useMemo, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  Row,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { useId, TableBody, TableCell, TableRow, Table, TableHeader, TableHeaderCell, Label, mergeClasses } from '@fluentui/react-components';

import { useServerSideTable } from '../../hooks/use-server-side-table';
import { useDebounce } from '../../hooks/use-debounce';
import { useIsMobile } from '@components/ui/hooks/use-mobile';
import { TableControl, TableLayout, FluentTableProps, ServerSideParams, ServerSideFluentTableProps } from '../../types';
import { SearchControl } from '../../controls/search-control';
import { PageSizeControl } from '../../controls/page-size-control';
import { PaginationControl } from '../../controls/pagination-control';
import { InfoControl } from '../../controls/info-control';
import { useStyles } from '../../styles';
import ErrorBoundary from '../../error-boundary';

export const ServerSideFluentTable = <TData extends object>({
  columns,
  layout = {
    topStart: "pageSize",
    topEnd: "search",
    bottomStart: "info",
    bottomEnd: "pagination",
  },
  striped,
  size = "small",
  event,
  serverSide,
}: ServerSideFluentTableProps<TData>) => {
  const { onInitializing, onInit, onSearch, onDraw, onOrder, onPageChange, onPageLengthChange, onPreDraw, onPreInit, onProcessing, onError, onServerRequest, onServerResponse, onServerError } = event || {};

  // Table state management
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Use the same filtering pattern as client-side for consistency
  const [globalFilter, setGlobalFilter] = React.useState('');
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  // Build server-side parameters
  const serverParams: ServerSideParams = useMemo(() => ({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sorting: sorting.map(sort => ({
      id: sort.id,
      desc: sort.desc,
    })),
    globalFilter: debouncedGlobalFilter, // Use debounced filter for server requests
  }), [pagination, sorting, debouncedGlobalFilter]);


  // Use server-side hook
  const {
    data: serverData,
    isLoading,
    isFetching,
    isError,
    error,
    recordsFiltered,
    recordsTotal,
  } = useServerSideTable(serverParams, serverSide, columns, {
    onServerRequest,
    onServerResponse,
    onServerError,
  });


  const tableId = useId();

  // Event handling
  const processingStartedRef = useRef(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [hasLoadedData, setHasLoadedData] = React.useState(false);
  const [previousData, setPreviousData] = React.useState<TData[]>([]);
  const [previousRecordsFiltered, setPreviousRecordsFiltered] = React.useState(0);
  const [previousRecordsTotal, setPreviousRecordsTotal] = React.useState(0);
  const isUserInteractionPendingRef = React.useRef(false);

  // Display data management - preserve previous data during fetches to prevent UI flicker
  const displayData = isFetching && previousData.length > 0 ? previousData : serverData;
  const displayRecordsFiltered = isFetching && previousRecordsFiltered > 0 ? previousRecordsFiltered : recordsFiltered;
  const displayRecordsTotal = isFetching && previousRecordsTotal > 0 ? previousRecordsTotal : recordsTotal;

  // Create table instance with display data (server data or previous data during fetches)
  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Disable client-side state management for server-side
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    // Set server-side state
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    // Server-side metadata
    rowCount: displayRecordsFiltered,
  });

  React.useEffect(() => {
    if (isInitializing) {
      onPreInit?.();
      onInit?.();
      setIsInitializing(false);
      onInitializing?.(false);
    }
  }, [onPreInit, onInit, onInitializing, isInitializing]);

  React.useEffect(() => {
    if (onDraw && serverData.length > 0) {
      onPreDraw?.();
      onDraw();
      // Mark that we've successfully loaded data
      if (!hasLoadedData) {
        setHasLoadedData(true);
      }
      // Save current data as previous data for next fetch
      setPreviousData(serverData);
      // Save current record counts for next fetch
      setPreviousRecordsFiltered(recordsFiltered);
      setPreviousRecordsTotal(recordsTotal);
    }
  }, [serverData, onDraw, onPreDraw, hasLoadedData, recordsFiltered, recordsTotal]);

  React.useEffect(() => {
    if (onOrder) {
      onOrder(sorting);
    }
  }, [sorting, onOrder]);

  React.useEffect(() => {
    if (onPageChange) {
      onPageChange(pagination.pageIndex, pagination.pageSize);
    }
    // Set loading state when pagination changes
    if (hasLoadedData) {
      isUserInteractionPendingRef.current = true;
    }
  }, [pagination.pageIndex, pagination.pageSize, onPageChange, hasLoadedData]);

  React.useEffect(() => {
    if (onPageLengthChange) {
      onPageLengthChange(pagination.pageSize);
    }
  }, [pagination.pageSize, onPageLengthChange]);

  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedGlobalFilter); // Use debounced filter for search events
    }
  }, [debouncedGlobalFilter, onSearch]);

  // Processing state management - follows documentation mapping
  React.useEffect(() => {
    // isFetching (any request) → onProcessing(true)
    if (isFetching && !processingStartedRef.current) {
      onProcessing?.(true);
      processingStartedRef.current = true;
    } else if (!isFetching && processingStartedRef.current) {
      onProcessing?.(false);
      processingStartedRef.current = false;
    }
  }, [isFetching, onProcessing]);

  // Error handling
  React.useEffect(() => {
    if (isError && error) {
      onError?.(error);
    }
  }, [isError, error, onError]);

  const classes = useStyles();
  const isMobile = useIsMobile();

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

  const TableHeaderContent = React.useCallback(() => (
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
                  {React.isValidElement(header.column.columnDef.header)
                    ? header.column.columnDef.header
                    : String(header.column.columnDef.header)}
                </Label>
              )}
            </TableHeaderCell>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  ), [table, isSingleSortableColumn, handleRowClick]);

  const TableBodySection = React.useCallback(() => (
    <TableBody className={striped ? classes.stripedRows : undefined}>
      {displayData.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            style={{ textAlign: "center" }}
          >
            {/* Show loading only for initial load; subsequent fetches preserve previous data */}
            {isLoading && !hasLoadedData ? "Loading..." : "No data available"}
          </TableCell>
        </TableRow>
      ) : (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {React.isValidElement(cell.column.columnDef.cell)
                  ? React.cloneElement(cell.column.columnDef.cell as React.ReactElement, cell.getContext())
                  : String(cell.getValue())}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  ), [table, striped, columns.length, displayData, isLoading, hasLoadedData, classes.stripedRows]);

  const renderControl = React.useCallback((controlType?: TableControl) => {
    switch (controlType) {
      case "pageSize":
        return <PageSizeControl
          table={table}
          getStatePagination={{ pageSize: pagination.pageSize }}
          setPageSize={(size) => setPagination(prev => ({ ...prev, pageSize: size }))}
        />;
      case "search":
        return <SearchControl globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;
      case "info":
        return <InfoControl
          table={table}
          currentPage={pagination.pageIndex}
          pageSize={pagination.pageSize}
          serverSideTotalRecords={displayRecordsFiltered}
          serverSideCurrentRows={displayData.length}
        />;
      case "pagination":
        return (
          <PaginationControl
            previousPage={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            getCanPreviousPage={() => pagination.pageIndex > 0}
            nextPage={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            getCanNextPage={() => pagination.pageIndex < Math.ceil(displayRecordsFiltered / pagination.pageSize) - 1}
            getPageCount={() => Math.ceil(displayRecordsFiltered / pagination.pageSize)}
            getStatePagination={{ pageIndex: pagination.pageIndex }}
            setPageIndex={(index: number | ((old: number) => number)) => setPagination(prev => ({ ...prev, pageIndex: typeof index === 'function' ? index(prev.pageIndex) : index }))}
            disabled={isFetching}
            isFetching={isFetching}
          />
        );
      default:
        return null;
    }
  }, [table, pagination, setPagination, globalFilter, setGlobalFilter, displayRecordsFiltered, displayData, isFetching]);

  const MobileCardRow = React.memo<{ row: Row<TData>; classes: ReturnType<typeof useStyles> }>(({ row, classes }) => (
    <div className={classes.mobileCard}>
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id} className={classes.mobileCardItem}>
          <span className={classes.mobileCardLabel}>
            {typeof cell.column.columnDef.header === 'string'
              ? cell.column.columnDef.header
              : cell.column.id}:
          </span>
          <span className={classes.mobileCardValue}>
            {React.isValidElement(cell.column.columnDef.cell)
              ? React.cloneElement(cell.column.columnDef.cell as React.ReactElement, cell.getContext())
              : String(cell.getValue())}
          </span>
        </div>
      ))}
    </div>
  ));
  MobileCardRow.displayName = 'MobileCardRow';

  return (
    <ErrorBoundary onError={onError}>

      <div style={{ position: 'relative' }}>
        {/* Loading overlay - shown during fetches after initial load */}
        {isFetching && hasLoadedData && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 16px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              fontSize: '14px',
              color: '#666'
            }}
            aria-live="polite"
          >
            Loading...
          </div>
        )}


        <div className={classes.topControlsWrapper}>
          <div>{renderControl(layout?.topStart)}</div>
          <div>{renderControl(layout?.topEnd)}</div>
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
              size={size}
              aria-label="Server-side table"
            >
              <TableHeaderContent />
              <TableBodySection />
            </Table>
          </div>
        )}
        <div className={classes.bottomControlsWrapper}>
          <div>{renderControl(layout?.bottomStart)}</div>
          <div>{renderControl(layout?.bottomEnd)}</div>
        </div>
      </div>
    </ErrorBoundary>
  );
};