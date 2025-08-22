import * as React from 'react';
import { Label, makeStyles, tokens } from '@fluentui/react-components';
import { TableInfoProps, TableData } from '../types';

const useStyles = makeStyles({
    infoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
    },
});

export function TableInfo<TData extends TableData>(
    { pageIndex, pageSize, totalItems }: TableInfoProps<TData>
) {
    const styles = useStyles();

    const startIndex = pageIndex * pageSize + 1;
    const endIndex = Math.min((pageIndex + 1) * pageSize, totalItems);

    return (
        <div className={styles.infoContainer}>
            <Label>
                Showing{' '}
                    {startIndex} to {endIndex} of {totalItems}
                entries
            </Label>
        </div>
    );
}
TableInfo.displayName = 'TableInfo';
