"use client";

import * as React from "react";
import { CardGrid } from "@/components/grids";
import {
    Card,
    TableCellLayout,
    Avatar,
    PresenceBadgeStatus,
} from "@fluentui/react-components";
import {
    DocumentPdfRegular,
    DocumentRegular,
    EditRegular,
    PeopleRegular,
    FolderRegular,
    OpenRegular,
    VideoRegular,
} from "@fluentui/react-icons";
import { FluentTable, ColumnDef } from "@/components/fluent-table/fluent-table";
import { SortingState } from "@tanstack/react-table"; // Import SortingState
import data from "./data.json";

type TableItem = (typeof data)[0];

// Define the columns using TanStack Table's ColumnDef
const columns: ColumnDef<TableItem>[] = [
    {
        accessorKey: "file.label",
        header: "File",
        cell: ({ row }) => {
            const file = row.original.file;
            const IconComponent =
                file.icon === "DocumentPdfRegular"
                    ? DocumentPdfRegular
                    : DocumentRegular;
            return (
                <TableCellLayout media={<IconComponent />}>
                    {file.label}
                </TableCellLayout>
            );
        },
    },
    {
        accessorKey: "author.label",
        header: "Author",
        cell: ({ row }) => {
            const author = row.original.author;
            return (
                <TableCellLayout
                    media={
                        <Avatar
                            aria-label={author.label}
                            name={author.label}
                            badge={{ status: author.status as PresenceBadgeStatus }}
                        />
                    }
                >
                    {author.label}
                </TableCellLayout>
            );
        },
    },
    {
        accessorKey: "lastUpdated.label",
        header: "Last Updated",
        enableSorting: false, // Add this line to disable sorting
        cell: ({ row }) => row.original.lastUpdated.label,
    },
    {
        accessorKey: "lastUpdate.label",
        header: "Last Update",
        cell: ({ row }) => {
            const lastUpdate = row.original.lastUpdate;
            let IconComponent: React.ElementType;
            switch (lastUpdate.icon) {
                case "DocumentPdfRegular":
                    IconComponent = DocumentPdfRegular;
                    break;
                case "DocumentRegular":
                    IconComponent = DocumentRegular;
                    break;
                case "EditRegular":
                    IconComponent = EditRegular;
                    break;
                case "PeopleRegular":
                    IconComponent = PeopleRegular;
                    break;
                case "FolderRegular":
                    IconComponent = FolderRegular;
                    break;
                case "OpenRegular":
                    IconComponent = OpenRegular;
                    break;
                case "VideoRegular":
                    IconComponent = VideoRegular;
                    break;
                default:
                    IconComponent = DocumentRegular;
            }
            return (
                <TableCellLayout media={<IconComponent />}>
                    {lastUpdate.label}
                </TableCellLayout>
            );
        },
    },
];

export default function Page() {

    return (
        <>
            <CardGrid type="fluid">
                <Card appearance="subtle">
                    <h2>Fluent Table</h2>
                    <FluentTable
                        data={data}
                        columns={columns}
                        striped={true}
                        event={{
                            onInitializing: React.useCallback((initializing: boolean) => {
                                console.log("Table initializing state:", initializing);
                            }, []),
                            onPreInit: React.useCallback(() => {
                                console.log("Table is about to initialize!");
                            }, []),
                            onInit: React.useCallback(() => {
                                console.log("Table has initialized!");
                            }, []),
                            onPreDraw: React.useCallback(() => {
                                console.log("Table is about to draw!");
                            }, []),
                            onDraw: React.useCallback(() => {
                                console.log("Table has drawn!");
                            }, []),
                            
                            onSearch: React.useCallback((filterValue: string) => {
                                console.log("Table search filter changed:", filterValue);
                            }, []),
                            onOrder: React.useCallback((sorting: SortingState) => {
                                console.log("Table order changed:", sorting);
                            }, []),
                            onPageChange: React.useCallback((pageIndex: number, pageSize: number) => {
                                console.log("Table page changed: Page Index", pageIndex, "Page Size", pageSize);
                            }, []),
                            onPageLengthChange: React.useCallback((pageSize: number) => {
                                console.log("Table page length changed: Page Size", pageSize);
                            }, []),
                            onProcessing: React.useCallback((processing: boolean) => {
                                console.log("Table processing state:", processing);
                            }, []),
                        }}
                    />
                </Card>
            </CardGrid>
        </>
    );
}

