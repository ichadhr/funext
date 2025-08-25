import * as React from "react";
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableColumnDefinition,
} from "@fluentui/react-components";
import { FluentTableProps } from "./types";

import { useFluentColumns } from "./hooks/use-fluent-columns";

export const Default = <T extends Record<string, unknown>>({ items, columns, sortable = true, getRowId }: FluentTableProps<T>) => {
  const fluentColumns: TableColumnDefinition<T>[] = useFluentColumns(columns, sortable);

  return (
    <DataGrid
      items={items}
      columns={fluentColumns}
      sortable={sortable}
      selectionMode="multiselect"
      getRowId={getRowId}
      focusMode="composite"
      style={{ minWidth: "550px" }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>
              {renderHeaderCell()}
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<T>>
        {({ item, rowId }) => (
          <DataGridRow<T> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};