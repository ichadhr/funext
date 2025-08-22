import * as React from 'react';
import { Button, Label, SpinButton, makeStyles, tokens, useId } from '@fluentui/react-components';
import { ArrowEjectFilled, ArrowNextFilled, ArrowPreviousFilled } from '@fluentui/react-icons';
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
    { table, pageIndex, pageCount, canPreviousPage, canNextPage }: TablePaginationControlsProps<TData>
) {
    const styles = useStyles();

    return (
        <div className={styles.paginationControls}>
            <Label htmlFor={useId('page-spin-button')}>
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
                    disabled={!canNextPage && pageCount === 0}
                    id={useId('page-spin-button')}
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
                disabled={!canPreviousPage}
                aria-label="First page"
                icon={<ArrowEjectFilled className={styles.rotatedIconLeft} />}
            />
            <Button
                onClick={() => table.previousPage()}
                disabled={!canPreviousPage}
                aria-label="Previous page"
                icon={<ArrowPreviousFilled />}
            />
            <Button
                onClick={() => table.nextPage()}
                disabled={!canNextPage}
                aria-label="Next page"
                icon={<ArrowNextFilled />}
            />
            <Button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!canNextPage}
                aria-label="Last page"
                icon={<ArrowEjectFilled className={styles.rotatedIconRight} />}
            />
        </div>
    );
}
TablePaginationControls.displayName = 'TablePaginationControls';
