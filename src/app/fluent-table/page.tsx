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
                            onDraw: () => {
                                console.log("Table has drawn!");
                                // You can add any logic here that needs to run after a table draw
                            },
                            // onError: handleError,
                            onInit: () => {
                                console.log("Table has initialized!");
                                // You can add any logic here that needs to run after table initialization
                            },
                            onSearch: (filterValue) => {
                                console.log("Table search filter changed:", filterValue);
                            },
                            onOrder: (sorting) => {
                                console.log("Table order changed:", sorting);
                            },
                        }}
                    />
                </Card>
            </CardGrid>
        </>
    );
}

