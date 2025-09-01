import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Label,
  mergeClasses,
} from '@fluentui/react-components';
import { Row, ColumnDef, Table as TanStackTable, flexRender, Column, HeaderGroup, Header } from '@tanstack/react-table';
import { useStyles } from '../styles';

interface TableRendererProps<TData extends object> {
  tableId: string;
  table: TanStackTable<TData>;
  columns: ColumnDef<TData>[];
  data: TData[];
  striped?: boolean;
  size?: 'small' | 'medium' | 'extra-small';
  isMobile: boolean;
}

export const TableRenderer = <TData extends object>({
    tableId,
    table,
    columns,
    data,
    striped,
    size = 'small',
    isMobile,
}: TableRendererProps<TData>) => {
    const classes = useStyles();

    const sortableColumns = React.useMemo(
      () => table.getAllColumns().filter((column: Column<TData>) => column.getCanSort()),
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
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
          <TableRow
            key={headerGroup.id}
            onClick={isSingleSortableColumn ? handleRowClick : undefined}
            style={{
              cursor: isSingleSortableColumn ? "pointer" : "default",
            }}
          >
            {headerGroup.headers.map((header: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
              <TableHeaderCell
                key={header.id}
                onClick={!isSingleSortableColumn ? header.column.getToggleSortingHandler() : undefined}
                sortDirection={header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : undefined}
                style={{
                  cursor: !isSingleSortableColumn && header.column.getCanSort() ? "pointer" : "default",
                }}
              >
                {header.isPlaceholder ? null : (
                  <Label weight="semibold" style={{ cursor: "inherit" }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Label>
                )}
              </TableHeaderCell>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    ), [table, isSingleSortableColumn, handleRowClick]);

    const TableBodyContent = React.useCallback(() => (
        <TableBody className={striped ? classes.stripedRows : undefined}>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={columns.length} style={{ textAlign: "center" }}>
                        No data available
                    </TableCell>
                </TableRow>
            ) : (
                table.getRowModel().rows.map((row: Row<TData>) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            )}
        </TableBody>
    ), [table, striped, columns.length, data.length, classes.stripedRows]);

    const MobileCardRow = React.memo<{ row: Row<TData> }>(({ row }) => (
        <div className={classes.mobileCard}>
            {row.getVisibleCells().map((cell: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div key={cell.id} className={classes.mobileCardItem}>
                    <span className={classes.mobileCardLabel}>
                        {typeof cell.column.columnDef.header === 'string'
                            ? cell.column.columnDef.header
                            : cell.column.id}:
                    </span>
                    <span className={classes.mobileCardValue}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                </div>
            ))}
        </div>
    ));
    MobileCardRow.displayName = 'MobileCardRow';

    if (isMobile) {
        return (
            <div className={mergeClasses(classes.mobileCardViewContainer, striped && classes.stripedCards)}>
                {table.getRowModel().rows.map((row: Row<TData>) => (
                    <MobileCardRow key={row.id} row={row} />
                ))}
            </div>
        );
    }

    return (
        <div className={classes.tableScrollContainer}>
            <Table id={tableId} size={size} aria-label="Fluent table">
                <TableHeaderContent />
                <TableBodyContent />
            </Table>
        </div>
    );
};