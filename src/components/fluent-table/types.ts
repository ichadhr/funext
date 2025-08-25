// Unified column definition for FluentTable
export interface FluentColumnDef<T> {
  columnId: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  enableSorting?: boolean;
  compare?: (a: T, b: T) => number; // Optional custom compare function
  accessorKey?: string; // Optional accessor key for nested properties (e.g., "file.label")
}

export interface FluentTableProps<T> {
  items: T[];
  columns: FluentColumnDef<T>[];
  sortable?: boolean;
  getRowId: (item: T) => string; // Add getRowId prop
}