import * as React from 'react';
import { Field, Select, useId, SelectProps, makeStyles, tokens } from '@fluentui/react-components';

import { TableData, TablePageSizeSelectProps } from '../types';

const useStyles = makeStyles({
    pageSizeLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS
    }
});

export function TablePageSizeSelect<TData extends TableData>({ table, label, length, totalRows }: TablePageSizeSelectProps<TData>) {
    const styles = useStyles();
    console.log('data', totalRows);
    const selectId = useId();

    const onChange: SelectProps["onChange"] = (e, data) => {
        const value = data.value;
        if (value === '-1') {
            table.setPageSize(totalRows);
        } else {
            table.setPageSize(Number(value));
        }
    };

    const pageSizes = length || [5, 10, 50, -1];

    return (
        <>
            <Field label={label ?? "Show: "} className={styles.pageSizeLabel}>
                <Select
                    id={selectId}
                    aria-label="Page length select"
                    onChange={onChange}
                >
                    {pageSizes.map(pageSize => (
                        <option key={pageSize} value={String(pageSize)}>
                            {pageSize === -1 ? 'All' : pageSize}
                        </option>
                    ))}
                </Select>
            </Field>
        </>
    );
}
TablePageSizeSelect.displayName = 'TablePageSizeSelect';
