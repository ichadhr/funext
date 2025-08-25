'use client';

import * as React from "react";


import { Layout } from "@components/ui/layout/layout";
import { NAVIGATION_SECTIONS, NAV_ICONS } from "../nav-items";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { CardGrid } from "@/components/grids";
import { Avatar, Card, CardHeader, Text, TableCellLayout, Label } from "@fluentui/react-components";
import { Default as FluentTable } from "@/components/fluent-table/fluent-table";
import { FluentColumnDef } from "@/components/fluent-table/types";
import { PresenceBadgeStatus } from "@fluentui/react-components";
import { DocumentPdfRegular, DocumentRegular, EditRegular, FolderRegular, OpenRegular, VideoRegular, PeopleRegular } from "@fluentui/react-icons";
import initialData from "./data.json";

const PAGE_TITLE = "Template";
const USER_NAME = "Kevin Sturgis";
const USER_ROLE = "Administrator";

// Define a mapping from string names to React icon components
const iconMap: { [key: string]: React.ReactElement } = {
    DocumentRegular: <DocumentRegular />,
    FolderRegular: <FolderRegular />,
    VideoRegular: <VideoRegular />,
    DocumentPdfRegular: <DocumentPdfRegular />,
    EditRegular: <EditRegular />,
    OpenRegular: <OpenRegular />,
    PeopleRegular: <PeopleRegular />,
};

export type FileCell = {
    label: string;
    icon: React.ReactElement;
};

export type ActivityCell = {
    label: string;
    timestamp?: number;
    icon?: React.ReactElement;
};

export type AuthorCell = {
    label: string;
    status: PresenceBadgeStatus;
};

export interface Item {
    file: { label: string; icon: React.JSX.Element };
    author: { label: string; status: string };
    lastUpdated: { label: string; timestamp: number };
    lastUpdate: { label: string; icon: React.JSX.Element };
    [key: string]: unknown; // Add index signature to allow dynamic property access
}

// Define interface for the raw data from data.json
interface RawItem {
    file: { label: string; icon: string };
    author: { label: string; status: string };
    lastUpdated: { label: string; timestamp: number };
    lastUpdate: { label: string; icon: string };
}

const statusMap: Record<string, PresenceBadgeStatus> = {
    available: "available",
    busy: "busy",
    away: "away",
    offline: "offline",
};

// Map the imported JSON data to the Item interface, replacing string icon names with actual React components
const items: Item[] = initialData.map((dataItem: RawItem) => ({
    ...dataItem,
    file: {
        ...dataItem.file,
        icon: iconMap[dataItem.file.icon] || null, // Map string to React component
    },
    lastUpdate: {
        ...dataItem.lastUpdate,
        icon: iconMap[dataItem.lastUpdate.icon] || null, // Map string to React component
    },
}));

const columnsAutoDetect: FluentColumnDef<Item>[] = [
    {
        columnId: "file",
        header: <Label weight="semibold">File</Label>,
        cell: (item: Item) => (
            <TableCellLayout media={item.file.icon}>
                {item.file.label}
            </TableCellLayout>
        ),
        enableSorting: false, // Will automatically try to sort by file.label
        // No accessorKey needed - it will try file.label automatically
    },
    {
        columnId: "author",
        header: <Label weight="semibold">Author</Label>,
        cell: (item: Item) => (
            <TableCellLayout
                media={
                    <Avatar
                        aria-label={item.author.label}
                        name={item.author.label}
                        badge={{ status: statusMap[item.author.status] || "offline" }}
                    />
                }
            >
                {item.author.label}
            </TableCellLayout>
        ),
        enableSorting: true, // Will automatically try to sort by author.label
    },
    {
        columnId: "lastUpdated",
        header: <Label weight="semibold">Last updated</Label>,
        cell: (item: Item) => item.lastUpdated.label,
        enableSorting: true,
        // For better sorting, specify the timestamp path
        accessorKey: "lastUpdated.timestamp",
    },
    {
        columnId: "lastUpdate",
        header: <Label weight="semibold">Last update</Label>,
        cell: (item: Item) => (
            <TableCellLayout media={item.lastUpdate.icon}>
                {item.lastUpdate.label}
            </TableCellLayout>
        ),
        enableSorting: false,
    },
];

export default function Page() {
    const breadcrumbs = useBreadcrumbs(PAGE_TITLE);

    return (
        <Layout
            navigationSections={NAVIGATION_SECTIONS}
            navIcons={NAV_ICONS}
            breadcrumbs={breadcrumbs}
            userName={USER_NAME}
            userRole={USER_ROLE}
        >
            <CardGrid type="fluid">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">Fluent Table Demo</Text>} />
                    <FluentTable<Item>
                        items={items}
                        columns={columnsAutoDetect}
                        sortable={true}
                        getRowId={(item) => item.file.label}
                    />
                </Card>
            </CardGrid>
        </Layout>
    );
}
