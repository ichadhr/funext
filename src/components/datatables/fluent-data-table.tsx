"use client";

import { forwardRef, useRef, useImperativeHandle, useMemo, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Api } from 'datatables.net-dt';
import { defaultLayout, processLayout, parseLengthMenuText } from './helpers/layout-utils';
import { DataTableProps } from './types';
import { Spinner } from '@fluentui/react-components';
import { useDataTableStyles } from './styles';

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
  options = {}
}, ref) => {
  const tableRef = useRef<{ dt: () => Api<unknown> } | null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null); // Ref for tbody
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [overlayStyle, setOverlayStyle] = useState({}); // State for overlay style

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleProcessing = useCallback((e: unknown, settings: unknown, processing: boolean) => {
    setIsLoading(processing);
  }, []);

  useImperativeHandle(ref, () => ({
    dt: () => tableRef.current?.dt() as Api<unknown> | undefined
  }));

  // Effect to calculate tbody dimensions and update overlay style
  useEffect(() => {
    if (isLoading && tbodyRef.current) {
      const tbodyRect = tbodyRef.current.getBoundingClientRect();
      const tableRect = tableRef.current?.dt().table().node().getBoundingClientRect();

      if (tableRect) {
        setOverlayStyle({
          top: tbodyRect.top - tableRect.top + 47.66, // offset overlay
          left: tbodyRect.left - tableRect.left,
          width: tbodyRect.width,
          height: tbodyRect.height,
        });
      }
    }
  }, [isLoading]);


  const processedOptions = useMemo(() => {
      const [textBefore, textAfter] = parseLengthMenuText(options?.language?.lengthMenu);
  
      return {
        responsive: true,
        ordering: true,
        pageLength: 10,
        lengthChange: true,
        processing: true, // Ensure processing indicator is enabled
        ...options,
        columnDefs: options?.columnDefs || [],
        language: {
          processing: "",
          ...options.language
        },
        layout: processLayout(
          options.layout ? options.layout as Record<string, unknown> : defaultLayout,
          options,
          tableRef,
          textBefore,
          textAfter
        )
      };
    }, [options]);

  const shouldUseData = data !== undefined && data !== null;


  const styles = useDataTableStyles();

  if (!isClient) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}> {/* Wrapper div for positioning */}
      <DataTableComponent
        ref={tableRef}
        {...(shouldUseData ? { data } : {})}
        className="display"
        options={processedOptions}
        onProcessing={handleProcessing} // Attach the event listener
      >
        {/* Render tbody with ref */}
        <tbody ref={tbodyRef} />
      </DataTableComponent>
      {isLoading && (
        <div className={styles.dtLoadingOverlay} style={overlayStyle}>
          <Spinner labelPosition="below" label="Loading..." />
        </div>
      )}
    </div>
  );
});

FluentDataTable.displayName = 'FluentDataTable';

export default FluentDataTable;
