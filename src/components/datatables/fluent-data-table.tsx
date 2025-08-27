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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [internalAjaxError, setInternalAjaxError] = useState<string | null>(null);
  const [overlayStyle, setOverlayStyle] = useState({});
  

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

  // Memoize the AJAX configuration separately to prevent recreation
  const ajaxConfig = useMemo(() => {
    if (!options?.ajax) return undefined;
    
    return {
      ...(options.ajax as object),
      error: function (xhr: JQueryXHR) {
        setInternalAjaxError(`Failed to load data: ${xhr.statusText}`);
        setIsLoading(false);
      },
      dataSrc: function (json: { data?: unknown[] }) {
        if (!json || !json.data) {
          setInternalAjaxError("Invalid data received from server.");
          setIsLoading(false);
          return [];
        }
        setInternalAjaxError(null);
        setIsLoading(false);
        return json.data;
      }
    };
  }, [options?.ajax]); // Only recreate if the original ajax config changes

  const processedOptions = useMemo(() => {
    if (!isClient) return {};
    
    const [textBefore, textAfter] = parseLengthMenuText(options?.language?.lengthMenu);

    const effectiveLengthLabels = {
      "-1": 'All',
      ...(options.language?.lengthLabels || {}),
    };

    const effectiveLanguage = {
      processing: "",
      loadingRecords: "",
      ...options.language,
      lengthLabels: effectiveLengthLabels,
    };

    return {
      responsive: true,
      ordering: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ...options,
      columnDefs: options?.columnDefs || [],
      language: effectiveLanguage,
      ajax: ajaxConfig, // Use the memoized ajax config
      layout: processLayout(
        options.layout ? options.layout as Record<string, unknown> : defaultLayout,
        { ...options, language: effectiveLanguage },
        tableRef,
        textBefore,
        textAfter
      )
    };
  }, [options, isClient, ajaxConfig]);

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
        onProcessing={handleProcessing}
      >
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