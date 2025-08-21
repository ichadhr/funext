import * as React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel, // Import for filtering
    getPaginationRowModel, // Import for pagination
    flexRender,
} from '@tanstack/react-table';
import {
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    DataGridProps,
    makeStyles,
    tokens, // Keep tokens here as it's used in makeStyles
} from '@fluentui/react-components';
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
        overflowX: 'auto', // Enable horizontal scrolling for the table
    },
    // Styles for the content areas
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
    const { data, tanStackColumns, dataGridProps, getRowId, layout } = props;

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns: tanStackColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableSorting: true,
        getRowId: getRowId || ((row) => String(row.id)), // Ensure getRowId always returns a string
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
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
                    />
                );
            case 'info':
                return (
                    <TableInfo<TData>
                        table={table}
                        pageIndex={table.getState().pagination.pageIndex}
                        pageCount={table.getPageCount()}
                        totalItems={table.getFilteredRowModel().rows.length}
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
                        totalItems={table.getFilteredRowModel().rows.length}
                    />
                );
            default:
                return null;
        }
    };

    React.useEffect(() => {
        console.log('FluentTable - table instance changed:', table);
    }, [table]);

    const [sortState, setSortState] = React.useState<Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]>(
        {
            sortColumn: "", // Initialize with an empty string or a default sort column if applicable
            sortDirection: "ascending",
        }
    );

    const onSortChange: DataGridProps["onSortChange"] = React.useCallback((e: React.MouseEvent, nextSortState: Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]) => {
        setSortState(nextSortState);
        // Map Fluent UI sort state to TanStack Table sort state
        const tanstackSort = nextSortState.sortColumn
            ? [{ id: nextSortState.sortColumn.toString(), desc: nextSortState.sortDirection === "descending" }]
            : [];
        table.setSorting(tanstackSort);
    }, [table]);

    // Construct DataGrid columns from TanStack Table columns
    const fluentUiDataGridColumns = React.useMemo(() => {
        return table.getAllColumns().map(column => {
            return {
                columnId: column.id,
                renderHeaderCell: () => {
                    const header = table.getHeaderGroups().flatMap(hg => hg.headers).find(h => h.column.id === column.id);
                    return header ? flexRender(header.column.columnDef.header, header.getContext()) : null;
                },
                renderCell: (item: TData) => {
                    const row = table.getRow(getRowId ? getRowId(item) : String(item.id));

                    const cell = row?.getVisibleCells().find(c => c.column.id === column.id);
                    return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null;
                },
                sortable: column.getCanSort(), // Use TanStack's sortable flag
                compare: (_a: TData, _b: TData) => { // eslint-disable-line @typescript-eslint/no-unused-vars
                    // This compare function is required by TableColumnDefinition for sortable columns.
                    // Since TanStack Table handles the actual sorting, this can be a placeholder.
                    // We rely on `onSortChange` and TanStack Table's internal sorting.
                    return 0;
                },
            } as DataGridProps['columns'][number]; // Cast to a single column definition type from DataGridProps
        });
    }, [table, getRowId]);


    const styles = useStyles();

    const { topStartContent, topEndContent, bottomStartContent, bottomEndContent } = props;


    return (
        <div className={styles.root}>
            <div className={styles.topControls}>
                <div className={styles.topStart}>
                    {layout?.topStart ? renderControl(layout.topStart) : topStartContent || <TableSearchInput table={table} />}
                </div>
                <div className={styles.topEnd}>
                    {layout?.topEnd ? renderControl(layout.topEnd) : topEndContent}
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <DataGrid
                    items={table.getRowModel().rows.map(row => row.original)} // DataGrid expects paginated items
                    columns={fluentUiDataGridColumns} // Use the constructed Fluent UI columns
                    sortable
                    sortState={sortState}
                    onSortChange={onSortChange}
                    {...dataGridProps} // Spread additional DataGridProps
                >
                    <DataGridHeader>
                        <DataGridRow>
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
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
                            totalItems={table.getFilteredRowModel().rows.length}
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
