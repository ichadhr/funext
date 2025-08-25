'use client';

import * as React from "react";


import { Layout } from "@components/ui/layout/layout";
import { NAVIGATION_SECTIONS, NAV_ICONS } from "../nav-items";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { CardGrid } from "@/components/grids";
import { Avatar, Card, CardHeader, Text, TableCellLayout } from "@fluentui/react-components";
import { Default as FluentTable } from "@/components/fluent-table/fluent-table";
import { FluentColumnDef } from "@/components/fluent-table/types";
import { PresenceBadgeStatus } from "@fluentui/react-components";
import { DocumentPdfRegular, DocumentRegular, EditRegular, FolderRegular, OpenRegular, VideoRegular, PeopleRegular } from "@fluentui/react-icons";

const PAGE_TITLE = "Template";
const USER_NAME = "Kevin Sturgis";
const USER_ROLE = "Administrator";

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

const statusMap: Record<string, PresenceBadgeStatus> = {
    available: "available",
    busy: "busy",
    away: "away",
    offline: "offline",
};

const items: Item[] = [
    {
        file: { label: "Meeting notes", icon: <DocumentRegular /> },
        author: { label: "Max Mustermann", status: "available" },
        lastUpdated: { label: "7h ago", timestamp: 1 },
        lastUpdate: {
            label: "You edited this",
            icon: <EditRegular />,
        },
    },
    {
        file: { label: "Thursday presentation", icon: <FolderRegular /> },
        author: { label: "Erika Mustermann", status: "busy" },
        lastUpdated: { label: "Yesterday at 1:45 PM", timestamp: 2 },
        lastUpdate: {
            label: "You recently opened this",
            icon: <OpenRegular />,
        },
    },
    {
        file: { label: "Training recording", icon: <VideoRegular /> },
        author: { label: "John Doe", status: "away" },
        lastUpdated: { label: "Yesterday at 1:45 PM", timestamp: 2 },
        lastUpdate: {
            label: "You recently opened this",
            icon: <OpenRegular />,
        },
    },
    {
        file: { label: "Purchase order", icon: <DocumentPdfRegular /> },
        author: { label: "Jane Doe", status: "offline" },
        lastUpdated: { label: "Tue at 9:30 AM", timestamp: 3 },
        lastUpdate: {
            label: "You shared this in a Teams chat",
            icon: <PeopleRegular />,
        },
    },
];

const columnsAutoDetect: FluentColumnDef<Item>[] = [
    {
        columnId: "file",
        header: "File",
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
        header: "Author",
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
        header: "Last updated",
        cell: (item: Item) => item.lastUpdated.label,
        enableSorting: true,
        // For better sorting, specify the timestamp path
        accessorKey: "lastUpdated.timestamp",
    },
    {
        columnId: "lastUpdate",
        header: "Last update",
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
