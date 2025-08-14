"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup
} from "@fluentui/react-components";
import { ArrowPrevious20Filled, ArrowNext20Filled } from "@fluentui/react-icons";

import { Api } from 'datatables.net-dt';
import React from 'react';
import { useDataTableStyles } from '../styles';

interface PaginationProps {
  tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>;
}

interface PageInfo {
  page: number;
  pages: number;
  start: number;
  end: number;
  length: number;
  recordsTotal: number;
  recordsDisplay: number;
}

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

const Pagination = ({ tableRef }: PaginationProps): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const styles = useDataTableStyles();

  // Initialize and update pagination info
  const updatePaginationInfo = useCallback((table: Api<unknown>) => {
    const pageInfo = table.page.info() as PageInfo;

    // Handle case where there are no records
    if (pageInfo.recordsTotal === 0) {
      // Only reset to page 1 if we're not already on a search/filter result
      if (pageInfo.pages === 0) {
        setCurrentPage(0);
        setTotalPages(0);
      } else {
        // Keep current page but update totals
        setTotalPages(0);
      }
    } else {
      setCurrentPage(pageInfo.page + 1); // DataTables uses 0-based indexing
      setTotalPages(pageInfo.pages);
    }
  }, []);

  // Navigate to a specific page
  const goToPage = useCallback((page: number) => {
    if (!tableRef.current) return;

    const table = tableRef.current.dt();
    if (table) {
      // DataTables uses 0-based indexing
      table.page(page - 1).draw(false);
    }
  }, [tableRef]);

  // Handle previous/next page navigation
  const handlePageChange = useCallback((direction: 'prev' | 'next') => {
    if (!tableRef.current) return;

    const table = tableRef.current.dt();
    if (table) {
      const pageInfo = table.page.info() as PageInfo;
      let newPage = pageInfo.page + 1; // Use actual page from DataTables

      if (direction === 'prev' && pageInfo.page > 0) {
        newPage = pageInfo.page; // Use 0-based index from DataTables
      } else if (direction === 'next' && pageInfo.page < pageInfo.pages - 1) {
        newPage = pageInfo.page + 2; // Use 0-based index from DataTables
      }

      goToPage(newPage);
    }
  }, [tableRef, goToPage]);

  // Handle keyboard navigation
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

  // Set up DataTables event listeners
  useEffect(() => {
    if (!tableRef.current) return;

    const table = tableRef.current.dt();
    if (!table) return;

    // Handle table draw events (includes initialization and page changes)
    const handleDraw = () => {
      updatePaginationInfo(table);
    };

    // Listen to DataTables draw events which fire after every table update
    table.on('draw', handleDraw);

    // Initial update in case the table is already initialized
    handleDraw();

    return () => {
      // Clean up event listener
      table.off('draw', handleDraw);
    };
  }, [tableRef, updatePaginationInfo]);

  // Generate page numbers to display
  const renderPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 7; // Show 7 page buttons when possible

    // For small number of pages, show all
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
            className={styles.paginationPageButton}
          />
        );
      }
    } else {
      // For many pages, show first, around current (centered), and last
      // For many pages, show first, around current (centered), and last
      // We want to show exactly 7 elements: first page, ellipsis, 3 middle pages, ellipsis, last page

      // Calculate start and end pages to show around current page
      let startPage = currentPage - 1;
      let endPage = currentPage + 1;

      // Adjust if we're near the boundaries
      if (startPage <= 1) {
        startPage = 2;
        endPage = startPage + 2;
      } else if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = endPage - 2;
      }

      // Always show first page
      pageNumbers.push(
        <PaginationButton
          key={1}
          page={1}
          active={currentPage === 1}
          onClick={goToPage}
          onKeyDown={handleKeyDown}
          disabled={false}
          className={styles.paginationPageButton}
        />
      );

      // Show ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis-start" className={styles.paginationEllipsis}>...</span>);
      }

      // Show middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationButton
            key={i}
            page={i}
            active={currentPage === i}
            onClick={goToPage}
            onKeyDown={handleKeyDown}
            disabled={false}
            className={styles.paginationPageButton}
          />
        );
      }

      // Show ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis-end" className={styles.paginationEllipsis}>...</span>);
      }

      // Always show last page
      pageNumbers.push(
        <PaginationButton
          key={totalPages}
          page={totalPages}
          active={currentPage === totalPages}
          onClick={goToPage}
          onKeyDown={handleKeyDown}
          disabled={false}
          className={styles.paginationPageButton}
        />
      );
    }

    return pageNumbers;
  }, [currentPage, totalPages, goToPage, handleKeyDown, styles]);

  return (
    <Toolbar aria-label="Pagination controls" className={styles.paginationContainer}>
      <ToolbarGroup className={styles.paginationToolbarGroup}>
        <ToolbarButton
          onClick={() => handlePageChange('prev')}
          onKeyDown={(event) => handleKeyDown(event, currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          tabIndex={currentPage <= 1 ? -1 : 0}
          appearance="subtle"
          icon={<ArrowPrevious20Filled />} />
        <ToolbarDivider className={styles.paginationToolbarDivider} />
      </ToolbarGroup>

      <ToolbarGroup className={styles.paginationToolbarGroup}>
        {totalPages > 0 ? renderPageNumbers() : null}
      </ToolbarGroup>

      <ToolbarGroup className={styles.paginationToolbarGroup}>
        <ToolbarDivider className={styles.paginationToolbarDivider} />
        <ToolbarButton
          onClick={() => handlePageChange('next')}
          onKeyDown={(event) => handleKeyDown(event, currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          tabIndex={currentPage >= totalPages ? -1 : 0}
          appearance="subtle"
          icon={<ArrowNext20Filled />} />
      </ToolbarGroup>

    </Toolbar>
  );
};

export default Pagination;