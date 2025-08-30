"use client";

import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  useId
} from "@fluentui/react-components";
import { ArrowPrevious20Filled, ArrowNext20Filled } from "@fluentui/react-icons";
import { Table } from "@tanstack/react-table"; // Keep TanStack Table import
import { useStyles } from "../styles"; // Keep useStyles import

// Define props for PaginationButton
interface PaginationButtonProps {
  page: number;
  active: boolean;
  onClick: (page: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, page: number) => void;
  disabled?: boolean;
  className?: string;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  active,
  onClick,
  onKeyDown,
  disabled = false,
  className
}) => {
  const handleClick = () => {
    if (!active) {
      onClick(page);
    }
  };

  return (
    <ToolbarButton
      onClick={handleClick}
      onKeyDown={(event) => onKeyDown(event, page)}
      aria-label={`Page ${page}`}
      {...(active && { 'aria-current': 'page' })}
      disabled={disabled}
      {...(active && { appearance: "primary" })}
      className={className}
      tabIndex={0}
    >
      {page}
    </ToolbarButton>
  );
};

interface PaginationControlProps<TData extends object> {
    table: Table<TData>;
    previousPage: () => void;
    getCanPreviousPage: () => boolean;
    nextPage: () => void;
    getCanNextPage: () => boolean;
    getPageCount: () => number;
    getStatePagination: { pageIndex: number };
    setPageIndex: (updater: number | ((old: number) => number)) => void; // Add setPageIndex
}

export const PaginationControl = <TData extends object>({
    table, // Add table prop
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
    getPageCount,
    getStatePagination,
    setPageIndex, // Destructure setPageIndex
}: PaginationControlProps<TData>) => {
    const classes = useStyles();
    const [currentPage, setCurrentPage] = useState(getStatePagination.pageIndex + 1);
    const [totalPages, setTotalPages] = useState(getPageCount());

    useEffect(() => {
        setCurrentPage(getStatePagination.pageIndex + 1);
        setTotalPages(getPageCount());
    }, [getStatePagination.pageIndex, getPageCount]);

    const goToPage = useCallback((page: number) => {
        setPageIndex(page - 1); // TanStack Table uses 0-based indexing
    }, [setPageIndex]);

    const handlePageChange = useCallback((direction: 'prev' | 'next') => {
        if (direction === 'prev' && getCanPreviousPage()) {
            previousPage();
        } else if (direction === 'next' && getCanNextPage()) {
            nextPage();
        }
    }, [previousPage, getCanPreviousPage, nextPage, getCanNextPage]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, page: number) => {
        switch (event.key) {
            case 'ArrowLeft':
                if (page > 1) {
                    goToPage(page - 1);
                    event.preventDefault();
                }
                break;
            case 'ArrowRight':
                if (page < totalPages) {
                    goToPage(page + 1);
                    event.preventDefault();
                }
                break;
            case 'Home':
                goToPage(1);
                event.preventDefault();
                break;
            case 'End':
                goToPage(totalPages);
                event.preventDefault();
                break;
            default:
                break;
        }
    }, [goToPage, totalPages]);

    const renderPageNumbers = useCallback(() => {
        const pageNumbers = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationButton
                        key={i}
                        page={i}
                        active={currentPage === i}
                        onClick={goToPage}
                        onKeyDown={handleKeyDown}
                        disabled={false}
                        className={classes.paginationPageButton}
                    />
                );
            }
        } else {
            let startPage = currentPage - 1;
            let endPage = currentPage + 1;

            if (startPage <= 1) {
                startPage = 2;
                endPage = startPage + 2;
            } else if (endPage >= totalPages) {
                endPage = totalPages - 1;
                startPage = endPage - 2;
            }

            pageNumbers.push(
                <PaginationButton
                    key={1}
                    page={1}
                    active={currentPage === 1}
                    onClick={goToPage}
                    onKeyDown={handleKeyDown}
                    disabled={false}
                    className={classes.paginationPageButton}
                />
            );

            if (startPage > 2) {
                pageNumbers.push(<span key="ellipsis-start" className={classes.paginationEllipsis}>...</span>);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <PaginationButton
                        key={i}
                        page={i}
                        active={currentPage === i}
                        onClick={goToPage}
                        onKeyDown={handleKeyDown}
                        disabled={false}
                        className={classes.paginationPageButton}
                    />
                );
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="ellipsis-end" className={classes.paginationEllipsis}>...</span>);
            }

            pageNumbers.push(
                <PaginationButton
                    key={totalPages}
                    page={totalPages}
                    active={currentPage === totalPages}
                    onClick={goToPage}
                    onKeyDown={handleKeyDown}
                    disabled={false}
                    className={classes.paginationPageButton}
                />
            );
        }
        return pageNumbers;
    }, [currentPage, totalPages, goToPage, handleKeyDown, classes]);

    const tblPaginationId = useId();

    return (
        <Toolbar id={tblPaginationId} aria-label="Pagination controls" className={classes.paginationContainer}>
            <ToolbarGroup className={classes.paginationToolbarGroup}>
                <ToolbarButton
                    onClick={() => handlePageChange('prev')}
                    onKeyDown={(event) => handleKeyDown(event, currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    tabIndex={currentPage <= 1 ? -1 : 0}
                    appearance="subtle"
                    icon={<ArrowPrevious20Filled />} />
                <ToolbarDivider className={classes.paginationToolbarDivider} />
            </ToolbarGroup>

            <ToolbarGroup className={classes.paginationToolbarGroup}>
                {totalPages > 0 ? renderPageNumbers() : null}
            </ToolbarGroup>

            <ToolbarGroup className={classes.paginationToolbarGroup}>
                <ToolbarDivider className={classes.paginationToolbarDivider} />
                <ToolbarButton
                    onClick={() => handlePageChange('next')}
                    onKeyDown={(event) => handleKeyDown(event, currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    tabIndex={currentPage >= totalPages ? -1 : 0}
                    appearance="subtle"
                    icon={<ArrowNext20Filled />}
                    className={classes.paginationPageButtonLast} />
            </ToolbarGroup>
        </Toolbar>
    );
};