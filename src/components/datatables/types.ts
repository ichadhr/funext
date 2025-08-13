export interface PagingOptions {
    type?: string;
    numbers?: boolean;
    buttons?: number;
    boundaryNumbers?: boolean;
}

export interface LayoutOption {
    paging?: PagingOptions;
}

export interface DataTableColumn {
    title: string;
    data?: string | number;
    [key: string]: unknown;
}

export interface DataTableOptions {
    processing?: boolean;
    serverSide?: boolean;
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
        topStart?: string | (() => HTMLElement) | LayoutOption;
        topEnd?: string | (() => HTMLElement) | LayoutOption;
        bottomStart?: string | (() => HTMLElement) | LayoutOption;
        bottomEnd?: string | (() => HTMLElement) | LayoutOption;
        [key: string]: string | (() => HTMLElement) | LayoutOption | undefined;
    };
    [key: string]: unknown;
}

export interface DataTableProps {
    data?: (string | number | boolean)[][];
    columns?: DataTableColumn[];
    options?: DataTableOptions;
    className?: string;
}