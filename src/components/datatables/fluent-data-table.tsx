"use client";

import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import { forwardRef, useRef, useImperativeHandle, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Api } from 'datatables.net-dt';
import { defaultLayout, processLayout } from './helpers/layout-utils';
import { DataTableProps } from './types';

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

const FluentDataTable = forwardRef<{ dt: () => Api<unknown> | undefined }, DataTableProps>(({
  data,
  columns = [],
  options = {},
  className = "display"
}, ref) => {
  const tableRef = useRef<{ dt: () => Api<unknown> } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useImperativeHandle(ref, () => ({
    dt: () => tableRef.current?.dt() as Api<unknown> | undefined
  }));

  const parseLengthMenuText = (lengthMenu?: string) => {
    if (!lengthMenu) return ["", "entries per page"];
    const parts = lengthMenu.split('_MENU_');
    return [parts[0] || "", parts[1] || ""];
  };

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
            columnDefs: [
        ...(options?.columnDefs || [])
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

  const shouldUseData = data !== undefined && data !== null;

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

FluentDataTable.displayName = 'FluentDataTable';

export default FluentDataTable;