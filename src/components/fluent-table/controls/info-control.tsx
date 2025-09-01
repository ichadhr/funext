import React from "react";
import { Table } from "@tanstack/react-table";
import { useStyles } from "../styles";
import { Label } from "@fluentui/react-components";

interface InfoControlProps<TData extends object> {
    table: Table<TData>;
    currentPage?: number;
    pageSize?: number;
    // Server-side specific props
    serverSideTotalRecords?: number;
    serverSideCurrentRows?: number;
}

export const InfoControl = <TData extends object>({ table, currentPage = 0, pageSize = 10, serverSideTotalRecords, serverSideCurrentRows }: InfoControlProps<TData>) => {
    const classes = useStyles();

    // Use server-side props if provided, otherwise fall back to table data
    const totalRecords = serverSideTotalRecords !== undefined ? serverSideTotalRecords : table.getRowCount();
    const currentRows = serverSideCurrentRows !== undefined ? serverSideCurrentRows : table.getRowModel().rows.length;

    // Calculate the correct range for display
    const startIndex = (currentPage * pageSize) + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalRecords);

    // If we have data, show the range; otherwise show current rows
    const displayText = currentRows > 0 && totalRecords > 0
        ? `Showing ${startIndex} to ${endIndex} of ${totalRecords} entries`
        : `Showing ${currentRows} of ${totalRecords} entries`;

    return (
        <Label className={classes.controlWrapper}>
            {displayText}
        </Label>
    );
};