import React from "react";
import { Label, SearchBox, useId } from "@fluentui/react-components";
import { Table } from "@tanstack/react-table";
import { useStyles } from "./style";

interface SearchControlProps<TData extends object> {
    table: Table<TData>;
    globalFilter: string;
    setGlobalFilter: (filter: string) => void;
}

export const SearchControl = <TData extends object>({
    globalFilter,
    setGlobalFilter,
}: SearchControlProps<TData>) => {
    const searchId = useId();
    const classes = useStyles();
    return (
        <div className={classes.controlWrapper}>
            <Label htmlFor={searchId}>Search</Label>
            <SearchBox
                id={searchId}
                className={classes.searchSize}
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(e, data) => setGlobalFilter(data.value ?? "")}
            />
        </div>
    );
};