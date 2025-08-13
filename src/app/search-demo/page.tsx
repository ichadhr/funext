"use client";

import { useRef, useState } from 'react';
import { Card, Input } from "@fluentui/react-components";
import dynamic from 'next/dynamic';
import { Delete20Filled } from "@fluentui/react-icons";
import { createRoot } from 'react-dom/client';

const FluentDataTable = dynamic(() => import('@/components/datatables').then(mod => mod.FluentDataTable), { ssr: false });

export default function DataTableDemo() {
  const [searchValue, setSearchValue] = useState('');
  const tableRef = useRef(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (tableRef.current) {
      // @ts-expect-error DataTables API is not typed
      const table = tableRef.current.dt();
      if (table) {
        table.search(value).draw();
      }
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h2>DataTable Search Demo (AJAX)</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Input
            type="text"
            placeholder="Search albums..."
            value={searchValue}
            onChange={handleSearchChange}
            style={{ padding: '8px', width: '300px' }}
          />
        </div>
        <FluentDataTable
          ref={tableRef}
          columns={[
            {
              title: "Album ID",
              data: "AlbumId",
              render: (data: string) => data, // Return just the data
              createdCell: (cell: HTMLElement, cellData: string) => {
                // Use createRoot to render our component into the cell
                const root = createRoot(cell);
                root.render(
                  <a href={`/sample/${cellData}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Delete20Filled style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    {cellData}
                  </a>
                );
              }
            },
            { title: "Album Title", data: "AlbumTitle" },
            { title: "Artist Name", data: "ArtistName" },
            { title: "Track Count", data: "TrackCount" },
            { title: "Genres", data: "Genres" },
            {
              title: "Min Price",
              data: "MinPrice",
              render: (data: string) => `$${parseFloat(data).toFixed(2)}`
            },
            {
              title: "Max Price",
              data: "MaxPrice",
              render: (data: string) => `$${parseFloat(data).toFixed(2)}`
            },
            {
              title: "Avg Price",
              data: "AvgPrice",
              render: (data: string) => `$${parseFloat(data).toFixed(2)}`
            }
          ]}
          options={{
            processing: true,
            serverSide: true,
            responsive: true,
            ordering: true,
            searching: true,
            language: {
              lengthMenu: "Display _MENU_ records",
              lengthLabels: {
                '-1': 'Show all',
                10: 'Ten',
                25: 'Twenty-five'
              }
            },
            pageLength: 25,
            lengthMenu: [10, 25, -1],
            ajax: {
              url: "http://localhost:8080/dt_json",
              type: "GET"
            }
          }}
        />
      </Card>
    </div>
  );
}

