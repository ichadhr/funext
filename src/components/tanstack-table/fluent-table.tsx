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
    Label,
    Spinner,
    MessageBar
} from '@fluentui/react-components';
import { FluentTableProps, TableData, FluentColumnDef, TableLayout, TableControlPlacement } from './types';
import { TableSearchInput, TablePaginationControls, TablePageSizeSelect, TableInfo } from './controls';
import { useDebounce } from '@hooks/use-debounce';

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
        gap: tokens.spacingHorizontalM
    },
    topEnd: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM
    },
    bottomStart: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM
    },
    bottomEnd: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM
    },
});

export function FluentTable<TData extends TableData>(props: FluentTableProps<TData>) {
    const {
        data,
        dataColumns,
        dataGridProps,
        getRowId,
        layout,
        optionControl, // Destructure new prop
        manualPagination,
        manualSorting,
        manualFiltering,
        rowCount,
        onFetchData,
        loading,
        error,
        onColumnFiltersChange,
    } = props;

    // Define default layout if not provided
    const defaultLayout: TableLayout = {
        topStart: 'search',
        topEnd: 'pageLength',
        bottomStart: 'info',
        bottomEnd: 'paging',
    };

    // Merge provided layout with default layout, only overriding specified positions
    const effectiveLayout = {
        ...defaultLayout,
        ...layout,
    };

    const initialPageSize = optionControl?.pageLength?.length?.[0] || 5;

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns: dataColumns,
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

    const renderControl = (placementType?: TableControlPlacement) => {
        if (!placementType || placementType === 'none') {
            return null;
        }

        switch (placementType) {
            case 'pageLength':
                const pageLengthOptions = optionControl?.pageLength;
                return (
                    <TablePageSizeSelect<TData>
                        table={table}
                        label={pageLengthOptions?.label}
                        length={pageLengthOptions?.length}
                        totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                        loading={loading}
                    />
                );
            case 'search':
                const searchOptions = optionControl?.search;
                return (
                    <TableSearchInput<TData>
                        table={table}
                        onSearchChange={manualFiltering ? setGlobalFilter : undefined}
                        placeholder={searchOptions?.placeholder}
                        label={searchOptions?.label}
                    />
                );
            case 'info':
                return (
                    <TableInfo<TData>
                        table={table}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageSize={table.getState().pagination.pageSize}
                        pageCount={table.getPageCount()}
                        totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
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
                        totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                        loading={loading}
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
    const debouncedGlobalFilter = useDebounce(globalFilterState, 500); // Debounce for 500ms

    React.useEffect(() => {
        if (onFetchData && (manualPagination || manualSorting || manualFiltering)) {
            onFetchData({
                pagination: { pageIndex, pageSize },
                sorting: sortingState,
                globalFilter: debouncedGlobalFilter, // Use debounced value
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
        debouncedGlobalFilter, // Depend on debounced value
        columnFilters,
    ]);

    const [sortState, setSortState] = React.useState<Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]>(
        {
            sortColumn: "",
            sortDirection: "ascending",
        }
    );

    const onSortChange: DataGridProps["onSortChange"] = React.useCallback((e: React.MouseEvent, nextSortState: Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]) => {
        const column = table.getColumn(nextSortState.sortColumn?.toString() || '');
        if (column && !column.getCanSort()) {
            // If the column is not sortable, do nothing
            return;
        }

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
                    return <Label weight="semibold">{column.columnDef.header}</Label>;
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
                compare: (a, b) => {
                    if (column.columnDef.enableSorting === false) {
                        return 0;
                    }

                    const customCompare = (column.columnDef as FluentColumnDef<TData>).compare;
                    if (customCompare) {
                        return customCompare(a, b);
                    }

                    const accessorKey = column.id as keyof TData;
                    const aValue = a[accessorKey];
                    const bValue = b[accessorKey];

                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return aValue.localeCompare(bValue);
                    }
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        return aValue - bValue;
                    }
                    // Fallback for other types or if values are not comparable
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
                    {effectiveLayout?.topStart ? renderControl(effectiveLayout.topStart) : topStartContent || <TableSearchInput table={table} onSearchChange={manualFiltering ? setGlobalFilter : undefined} placeholder="Search..." />}
                </div>
                <div className={styles.topEnd}>
                    {effectiveLayout?.topEnd ? renderControl(effectiveLayout.topEnd) : topEndContent || (
                        <TablePageSizeSelect
                            table={table}
                            totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                            loading={loading}
                        />
                    )}
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
                                return (
                                    <DataGridHeaderCell
                                        key={columnId}
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
                    {effectiveLayout?.bottomStart ? renderControl(effectiveLayout.bottomStart) : bottomStartContent || (
                        <TablePaginationControls
                            table={table}
                            pageIndex={table.getState().pagination.pageIndex}
                            pageSize={table.getState().pagination.pageSize}
                            pageCount={table.getPageCount()}
                            canPreviousPage={table.getCanPreviousPage()}
                            canNextPage={table.getCanNextPage()}
                            totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                            loading={loading}
                        />
                    )}
                </div>
                <div className={styles.bottomEnd}>
                    {effectiveLayout?.bottomEnd ? renderControl(effectiveLayout.bottomEnd) : bottomEndContent || (
                        <TablePageSizeSelect
                            table={table}
                            totalRows={rowCount !== undefined ? rowCount : table.getFilteredRowModel().rows.length}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

