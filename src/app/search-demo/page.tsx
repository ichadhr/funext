"use client";

import { useRef, useState } from 'react';
import { Card, Input } from "@fluentui/react-components";
import { FluentDataTable } from '@/components/datatables';

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
            { title: "Album ID" },
            { title: "Album Title" },
            { title: "Artist Name" },
            { title: "Track Count" },
            { title: "Genres" },
            { title: "Min Price" },
            { title: "Max Price" },
            { title: "Avg Price" }
          ]}
          options={{
            processing: true,
            serverSide: true,
            responsive: true,
            ordering: true,
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
              type: "POST"
            }
          }}
        />
      </Card>
    </div>
  );
}

