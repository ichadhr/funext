import * as React from 'react';
import { Button, Label, SpinButton, makeStyles, tokens, useId } from '@fluentui/react-components';
import { ChevronLeftFilled, ChevronRightFilled, ArrowNextFilled, ArrowPreviousFilled } from '@fluentui/react-icons';
import { TableData } from '../types';

const useStyles = makeStyles({
    paginationControls: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
    },
    rotatedIconLeft: {
        transform: 'rotate(-90deg)',
    },
    rotatedIconRight: {
        transform: 'rotate(90deg)',
    },
    spinButton: {
        width: '70px',
    },
});

import { TablePaginationControlsProps } from '../types';

export function TablePaginationControls<TData extends TableData>(
    { table, pageIndex, pageCount, canPreviousPage, canNextPage, loading }: TablePaginationControlsProps<TData>
) {
    const styles = useStyles();
    const paginationId = useId('pagination-control');

    return (
        <div className={styles.paginationControls}>
            <Label htmlFor={paginationId}>
                Go to page:{' '}
                <SpinButton
                    value={pageIndex + 1}
                    onChange={(e, data) => {
                        let page = data.value ? data.value - 1 : 0;
                        if (data.displayValue) {
                            page = Number(data.displayValue) - 1;
                        }
                        // Clamp the page value to be within valid range
                        page = Math.max(0, Math.min(page, pageCount - 1));
                        table.setPageIndex(page);
                    }}
                    min={0}
                    max={pageCount > 0 ? pageCount : 1}
                    id={paginationId}
                    className={styles.spinButton}
                />
            </Label>
            <Label>
                Page {' '}
                    {pageIndex + 1} of {pageCount}
                    {' '}
            </Label>
            <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!canPreviousPage || loading}
                aria-label="First page"
                icon={<ArrowPreviousFilled />}
            />
            <Button
                onClick={() => table.previousPage()}
                disabled={!canPreviousPage || loading}
                aria-label="Previous page"
                icon={<ChevronLeftFilled/>}
            />
            <Button
                onClick={() => table.nextPage()}
                disabled={!canNextPage || loading}
                aria-label="Next page"
                icon={<ChevronRightFilled />}
            />
            <Button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!canNextPage || loading}
                aria-label="Last page"
                icon={<ArrowNextFilled />}
            />
        </div>
    );
}
TablePaginationControls.displayName = 'TablePaginationControls';
