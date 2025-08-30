import React, { useMemo } from "react";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Label,
  mergeClasses, // Import mergeClasses
} from "@fluentui/react-components";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useTableFiltering } from "./hooks/use-table-filtering";
import { useTablePagination } from "./hooks/use-table-pagination";
import { useTableSorting } from "./hooks/use-table-sorting";
import { useIsMobile } from "@components/ui/hooks/use-mobile"; // Import useIsMobile hook
import { TableControl, TableLayout, FluentTableProps } from "./types";
import { SearchControl } from "./controls/search-control";
import { PageSizeControl } from "./controls/page-size-control";
import { PaginationControl } from "./controls/pagination-control";
import { InfoControl } from "./controls/info-control";
import { useStyles } from "./controls/style"; // Import useStyles

const FluentTable = <TData extends object>({
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
}: FluentTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const classes = useStyles(); // Call useStyles at the top level
  const isMobile = useIsMobile(); // Use the useIsMobile hook

  const { globalFilter, setGlobalFilter } = useTableFiltering(table);
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

  useMemo(() => {
    table.setGlobalFilter(globalFilter);
    table.setPagination(pagination);
    table.setSorting(sorting);
  }, [globalFilter, pagination, sorting, table]);

  const sortableColumns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanSort()),
    [table]
  );

  const isSingleSortableColumn = sortableColumns.length === 1;
  const singleSortableColumn = isSingleSortableColumn ? sortableColumns[0] : undefined;

  const handleRowClick = () => {
    if (singleSortableColumn) {
      singleSortableColumn.toggleSorting();
    }
  };

  const TableHeaderContent = (props: { classes: ReturnType<typeof useStyles> }) => (
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
  );

  const TableBodySection = (props: { classes: ReturnType<typeof useStyles> }) => (
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
  );

  const renderControl = (controlType?: TableControl) => {
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
  };

  return (
    <div>
      <div className={classes.topControlsWrapper} style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex" }}>{renderControl(layout?.topStart)}</div>
        <div style={{ display: "flex" }}>{renderControl(layout?.topEnd)}</div>
      </div>
      {isMobile ? (
        <div className={mergeClasses(classes.mobileCardViewContainer, striped && classes.stripedCards)}>
          {table.getRowModel().rows.map((row) => (
            <div key={row.id} className={classes.mobileCard}>
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
          ))}
        </div>
      ) : (
        <div className={classes.tableScrollContainer}>
          <Table
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
    </div>
  );
};

export default FluentTable;