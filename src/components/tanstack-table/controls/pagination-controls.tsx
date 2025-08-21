import * as React from 'react';
import { Button, Label, Input, makeStyles, tokens } from '@fluentui/react-components';
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
});

import { TablePaginationControlsProps } from '../types';

export function TablePaginationControls<TData extends TableData>(
    { table, pageIndex, pageCount, canPreviousPage, canNextPage, totalItems }: TablePaginationControlsProps<TData>
) {
    const styles = useStyles();

    return (
        <div className={styles.paginationControls}>
            <Label>
                Go to page:{' '}
                <Input
                    type="number"
                    value={String(pageIndex + 1)}
                    onChange={e => {
                        let page = e.target.value ? Number(e.target.value) - 1 : 0;
                        // Clamp the page value to be within valid range
                        page = Math.max(0, Math.min(page, pageCount - 1));
                        table.setPageIndex(page);
                    }}
                    style={{ width: '70px' }}
                    disabled={!canNextPage && pageCount === 0}
                    max={pageCount > 0 ? pageCount : 1} // Set max attribute for number input
                    min={0} // Set min attribute for number input
                />
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
TablePaginationControls.displayName = 'TablePaginationControls';
