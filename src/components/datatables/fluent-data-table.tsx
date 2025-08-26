"use client";

import { forwardRef, useRef, useImperativeHandle, useMemo, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Api } from 'datatables.net-dt';
import { defaultLayout, processLayout, parseLengthMenuText } from './helpers/layout-utils';
import { DataTableProps } from './types';
import { Spinner, MessageBar, MessageBarBody } from '@fluentui/react-components';
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
  options = {},
}, ref) => {
  const tableRef = useRef<{ dt: () => Api<unknown> } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // Ref for the wrapper div
  const tbodyRef = useRef<HTMLTableSectionElement>(null); // Ref for tbody
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [internalAjaxError, setInternalAjaxError] = useState<string | null>(null); // Internal error state
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
    if (isLoading && tbodyRef.current && wrapperRef.current) {
      const tbodyRect = tbodyRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      setOverlayStyle({
        top: tbodyRect.top - wrapperRect.top,
        left: tbodyRect.left - wrapperRect.left,
        width: tbodyRect.width,
        height: tbodyRect.height,
      });
    }
  }, [isLoading]);


  const processedOptions = useMemo(() => {
    const [textBefore, textAfter] = parseLengthMenuText(options?.language?.lengthMenu);

    // Construct the effective lengthLabels here, similar to what was in processLayout
    const effectiveLengthLabels = {
      "-1": 'All', // Our default for "All"
      ...(options.language?.lengthLabels || {}), // Merge user-provided labels
    };

    // Construct the effective language object for DataTables
    const effectiveLanguage = {
      processing: "",
      loadingRecords: "",
      ...options.language, // Merge any other language properties
      lengthLabels: effectiveLengthLabels, // Explicitly set lengthLabels for DataTables
    };

    return {
      responsive: true,
      ordering: true,
      pageLength: 10,
      lengthChange: true,
      processing: true, // Ensure processing indicator is enabled
      ...options,
      columnDefs: options?.columnDefs || [],
      language: effectiveLanguage, // Use the effective language object
      ajax: options?.ajax ? {
        ...(options.ajax as object), // Cast to object to spread properties
        error: function (xhr: JQueryXHR) {
          setInternalAjaxError(`Failed to load data: ${xhr.statusText}`); // Set internal error state
          setIsLoading(false); // Ensure spinner stops on error
          // DataTables will handle displaying its own error message if not handled by dataSrc
        },
        dataSrc: function (json: { data?: unknown[] }) { // Explicitly define data as an array
          if (!json || !json.data) { // Check if json or json.data is missing
            setInternalAjaxError("Invalid data received from server."); // Set internal error state
            setIsLoading(false); // Ensure spinner stops on invalid data
            return []; // Return empty array on invalid data
          }
          setInternalAjaxError(null); // Clear error on successful data load
          setIsLoading(false); // Ensure spinner stops on successful data load
          return json.data;
        }
      } : undefined,
      layout: processLayout(
        options.layout ? options.layout as Record<string, unknown> : defaultLayout,
        { ...options, language: effectiveLanguage }, // Pass the fully constructed options to processLayout
        tableRef,
        textBefore, // Re-introduce textBefore
        textAfter // Re-introduce textAfter
      )
    };
  }, [options]);

  const styles = useDataTableStyles();

  if (!isClient) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      {internalAjaxError && (
        <MessageBar intent="error" style={{ marginBottom: '10px' }}>
          <MessageBarBody>
            {internalAjaxError}
          </MessageBarBody>
        </MessageBar>
      )}
      <DataTableComponent
        ref={tableRef}
        data={data}
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
