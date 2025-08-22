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
    { pageIndex, pageSize, totalRows }: TableInfoProps<TData>
) {
    const styles = useStyles();

    // Ensure all values are numbers, default to 0 if NaN
    const safePageIndex = Number.isFinite(pageIndex) ? pageIndex : 0;
    const safePageSize = Number.isFinite(pageSize) ? pageSize : 0;
    const safeTotalRows = Number.isFinite(totalRows) ? totalRows : 0;

    const startIndex = safePageIndex * safePageSize + 1;
    const endIndex = Math.min((safePageIndex + 1) * safePageSize, safeTotalRows);

    // Handle case where totalRows is 0 or less, to prevent showing "1 to 0 of 0" if no data
    const displayStartIndex = safeTotalRows === 0 ? 0 : startIndex;
    const displayEndIndex = safeTotalRows === 0 ? 0 : endIndex;

    return (
        <div className={styles.infoContainer}>
            <Label>
                Showing{' '}
                {displayStartIndex} to {displayEndIndex} of {safeTotalRows}
                entries
            </Label>
        </div>
    );
}
TableInfo.displayName = 'TableInfo';
