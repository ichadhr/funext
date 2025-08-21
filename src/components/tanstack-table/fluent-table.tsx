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
    TableColumnDefinition, // Keep this for the columns prop of DataGrid
} from '@fluentui/react-components';
import { FluentTableProps, TableData } from './types';

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


    return (
        <div>
            <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search all columns..."
            />
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
            <div>
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}