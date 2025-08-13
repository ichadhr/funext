"use client";

import { createRoot } from 'react-dom/client';
import LengthSelect from './lengthSelect';
import Search from './search';
import { DataTableOptions } from './fluentDataTable';
import { Api } from 'datatables.net-dt';

/**
 * Default layout configuration for DataTables
 */
export const defaultLayout = {
    topStart: 'fluentPageLength',
    topEnd: 'fluentSearch',
    bottomStart: 'info',
    bottomEnd: 'paging'
};

/**
 * Process layout configuration to handle fluentPageLength and fluentSearch
 * @param layoutConfig The layout configuration object
 * @param options DataTable options
 * @param tableRef Reference to the table
 * @param textBefore Text to show before the length select
 * @param textAfter Text to show after the length select
 * @returns Processed layout configuration
 */
export const processLayout = (
    layoutConfig: Record<string, unknown>,
    options: DataTableOptions,
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>,
    textBefore: string,
    textAfter: string
) => {
    // Determine if length select should be shown
    const shouldShowLengthSelect = (options: DataTableOptions) => {
        return (options.lengthChange === true || options.lengthChange === undefined) &&
            (options.paging === true || options.paging === undefined);
    };

    // Determine if search should be shown
    const shouldShowSearch = (options: DataTableOptions) => {
        return options.searching !== false;
    };

    return Object.entries(layoutConfig).reduce((acc, [key, value]) => {
        if (value === 'fluentPageLength') {
            acc[key] = function () {
                const toolbar = document.createElement('div');
                const root = createRoot(toolbar);

                if (shouldShowLengthSelect(options)) {
                    root.render(
                        <LengthSelect
                            tableRef={tableRef}
                            textBefore={textBefore}
                            textAfter={textAfter}
                            lengthLabels={options.language?.lengthLabels}
                        />
                    );
                }

                return toolbar;
            };
        } else if (value === 'fluentSearch') {
            acc[key] = function () {
                const toolbar = document.createElement('div');
                const root = createRoot(toolbar);

                if (shouldShowSearch(options)) {
                    root.render(
                        <Search
                            onSearchChange={(value) => {
                                if (tableRef.current) {
                                    const table = tableRef.current.dt();
                                    if (table) {
                                        table.search(value).draw();
                                    }
                                }
                            }}
                            placeholder={(options.searchPlaceholder as string) || ""}
                        />
                    );
                }

                return toolbar;
            };
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, unknown>);
};