"use client";

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FluentTable, TableData } from '@components/tanstack-table';
import { authenticatedQuery } from '@utils/api';
import { gql } from 'graphql-request';
import { ClipboardRegular } from '@fluentui/react-icons'; // Corrected import for the icon
import { TableLayout, TableState } from '@components/tanstack-table/types'; // Import TableState
import { useMemo } from 'react';
import { CardGrid } from "@/components/grids";
import { Card, CardHeader, Text } from "@fluentui/react-components";


// Helper function to convert camelCase to snake_case
const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

interface Album extends TableData {
  albumId: string;
  albumTitle: string;
  artistName: string;
  trackCount: number;
  genres: string[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

// Updated GraphQL query to accept pagination, sorting, and filtering arguments for albumsFluentTable
const GET_ALBUMS_QUERY = gql`
  query GetAlbumsCombined($page: Int!, $pageSize: Int!, $sortBy: String!, $sortDesc: Boolean!, $filter: [FilterInput]) {
    albumsFluentTable(
      pagination: { page: $page, pageSize: $pageSize },
      sort: [{ id: $sortBy, desc: $sortDesc }],
      filter: $filter
    ) {
      rows {
        albumId
        albumTitle
        artistName
        trackCount
        genres
        minPrice
        maxPrice
        avgPrice
      }
      rowCount
    }
  }
`;

export default function FluentTableExamplePage() {
  const [data, setData] = React.useState<Album[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rowCount, setRowCount] = React.useState(0); // State to hold total row count from server

  const customLayout: TableLayout = useMemo(() => ({
    topStart: 'pageLength',
    topEnd: 'search',
    bottomStart: 'info',
    bottomEnd: 'paging'
  }), []);

  // onFetchData callback for server-side processing
  const onFetchData = React.useCallback(async (state: TableState) => {
    try {
      setLoading(true);
      const { pagination, sorting, globalFilter } = state;

      // Prepare variables for GraphQL query based on the user's provided working query
      const variables: {
        page: number;
        pageSize: number;
        sortBy: string;
        sortDesc: boolean;
        filter?: { id: string; value: string }[]; // Make filter optional
      } = {
        page: pagination.pageIndex + 1, // GraphQL page is 1-based
        pageSize: pagination.pageSize,
        sortBy: sorting.length > 0 ? camelToSnakeCase(sorting[0].id) : "album_title", // Use accessorKey and convert to snake_case
        sortDesc: sorting.length > 0 ? sorting[0].desc : false,
      };

      if (globalFilter) {
        const searchableColumns = [
          "albumId", "albumTitle", "artistName", "trackCount", "genres", "minPrice", "maxPrice", "avgPrice"
        ];
        variables.filter = searchableColumns.map(column => ({
          id: camelToSnakeCase(column),
          value: globalFilter
        }));
      }

      const result: { albumsFluentTable: { rows: Album[]; rowCount: number } } = (await authenticatedQuery(GET_ALBUMS_QUERY, variables)) as { albumsFluentTable: { rows: Album[]; rowCount: number } };
      const mappedData = result.albumsFluentTable.rows.map((album: Album) => ({ ...album, id: album.albumId }));
      setData(mappedData);
      setRowCount(result.albumsFluentTable.rowCount); // Update total row count
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch on component mount
  React.useEffect(() => {
    // Call onFetchData with initial table state
    onFetchData({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      globalFilter: '',
      columnFilters: [], // Add this line
    });
  }, [onFetchData]);


  const tanStackColumns: ColumnDef<Album>[] = React.useMemo(
    () => [
      { accessorKey: 'albumId', header: 'Album ID', enableSorting: true },
      { accessorKey: 'albumTitle', header: 'Album Title', enableSorting: true },
      { accessorKey: 'artistName', header: 'Artist Name', enableSorting: true },
      { accessorKey: 'trackCount', header: 'Track Count', enableSorting: true },
      { accessorKey: 'genres', header: 'Genres', enableSorting: true },
      { accessorKey: 'minPrice', header: 'Min Price', enableSorting: true },
      { accessorKey: 'maxPrice', header: 'Max Price', enableSorting: true },
      { accessorKey: 'avgPrice', header: 'Avg Price', enableSorting: true },
      {
        accessorKey: 'copyAlbumId', // New column for copying album ID
        header: 'Copy ID',
        enableSorting: false, // This column should not be sortable
        cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{row.original.albumId}</span>
            <ClipboardRegular
              onClick={() => navigator.clipboard.writeText(row.original.albumId)}
              style={{ cursor: 'pointer' }}
              title="Copy Album ID"
            />
          </div>
        ),
      },
    ],
    []
  );



  return (

    <div>
      <CardGrid type="fluid">
        <Card appearance="subtle">
          <CardHeader header={<Text weight="semibold">TanStack Table with Fluent UI DataGrid Example (Fetched Albums)</Text>} />
          <FluentTable
            data={data}
            tanStackColumns={tanStackColumns}
            layout={customLayout}
            manualPagination={true} // Enable manual pagination
            manualSorting={true}    // Enable manual sorting
            manualFiltering={true}  // Enable manual filtering
            rowCount={rowCount}     // Pass total row count from server
            onFetchData={onFetchData} // Pass the data fetching callback
            loading={loading}       // Pass loading state
            error={error}           // Pass error state
          />
        </Card>
      </CardGrid>
    </div>
  );
}