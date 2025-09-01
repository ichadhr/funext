import { useEffect, useRef, useState } from 'react';
import { Table, SortingState, PaginationState, ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { FluentTableProps } from '../types';

interface UseTableEventsProps<TData extends object> {
  table: Table<TData>;
  event?: FluentTableProps<TData>['event'];
  pagination: PaginationState;
  sorting: SortingState;
  debouncedGlobalFilter: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  debouncedOnDrawDependencies: {
    pagination: PaginationState;
    sorting: SortingState;
    debouncedGlobalFilter: string;
    columnFilters: ColumnFiltersState;
    data: TData[];
    columns: ColumnDef<TData>[];
  };
}

export function useTableEvents<TData extends object>({
  table,
  event,
  pagination,
  sorting,
  debouncedGlobalFilter,
  data,
  columns,
  debouncedOnDrawDependencies,
}: UseTableEventsProps<TData>) {
  const { onInitializing, onInit, onSearch, onDraw, onOrder, onPageChange, onPageLengthChange, onPreDraw, onPreInit, onProcessing, onError } = event || {};

  // Refs and state for event management
  const isMounted = useRef(false);
  const processingStartedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialization events
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      onInitializing?.(true);
    }
  }, [onInitializing]);

  useEffect(() => {
    if (isMounted.current) {
      onPreInit?.();
      onInit?.();
      setIsInitializing(false);
      onInitializing?.(false);
    }
  }, [onPreInit, onInit, onInitializing, isMounted]);

  // Draw event
  useEffect(() => {
    if (onDraw && !isInitializing) {
      onPreDraw?.();
      onDraw();
      setIsProcessing(false);
      onProcessing?.(false);
      processingStartedRef.current = false;
    }
  }, [debouncedOnDrawDependencies, onDraw, onPreDraw, onProcessing, isInitializing]);

  // Other events
  useEffect(() => {
    if (onOrder && !isInitializing) {
      onOrder(sorting);
    }
  }, [sorting, onOrder, isInitializing]);

  useEffect(() => {
    if (onPageChange && !isInitializing) {
      onPageChange(pagination.pageIndex, pagination.pageSize);
    }
  }, [pagination.pageIndex, pagination.pageSize, onPageChange, isInitializing]);

  useEffect(() => {
    if (onPageLengthChange && !isInitializing) {
      onPageLengthChange(pagination.pageSize);
    }
  }, [pagination.pageSize, onPageLengthChange, isInitializing]);

  useEffect(() => {
    if (onSearch && !isInitializing) {
      onSearch(debouncedGlobalFilter);
    }
  }, [debouncedGlobalFilter, onSearch, isInitializing]);

  // Processing management
  useEffect(() => {
    if (!isInitializing && !processingStartedRef.current) {
      setIsProcessing(true);
      onProcessing?.(true);
      processingStartedRef.current = true;

      // Apply table state changes
      table.setGlobalFilter(debouncedGlobalFilter);
      table.setPagination(pagination);
      table.setSorting(sorting);
    }
  }, [debouncedGlobalFilter, pagination, sorting, table, onProcessing, isInitializing]);

  return {
    isProcessing,
    isInitializing,
  };
}