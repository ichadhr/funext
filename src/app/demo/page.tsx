"use client";

import { useRef } from 'react';
import { Card } from "@fluentui/react-components";
import dynamic from 'next/dynamic';
import { Delete20Filled } from "@fluentui/react-icons";
import { createRoot } from 'react-dom/client';
import { sampleAlbumsArray } from '@/components/datatables/sample-data';

const FluentDataTable = dynamic(() => import('@/components/datatables').then(mod => mod.FluentDataTable), { ssr: false });

export default function DataTableDemo() {
  const tableRef = useRef(null);

  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h2>DataTable Demo (AJAX Server-side)</h2>
        <FluentDataTable
          ref={tableRef}
          options={{
            columns: [
              { title: "Album ID", data: "AlbumId" },
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
              },
              {
                title: "Action",
                data: "AlbumId",
                className: "center-content",
                orderable: false,
                render: (data: string) => `action-${data}`, // Return a unique string identifier
                createdCell: (cell: HTMLElement, cellData: string) => {
                  // Clear any existing content
                  cell.innerHTML = '';
        
                  // Create React root and render component
                  const root = createRoot(cell);
                  root.render(
                    <a href={`/sample/${cellData}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Delete20Filled style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    </a>
                  );
                }
              }
            ],
            columnDefs: [],
            processing: true,
            serverSide: true,
            responsive: true,
            ordering: true,
            searching: true,
            language: {
              lengthMenu: "Show: _MENU_",
              search: "Filter records:",
              searchPlaceholder: "Type to search..."
            },
            pageLength: 5,
            lengthMenu: [5, 10, 25, -1],
            ajax: {
              url: "http://localhost:8080/dt_json",
              type: "GET"
            }
          }}
        />
      </Card>

      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h2>DataTable Demo (Local Data)</h2>
        <FluentDataTable
          options={{
            columns: [
              { title: "Album ID", data: 0 },
              { title: "Album Title", data: 1 },
              { title: "Artist Name", data: 2 },
              { title: "Track Count", data: 3 },
              { title: "Genres", data: 4 },
              {
                title: "Min Price",
                data: 5,
                render: (data: string) => `$${parseFloat(data).toFixed(2)}`
              },
              {
                title: "Max Price",
                data: 6,
                render: (data: string) => `$${parseFloat(data).toFixed(2)}`
              },
              {
                title: "Avg Price",
                data: 7,
                render: (data: string) => `$${parseFloat(data).toFixed(2)}`
              },
              {
                title: "Action",
                data: 8,
                render: (data: string) => data, // Return just the data
                createdCell: (cell: HTMLElement, cellData: string) => {
                  // Only render on client side
                  if (typeof window !== 'undefined') {
                    const root = createRoot(cell);
                    root.render(
                      <a href={`/sample/${cellData}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Delete20Filled style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                      </a>
                    );
                  }
                }
              }
            ],
            processing: true,
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
            data: sampleAlbumsArray,
            layout: {
              bottomEnd: {
                paging: {
                  type: 'full_numbers'
                }
              }
            }
          }}
        />
      </Card>
    </div>
  );
}
