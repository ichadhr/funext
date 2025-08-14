// Import official DataTables types
import { Config, ConfigColumns, ConfigColumnDefs, AjaxSettings } from 'datatables.net';

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
    ajax?: string | (AjaxSettings & { url?: string; type?: string });
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
}