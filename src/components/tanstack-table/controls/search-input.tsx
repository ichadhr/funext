import * as React from 'react';
import { Field, SearchBox, tokens } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';
import { Table } from '@tanstack/react-table';
import { TableData } from '../types';

const useStyles = makeStyles({
    searchInput: {
        width: '170px', // Adjust as needed
    },
    searchLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS
    }
});

interface TableSearchInputProps<TData extends TableData> {
    table: Table<TData>;
}

export function TableSearchInput<TData extends TableData>({ table }: TableSearchInputProps<TData>) {
    const styles = useStyles();
    const [globalFilter, setGlobalFilter] = React.useState('');

    React.useEffect(() => {
        table.setGlobalFilter(globalFilter);
    }, [globalFilter, table]);

    const onChange = React.useCallback((event: React.SyntheticEvent<HTMLElement, Event>, data?: { value?: string }) => {
        setGlobalFilter(data?.value || '');
    }, [setGlobalFilter]);

    return (
        <Field label="Search" className={styles.searchLabel}>
            <SearchBox
                value={globalFilter ?? ''}
                onChange={onChange}
                placeholder="Search..."
                className={styles.searchInput}
            />
        </Field>
    );
}
TableSearchInput.displayName = 'TableSearchInput';
