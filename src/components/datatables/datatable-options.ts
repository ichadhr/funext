"use client";

import { DataTableOptions } from './types';
import { ControlRenderer } from './helpers';
import { LengthSelect, Search, Pagination } from './controls';
import { Api } from 'datatables.net-dt';
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/use-debounce';

/**
 * Default layout configuration for DataTables
 * This defines the standard layout for DataTables controls including
 * search, pagination, and information displays.
 */
export const defaultLayout = {
    topStart: 'fluentPageLength',
    topEnd: 'fluentSearch',
    bottomStart: 'info',
    bottomEnd: 'fluentPagin'
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
 * like fluentPageLength and fluentSearch by rendering them with React.
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
    textBefore: string, // Re-introduce textBefore parameter
    textAfter: string // Re-introduce textAfter parameter
): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    const controlMap: { [key: string]: () => React.ReactElement | null } = {
        fluentPageLength: () => {
            return shouldShowLengthSelect(options)
                ? React.createElement(LengthSelect, {
                    tableRef,
                    textBefore: textBefore, // Use the passed textBefore
                    textAfter: textAfter,   // Use the passed textAfter
                    lengthLabels: options.language?.lengthLabels, // Use lengthLabels directly from options.language
                })
                : null;
        },
        fluentSearch: () =>
            shouldShowSearch(options)
                ? React.createElement(() => {
                    const [searchValue, setSearchValue] = useState<string>('');
                    const debouncedSearchValue = useDebounce<string>(searchValue, 500); // 500ms debounce

                    useEffect(() => {
                        if (tableRef.current) {
                            const table = tableRef.current.dt();
                            if (table) {
                                table.search(debouncedSearchValue).draw();
                            }
                        }
                    }, [debouncedSearchValue]);

                    return React.createElement(Search, {
                        onSearchChange: setSearchValue,
                        placeholder: options.language?.searchPlaceholder || '',
                        label: options.language?.search || 'Search:',
                    });
                })
                : null,
        fluentPagin: () =>
            shouldShowPagination(options)
                ? React.createElement(Pagination, {
                    tableRef,
                })
                : null,
    };

    for (const [key, value] of Object.entries(layoutConfig)) {
        if (typeof value === 'string' && controlMap[value]) {
            result[key] = ControlRenderer({
                component: controlMap[value](),
            });
        } else {
            result[key] = value;
        }
    }

    return result;
};