// Import official DataTables types
import { Config, ConfigColumns, ConfigColumnDefs, AjaxSettings, Api } from 'datatables.net-dt';
import React, { KeyboardEvent } from 'react';

/**
 * Extend DataTables Config interface to include our custom options
 */
export interface DataTableOptions extends Config {
    // Our custom options can be added here
    // For now, we'll use the standard DataTables options
    // This interface extends Config to inherit all DataTables options

    /**
     * Extend the ajax property to properly include JQueryAjaxSettings
     */
    ajax?: string | AjaxSettings | ((data: unknown, callback: (data: unknown) => void, settings: unknown) => void);
}

/**
 * Use the official DataTables column definition
 * We can extend this in the future if we need custom properties
 */
export type DataTableColumn = ConfigColumns;

/**
 * Use the official DataTables column definition for columnDefs
 * We can extend this in the future if we need custom properties
 */
export type DataTableColumnDefs = ConfigColumnDefs;

/**
 * Props for our FluentDataTable component
 */
export interface DataTableProps {
    data?: Array<Record<string, unknown>>;
    options?: DataTableOptions;
    loading?: boolean;
    error?: string | null;
}
export interface DataTableSettings {
    aLengthMenu: Array<number | number[]>;
}

export interface PageInfo {
    page: number;
    pages: number;
    start: number;
    end: number;
    length: number;
    recordsTotal: number;
    recordsDisplay: number;
}

export interface LengthSelectProps {
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>;
    textBefore?: string;
    textAfter?: string;
    lengthLabels?: {
        [key: string]: string;
    };
}

export interface SearchProps {
    onSearchChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export interface PaginationProps {
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>;
}

export interface PaginationButtonProps {
    page: number;
    active: boolean;
    onClick: (page: number) => void;
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, page: number) => void;
    disabled?: boolean;
    className?: string;
}