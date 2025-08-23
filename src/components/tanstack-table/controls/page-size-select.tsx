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

export function TablePageSizeSelect<TData extends TableData>({ table, label, length, totalRows, loading }: TablePageSizeSelectProps<TData>) {
    const styles = useStyles();
    const selectId = useId('select-control');

    // Local state to reflect user's selection immediately (optimistic UI)
    const [selectedValue, setSelectedValue] = React.useState<string>(() => {
        const initial = table.getState().pagination.pageSize;
        return (initial === totalRows) ? '-1' : String(initial);
    });

    const onChange: SelectProps["onChange"] = (e, data) => {
        const value = data.value;
        // update local state immediately so the UI reflects the selection
        setSelectedValue(value);
        if (value === '-1') {
            table.setPageSize(totalRows);
        } else {
            table.setPageSize(Number(value));
        }
    };

    const pageSizes = length || [5, 10, 50, -1];

    // Make the select controlled using the table's current pageSize.
    // If the pageSize equals totalRows we show '-1' (All) as the selected value.
    const currentPageSize = table.getState().pagination.pageSize;

    // Keep local selectedValue in sync with table state (e.g. after remote load completes)
    React.useEffect(() => {
        const derived = (currentPageSize === totalRows) ? '-1' : String(currentPageSize);
        setSelectedValue(derived);
    }, [table, totalRows, currentPageSize]);

    const controlledValue = selectedValue;

    return (
        <>
            <Field label={label ?? "Show: "} className={styles.pageSizeLabel}>
                <Select
                    id={selectId}
                    aria-label="Page length select"
                    onChange={onChange}
                    value={controlledValue}        // controlled (optimistic + synced)
                    disabled={loading}
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
