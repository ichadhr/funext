"use client";

import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import { forwardRef, useRef, useImperativeHandle, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Api } from 'datatables.net';
import { defaultLayout, processLayout } from './dataTableOptions';

// Define the props interface
export interface DataTableColumn {
  title: string;
  data?: string;
  [key: string]: unknown;
}

export interface DataTableOptions {
  responsive?: boolean;
  ordering?: boolean;
  pageLength?: number;
  lengthChange?: boolean;
  paging?: boolean;
  columns?: DataTableColumn[];
  ajax?: string | object | (() => void);
  language?: {
    lengthMenu?: string;
    entries?: string | {
      _: string;
      [key: number]: string;
    };
    lengthLabels?: {
      [key: string]: string;
    };
  };
  [key: string]: unknown;
}

export interface DataTableProps {
  data?: (string | number | boolean)[][];
  columns?: DataTableColumn[];
  options?: DataTableOptions;
  className?: string;
}

// Dynamically import DataTables with SSR disabled
const DataTableComponent = dynamic(
  async () => {
    const dtReact = await import('datatables.net-react');
    const dtNet = await import('datatables.net-dt');
    const dtResponsive = await import('datatables.net-responsive-dt');

    const reactMod = dtReact.default;
    const dtNetMod = dtNet.default;
    const dtResponsiveMod = dtResponsive.default;

    reactMod.use(dtNetMod);
    reactMod.use(dtResponsiveMod);
    return reactMod;
  },
  { ssr: false }
);

// Define the DataTable API type


/**
 * FluentDataTable Component
 *
 * A modular DataTable component with support for:
 * - Client-side data
 * - AJAX data loading
 * - Search functionality
 * - Responsive design
 * - Column configuration
 */
const DataTable = forwardRef(({
  data,
  columns = [],
  options = {},
  className = "display"
}: DataTableProps, ref) => {
  const tableRef = useRef<{ dt: () => Api<unknown> } | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Forward the DataTable instance to the parent component
  useImperativeHandle(ref, () => ({
    dt: () => tableRef.current?.dt() as Api<unknown> | undefined
  }));

  // Parse length menu text
  const parseLengthMenuText = (lengthMenu?: string) => {
    if (!lengthMenu) return ["", "entries per page"];
    const parts = lengthMenu.split('_MENU_');
    return [parts[0] || "", parts[1] || ""];
  };



  // Merge default options with provided options
  const mergedOptions = useMemo(() => {
    const [textBefore, textAfter] = parseLengthMenuText(options.language?.lengthMenu);

    return {
      responsive: true,
      ordering: true,
      pageLength: 10,
      lengthChange: true,
      ...options,
      columns: [
        ...columns,
        ...(options?.columns || [])
      ],
      layout: processLayout(
        options.layout ? options.layout as Record<string, unknown> : defaultLayout,
        options,
        tableRef,
        textBefore,
        textAfter
      )
    };
  }, [options, columns]);

  // Determine if we should use the data prop
  const shouldUseData = data !== undefined && data !== null;

  // Only render the DataTable on the client
  if (!isClient) {
    return null;
  }

  return (
    <DataTableComponent
      ref={tableRef}
      {...(shouldUseData ? { data } : {})}
      className={className}
      options={mergedOptions}
    />
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
