import * as React from 'react';
import { Field, SearchBox, tokens, useId } from '@fluentui/react-components';
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
    onSearchChange?: (value: string) => void; // New optional prop for server-side filtering
    placeholder?: string;
    label?: string;
}

export function TableSearchInput<TData extends TableData>({ table, onSearchChange, placeholder, label }: TableSearchInputProps<TData>) {
    const styles = useStyles();
    // Use internal state if onSearchChange is not provided, otherwise rely on parent
    const [internalFilter, setInternalFilter] = React.useState('');

    // Determine the current filter value based on whether onSearchChange is used
    const currentFilter = onSearchChange ? table.getState().globalFilter : internalFilter;
    const searchId = useId('search-control');

    React.useEffect(() => {
        if (!onSearchChange) { // Only update TanStack's global filter if not manual
            table.setGlobalFilter(internalFilter);
        }
    }, [internalFilter, table, onSearchChange]);

    const onChange = React.useCallback((event: React.SyntheticEvent<HTMLElement, Event>, data?: { value?: string }) => {
        const newValue = data?.value || '';
        if (onSearchChange) {
            onSearchChange(newValue); // Call parent's handler for manual filtering
        } else {
            setInternalFilter(newValue); // Update internal state for client-side filtering
        }
    }, [onSearchChange, setInternalFilter]);

    return (
        <Field label={label ?? "Search: "} className={styles.searchLabel}>
            <SearchBox
                id={searchId}
                value={currentFilter ?? ''}
                onChange={onChange}
                placeholder={placeholder ?? "Search..."}
                className={styles.searchInput}
            />
        </Field>
    );
}
TableSearchInput.displayName = 'TableSearchInput';
