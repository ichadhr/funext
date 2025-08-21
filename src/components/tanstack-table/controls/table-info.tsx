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
    { pageIndex, pageCount, totalItems }: TableInfoProps<TData>
) {
    const styles = useStyles();

    return (
        <div className={styles.infoContainer}>
            <Label>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageCount}
                </strong>{' '}
                ({totalItems} items)
            </Label>
        </div>
    );
}
TableInfo.displayName = 'TableInfo';
