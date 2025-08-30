import React from "react";
import { Dropdown, Option, Label, useId, DropdownProps } from "@fluentui/react-components";
import { Table } from "@tanstack/react-table";
import { useStyles } from "../styles";

interface PageSizeControlProps<TData extends object> extends Partial<DropdownProps> { // Extend DropdownProps
    table: Table<TData>;
    getStatePagination: { pageSize: number };
    setPageSize: (pageSize: number) => void;
}

export const PageSizeControl = <TData extends object>({
    table, // Add table back
    getStatePagination,
    setPageSize,
    ...rest // Destructure rest props
}: PageSizeControlProps<TData>) => {
    const pageSizeId = useId();
    const classes = useStyles();
    return (
        <div className={classes.stackedControlWrapper}>
            <Label htmlFor={pageSizeId}>Show</Label>
            <Dropdown
                id={pageSizeId}
                className={classes.forceUnderlineBorder} // Apply the new class
                value={getStatePagination.pageSize.toString()}
                selectedOptions={[getStatePagination.pageSize.toString()]}
                onOptionSelect={(e, data) => {
                    setPageSize(Number(data.optionValue));
                }}
                {...rest} // Spread rest props
            >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                    <Option
                        key={pageSize}
                        value={pageSize.toString()}
                        text={`${pageSize}`}
                    >
                        {pageSize}
                    </Option>
                ))}
            </Dropdown>
        </div>
    );
};