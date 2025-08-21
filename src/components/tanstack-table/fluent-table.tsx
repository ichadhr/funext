import * as React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState
} from '@tanstack/react-table';
import {
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridProps,
    makeStyles,
    tokens,
    DataGridCell,
} from '@fluentui/react-components';
import { Spinner, MessageBar } from '@fluentui/react-components'; // Keep imports for use outside DataGrid
import { FluentTableProps, TableData, TableControlKey } from './types';
import { TableSearchInput, TablePaginationControls, TablePageSizeSelect, TableInfo } from './controls';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingHorizontalM,
    },
    topControls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    bottomControls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    tableWrapper: {
        overflowX: 'auto',
        position: 'relative', // Needed for absolute positioning of overlay
        minHeight: '200px', // Add a minimum height to ensure overlay has space
    },
    dataGridBodyOverlay: {
        position: 'absolute',
        top: '48px', // Approximate height of DataGridHeader
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it's above the table content
    },
    topStart: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    topEnd: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    bottomStart: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    bottomEnd: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
});

export function FluentTable<TData extends TableData>(props: FluentTableProps<TData>) {
    const {
        data,
        tanStackColumns,
        dataGridProps,
        getRowId,
        layout,
        manualPagination,
        manualSorting,
        manualFiltering,
        rowCount,
        onFetchData,
        loading,
        error,
        onColumnFiltersChange,
    } = props;

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns: tanStackColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
        getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        enableSorting: true,
        manualPagination: manualPagination,
        manualSorting: manualSorting,
        manualFiltering: manualFiltering,
        pageCount: rowCount !== undefined ? Math.ceil(rowCount / pagination.pageSize) : undefined,
        getRowId: getRowId || ((row) => String(row.id)),
        state: {
            pagination,
            globalFilter,
            sorting,
            columnFilters,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnFiltersChange: onColumnFiltersChange || setColumnFilters,
    });

    const renderControl = (key?: TableControlKey) => {
        switch (key) {
            case 'pageLength':
                return (
                    <TablePageSizeSelect<TData>
                        table={table}
                        pageSize={table.getState().pagination.pageSize}
                    />
                );
            case 'search':
                return (
                    <TableSearchInput<TData>
                        table={table}
                        onSearchChange={manualFiltering ? setGlobalFilter : undefined}
                    />
                );
            case 'info':
                return (
                    <TableInfo<TData>
                        table={table}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageSize={table.getState().pagination.pageSize}
                        pageCount={table.getPageCount()}
                        totalItems={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                    />
                );
            case 'paging':
                return (
                    <TablePaginationControls<TData>
                        table={table}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageSize={table.getState().pagination.pageSize}
                        pageCount={table.getPageCount()}
                        canPreviousPage={table.getCanPreviousPage()}
                        canNextPage={table.getCanNextPage()}
                        totalItems={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                    />
                );
            default:
                return null;
        }
    };

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const sortingState = table.getState().sorting;
    const globalFilterState = table.getState().globalFilter;

    React.useEffect(() => {
        if (onFetchData && (manualPagination || manualSorting || manualFiltering)) {
            onFetchData({
                pagination: { pageIndex, pageSize },
                sorting: sortingState,
                globalFilter: globalFilterState,
                columnFilters: columnFilters,
            });
        }
    }, [
        onFetchData,
        manualPagination,
        manualSorting,
        manualFiltering,
        pageIndex,
        pageSize,
        sortingState,
        globalFilterState,
        columnFilters,
        table,
    ]);

    const [sortState, setSortState] = React.useState<Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]>(
        {
            sortColumn: "",
            sortDirection: "ascending",
        }
    );

    const onSortChange: DataGridProps["onSortChange"] = React.useCallback((e: React.MouseEvent, nextSortState: Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]) => {
        setSortState(nextSortState);
        const tanstackSort = nextSortState.sortColumn
            ? [{ id: nextSortState.sortColumn.toString(), desc: nextSortState.sortDirection === "descending" }]
            : [];
        table.setSorting(tanstackSort);
    }, [table]);

    const fluentUiDataGridColumns = React.useMemo(() => {
        return table.getAllColumns().map(column => {
            return {
                columnId: column.id,
                renderHeaderCell: () => {
                    const header = table.getHeaderGroups().flatMap(hg => hg.headers).find(h => h.column.id === column.id);
                    return header ? flexRender(header.column.columnDef.header, header.getContext()) : null;
                },
                renderCell: (item: TData) => {
                    const itemId = getRowId ? getRowId(item) : String(item.id);
                    const row = table.getRowModel().rowsById[itemId]; // Access directly by ID
                    if (!row) {
                        // If the row is not found, it means this item is stale.
                        // We can return null or a placeholder to prevent the error.
                        // console.warn(`Stale item detected: row with ID ${itemId} not found in current table model.`); // Keep this if you want to keep the warning
                        return null;
                    }
                    const cell = row.getVisibleCells().find(c => c.column.id === column.id);
                    return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null;
                },
                sortable: column.getCanSort(),
                compare: () => {
                    return 0;
                },
            } as DataGridProps['columns'][number];
        });
    }, [table, getRowId]);

    const styles = useStyles();

    const { topStartContent, topEndContent, bottomStartContent, bottomEndContent } = props;

    return (
        <div className={styles.root}>
            <div className={styles.topControls}>
                <div className={styles.topStart}>
                    {layout?.topStart ? renderControl(layout.topStart) : topStartContent || <TableSearchInput table={table} onSearchChange={manualFiltering ? setGlobalFilter : undefined} />}
                </div>
                <div className={styles.topEnd}>
                    {layout?.topEnd ? renderControl(layout.topEnd) : topEndContent}
                </div>
            </div>
            {error && (
                <MessageBar intent="error" style={{ margin: '20px' }}>
                    Error: {error}
                </MessageBar>
            )}
            <div className={styles.tableWrapper}>
                {loading && (
                    <div className={styles.dataGridBodyOverlay}>
                        <Spinner label="Loading data..." />
                    </div>
                )}
                <DataGrid
                    items={table.getRowModel().rows.map(row => row.original)}
                    columns={fluentUiDataGridColumns}
                    sortable
                    sortState={sortState}
                    onSortChange={onSortChange}
                    {...dataGridProps}
                >
                    <DataGridHeader>
                        <DataGridRow<TData>>
                            {({ renderHeaderCell, columnId }) => {
                                const column = table.getColumn(String(columnId));
                                const isSorted = column?.getIsSorted();
                                const sortDirection = isSorted === "asc" ? "ascending" : isSorted === "desc" ? "descending" : undefined;
                                return (
                                    <DataGridHeaderCell
                                        key={columnId}
                                        onClick={() => {
                                            if (column?.getCanSort()) {
                                                column.toggleSorting(column.getIsSorted() === "asc");
                                            }
                                        }}
                                        sortDirection={sortDirection}
                                    >
                                        {renderHeaderCell()}
                                    </DataGridHeaderCell>
                                );
                            }}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<TData>>
                        {({ item, rowId }) => (
                            <DataGridRow<TData> key={rowId}>
                                {({ renderCell }) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
                {!loading && !error && table.getRowModel().rows.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>No data available.</div>
                )}
            </div>
            <div className={styles.bottomControls}>
                <div className={styles.bottomStart}>
                    {layout?.bottomStart ? renderControl(layout.bottomStart) : bottomStartContent || (
                        <TablePaginationControls
                            table={table}
                            pageIndex={table.getState().pagination.pageIndex}
                            pageSize={table.getState().pagination.pageSize}
                            pageCount={table.getPageCount()}
                            canPreviousPage={table.getCanPreviousPage()}
                            canNextPage={table.getCanNextPage()}
                            totalItems={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                        />
                    )}
                </div>
                <div className={styles.bottomEnd}>
                    {layout?.bottomEnd ? renderControl(layout.bottomEnd) : bottomEndContent || (
                        <TablePageSizeSelect
                            table={table}
                            pageSize={table.getState().pagination.pageSize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
