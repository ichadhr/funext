import React from "react";
import { Table } from "@tanstack/react-table";
import { useStyles } from "../styles";
import { Label } from "@fluentui/react-components";

interface InfoControlProps<TData extends object> {
    table: Table<TData>;
}

export const InfoControl = <TData extends object>({ table }: InfoControlProps<TData>) => {
    const classes = useStyles();
    return (
        <Label className={classes.controlWrapper}>
            Showing {table.getRowModel().rows.length} of {table.getRowCount()} entries
        </Label>
    );
};