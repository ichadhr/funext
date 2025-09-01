import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  Table,
} from '@tanstack/react-table';

export interface UseTableConfigProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

export function useTableConfig<TData extends object>({
  data,
  columns,
}: UseTableConfigProps<TData>): Table<TData> {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
}