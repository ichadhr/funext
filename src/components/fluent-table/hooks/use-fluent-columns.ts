import * as React from "react";
import { TableColumnDefinition } from "@fluentui/react-components";
import { FluentColumnDef } from "../types";
import { createAutoCompare } from "../sorting";

export const useFluentColumns = <T extends Record<string, unknown>>(
  columns: FluentColumnDef<T>[],
  sortable: boolean
): TableColumnDefinition<T>[] => {
  return React.useMemo(
    () =>
      columns.map((col) => {
        const isSortable = col.enableSorting ?? sortable;
        return {
          columnId: col.columnId,
          compare: col.compare ||
            (isSortable ? createAutoCompare<T>(col.columnId, col.accessorKey) : () => 0),
          renderHeaderCell: () => col.header,
          renderCell: (item) => col.cell(item),
          sortable: isSortable,
        };
      }),
    [columns, sortable]
  );
};