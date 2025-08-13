export interface DataTableColumn {
    title: string;
    data?: string;
    [key: string]: unknown;
}

export interface DataTableOptions {
    responsive?: boolean;
    ordering?: boolean;
    pageLength?: number;
    lengthChange?: boolean;
    paging?: boolean;
    searching?: boolean;
    columns?: DataTableColumn[];
    ajax?: string | object | (() => void);
    language?: {
        lengthMenu?: string;
        entries?: string | {
            _: string;
            [key: number]: string;
        };
        lengthLabels?: {
            [key: string]: string;
        };
        search?: string;
    };
    searchPlaceholder?: string;
    layout?: {
        topStart?: string | (() => HTMLElement);
        topEnd?: string | (() => HTMLElement);
        bottomStart?: string | (() => HTMLElement);
        bottomEnd?: string | (() => HTMLElement);
        [key: string]: string | (() => HTMLElement) | undefined;
    };
    [key: string]: unknown;
}

export interface DataTableProps {
    data?: (string | number | boolean)[][];
    columns?: DataTableColumn[];
    options?: DataTableOptions;
    className?: string;
}