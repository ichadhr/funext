import * as React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel, // Import for filtering
    getPaginationRowModel, // Import for pagination
    flexRender,
    Table, // Import Table
} from '@tanstack/react-table';
import {
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    DataGridProps,
    TableColumnDefinition, // Keep this for the columns prop of DataGrid
    makeStyles,
    Field,
    Input,
    Button,
    Select,
    Label,
    SearchBox, // Add SearchBox
    tokens, // Keep tokens here as it's used in makeStyles
} from '@fluentui/react-components';
import { FluentTableProps, TableData } from './types';
import { ArrowEjectFilled, ArrowNextFilled, ArrowPreviousFilled } from '@fluentui/react-icons';

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
    paginationControls: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
    },
    searchInput: {
        width: '200px', // Adjust as needed
    },
    pageSizeSelect: {
        width: '100px', // Adjust as needed
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
    rotatedIconLeft: {
        transform: 'rotate(-90deg)',
    },
    rotatedIconRight: {
        transform: 'rotate(90deg)',
    },
});

export function FluentTable<TData extends TableData>(props: FluentTableProps<TData>) {
    const { data, tanStackColumns, dataGridProps } = props;

    const table = useReactTable({
        data,
        columns: tanStackColumns, // Use the required tanStackColumns directly
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // Add sorting model
        getFilteredRowModel: getFilteredRowModel(), // Add filtering model
        getPaginationRowModel: getPaginationRowModel(), // Add pagination model
        enableSorting: true, // Enable sorting by default
        getRowId: (row) => row.id, // Tell TanStack Table to use the 'id' property as the row ID
    });

    const [globalFilter, setGlobalFilter] = React.useState(''); // State for global filter

    React.useEffect(() => {
        table.setGlobalFilter(globalFilter);
    }, [globalFilter, table]);

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
                    let row;
                    // Ensure item.id is treated as a string for getRow
                    if (item.id !== undefined && item.id !== null) {
                        row = table.getRow(String(item.id));
                    } else {
                        // Fallback: if item.id is undefined or null, try to find the row by comparing the original data
                        // This is less efficient but provides resilience for malformed data
                        row = table.getRowModel().rows.find(r => r.original === item);
                    }

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
            } as TableColumnDefinition<TData>; // Cast to TableColumnDefinition
        });
    }, [table]);


    const styles = useStyles();

    const { topStartContent, topEndContent, bottomStartContent, bottomEndContent } = props;

    const TablePaginationControls = React.memo(({ table }: { table: Table<TData> }) => {
        return (
            <div className={styles.paginationControls}>
                <Button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="First page"
                    icon={<ArrowEjectFilled className={styles.rotatedIconLeft} />}
                />
                <Button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Previous page"
                    icon={<ArrowPreviousFilled />}
                />
                <Button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Next page"
                    icon={<ArrowNextFilled />}
                />
                <Button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    aria-label="Last page"
                    icon={<ArrowEjectFilled className={styles.rotatedIconRight} />}
                />
                <Label>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>{' '}
                </Label>
                <Label>
                    | Go to page:{' '}
                    <Input
                        type="number"
                        defaultValue={String(table.getState().pagination.pageIndex + 1)}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '100px' }}
                        disabled={!table.getCanNextPage()}
                    />
                </Label>
            </div>
        );
    }) as React.MemoExoticComponent<React.FC<{ table: Table<TData> }>>;
    TablePaginationControls.displayName = 'TablePaginationControls';

    const TablePageSizeSelect = React.memo(({ table }: { table: Table<TData> }) => {
        return (
            <Field label="Page Size">
                <Select
                    value={String(table.getState().pagination.pageSize)}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className={styles.pageSizeSelect}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
            </Field>
        );
    }) as React.MemoExoticComponent<React.FC<{ table: Table<TData> }>>;
    TablePageSizeSelect.displayName = 'TablePageSizeSelect';

    return (
        <div className={styles.root}>
            <div className={styles.topControls}>
                <div className={styles.topStart}>
                    {topStartContent || <TableSearchInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} styles={styles} />}
                </div>
                <div className={styles.topEnd}>
                    {topEndContent}
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
                    {bottomStartContent || <TablePaginationControls table={table} />}
                </div>
                <div className={styles.bottomEnd}>
                    {bottomEndContent || <TablePageSizeSelect table={table} />}
                </div>
            </div>
        </div>
    );
}

const TableSearchInput = React.memo(({ globalFilter, setGlobalFilter, styles }: { globalFilter: string, setGlobalFilter: (filter: string) => void, styles: ReturnType<typeof useStyles> }) => {
    const onChange = React.useCallback((event: React.SyntheticEvent<HTMLElement, Event>, data?: { value?: string }) => {
        setGlobalFilter(data?.value || '');
    }, [setGlobalFilter]);

    return (
        <Field label="Search">
            <SearchBox
                value={globalFilter ?? ''}
                onChange={onChange}
                placeholder="Search all columns..."
                className={styles.searchInput}
            />
        </Field>
    );
});
TableSearchInput.displayName = 'TableSearchInput';
