"use client";

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { FluentTable, TableData } from '@components/tanstack-table';
import { TableColumnDefinition } from '@fluentui/react-components';
import { authenticatedQuery } from '../../utils/api';
import { loginUser } from '@utils/auth';
import { gql } from 'graphql-request';
import { ClipboardRegular } from '@fluentui/react-icons'; // Corrected import for the icon
import { TableControlKey, TableLayout } from './components/tanstack-table/types';
import { useMemo } from 'react';



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

const GET_ALBUMS_QUERY = gql`
  query GetAlbums {
    albumsDetails {
      albumId
      albumTitle
      artistName
      trackCount
      genres
      minPrice
      maxPrice
      avgPrice
    }
  }
`;

export default function FluentTableExamplePage() {
  const [data, setData] = React.useState<Album[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const customLayout: TableLayout = useMemo(() => ({
        topStart: 'pageLength',
        topEnd: 'search',
        bottomStart: 'info',
        bottomEnd: 'paging'
    }), []);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loginUser('admin', 'admin');

        const result: any = await authenticatedQuery(GET_ALBUMS_QUERY);
        const mappedData = result.albumsDetails.map((album: Album) => ({ ...album, id: album.albumId }));
        setData(mappedData);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const tanStackColumns: ColumnDef<Album>[] = React.useMemo(
    () => [
      { accessorKey: 'albumId', header: 'Album ID' },
      { accessorKey: 'albumTitle', header: 'Album Title' },
      { accessorKey: 'artistName', header: 'Artist Name' },
      { accessorKey: 'trackCount', header: 'Track Count' },
      { accessorKey: 'genres', header: 'Genres' },
      { accessorKey: 'minPrice', header: 'Min Price' },
      { accessorKey: 'maxPrice', header: 'Max Price' },
      { accessorKey: 'avgPrice', header: 'Avg Price' },
      {
        accessorKey: 'copyAlbumId', // New column for copying album ID
        header: 'Copy ID',
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

  if (loading) {
    return <div>Loading albums...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div>
      <h1>TanStack Table with Fluent UI DataGrid Example (Fetched Albums)</h1>
      <FluentTable
        data={data}
        tanStackColumns={tanStackColumns}
        layout={customLayout}
      />
    </div>
  );
}