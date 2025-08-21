import * as React from 'react';
import { Field, Select, makeStyles, tokens } from '@fluentui/react-components';
import { Table } from '@tanstack/react-table';
import { TableData } from '../types';

const useStyles = makeStyles({
    pageSizeSelect: {
        width: '100px', // Adjust as needed
    },
});

import { TablePageSizeSelectProps } from '../types';

const TablePageSizeSelectInternal = <TData extends TableData>({ table }: TablePageSizeSelectProps<TData>) => {
    const styles = useStyles();

    return (
        <Field label="Page Size">
            <Select
                value={String(table.getState().pagination.pageSize)}
                onChange={e => {
                    table.setPageSize(Number(e.target.value));
                }}
                className={styles.pageSizeSelect}
            >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </Select>
        </Field>
    );
};

export const TablePageSizeSelect = React.memo(TablePageSizeSelectInternal) as any;
TablePageSizeSelect.displayName = 'TablePageSizeSelect';