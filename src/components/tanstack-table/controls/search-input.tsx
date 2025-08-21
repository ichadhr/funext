import * as React from 'react';
import { Field, SearchBox } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';
import { Table } from '@tanstack/react-table';
import { TableData } from '../types';

const useStyles = makeStyles({
    searchInput: {
        width: '200px', // Adjust as needed
    },
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
        <Field label="Search">
            <SearchBox
                value={globalFilter ?? ''}
                onChange={onChange}
                placeholder="Search all columns..."
                className={styles.searchInput}
            />
        </Field>
    );
}
TableSearchInput.displayName = 'TableSearchInput';
