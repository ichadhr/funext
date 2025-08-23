"use client";

import { DataTableOptions } from '../types';
import { ControlRenderer } from './control-renderer';
import { LengthSelect, Search, Pagination } from '../controls';
import { Api } from 'datatables.net-dt';
import React from 'react';

/**
 * Default layout configuration for DataTables
 * This defines the standard layout for DataTables controls including
 * search, pagination, and information displays.
 */
export const defaultLayout = {
    topStart: 'fluentPageLength',
    topEnd: 'fluentSearch',
    bottomStart: 'info',
    bottomEnd: 'fluentPaging'
};

/**
 * Determines if the length select control should be displayed based on DataTable options
 * @param options - DataTable configuration options
 * @returns boolean - True if length select should be shown
 */
export const shouldShowLengthSelect = (options: DataTableOptions): boolean => {
    return (options.lengthChange === true || options.lengthChange === undefined) &&
        (options.paging === true || options.paging === undefined);
};

/**
 * Determines if the search control should be displayed based on DataTable options
 * @param options - DataTable configuration options
 * @returns boolean - True if search should be shown
 */
export const shouldShowSearch = (options: DataTableOptions): boolean => {
    return options.searching !== false;
};

/**
 * Determines if the pagination control should be displayed based on DataTable options
 * @param options - DataTable configuration options
 * @returns boolean - True if pagination should be shown
 */
export const shouldShowPagination = (options: DataTableOptions): boolean => {
    return options.paging !== false;
};

/**
 * Processes the layout configuration for DataTables, handling custom controls
 * like fluentPageLength, fluentSearch, and fluentPaging by rendering them with React.
 *
 * @param layoutConfig - The layout configuration object from DataTables
 * @param options - DataTable configuration options
 * @param tableRef - Reference to the DataTable instance
 * @param textBefore - Text to display before the length select control
 * @param textAfter - Text to display after the length select control
 * @returns Processed layout configuration with custom controls rendered
 */
export const processLayout = (
    layoutConfig: Record<string, unknown>,
    options: DataTableOptions,
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>,
    textBefore: string,
    textAfter: string
): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    // Start with default layout if not provided
    const finalLayout = { ...defaultLayout, ...layoutConfig };

    for (const [key, value] of Object.entries(finalLayout)) {
        if (value === 'fluentPageLength') {
            result[key] = ControlRenderer({
                component: shouldShowLengthSelect(options) ? (
                    React.createElement(LengthSelect, {
                        tableRef,
                        textBefore,
                        textAfter,
                        lengthLabels: options.language?.lengthLabels || {}
                    })
                ) : null
            });
        } else if (value === 'fluentSearch') {
            result[key] = ControlRenderer({
                component: shouldShowSearch(options) ? (
                    React.createElement(Search, {
                        onSearchChange: (value: string) => {
                            if (tableRef.current) {
                                const table = tableRef.current.dt();
                                if (table) {
                                    table.search(value).draw();
                                }
                            }
                        },
                        placeholder: options.language?.searchPlaceholder || "",
                        label: options.language?.search || "Search:"
                    })
                ) : null
            });
        } else if (value === 'fluentPaging') {
            result[key] = ControlRenderer({
                component: shouldShowPagination(options) ? (
                    React.createElement(Pagination, {
                        tableRef
                    })
                ) : null
            });
        } else {
            result[key] = value;
        }
    }

    return result;
};

export const parseLengthMenuText = (lengthMenu?: string) => {
    if (!lengthMenu) return ["", "entries per page"];
    const parts = lengthMenu.split('_MENU_');
    return [parts[0] || "", parts[1] || ""];
};