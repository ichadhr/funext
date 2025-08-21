import * as React from 'react';
import { Field, Select, makeStyles, tokens } from '@fluentui/react-components';
import { TableData } from '../types';

const useStyles = makeStyles({
    pageSizeSelect: {
        width: '80px', // Adjust as needed
    },
    pageSizeLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS
    }
});

import { TablePageSizeSelectProps } from '../types';

export function TablePageSizeSelect<TData extends TableData>({ table }: TablePageSizeSelectProps<TData>) {
    const styles = useStyles();

    return (
        <Field label="Page Size" className={styles.pageSizeLabel}>
            <Select
                value={String(table.getState().pagination.pageSize)}
                onChange={e => {
                    table.setPageSize(Number(e.target.value));
                }}
                className={styles.pageSizeSelect}
            >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        {pageSize}
                    </option>
                ))}
            </Select>
        </Field>
    );
}
TablePageSizeSelect.displayName = 'TablePageSizeSelect';
