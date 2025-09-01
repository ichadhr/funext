import React from "react";
import { Label, SearchBox, useId, mergeClasses } from "@fluentui/react-components";
import { Table } from "@tanstack/react-table";
import { useStyles } from "../styles"; // Re-import to refresh types

interface SearchControlProps<TData extends object> {
    table?: Table<TData>;
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
        <div className={classes.stackedControlWrapper}>
            <Label htmlFor={searchId}>Search</Label>
            <SearchBox
                id={searchId}
                className={mergeClasses(classes.searchSize, classes.mobileSearchBox)}
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(e, data) => setGlobalFilter(data.value ?? "")}
            />
        </div>
    );
};