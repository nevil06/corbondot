import React from 'react';
import './Table.css';

/**
 * Accessible Enterprise Data Table
 *
 * Requirements:
 *  - Semantic HTML: <table>, <thead>, <tbody>, <th scope="col">, <th scope="row">
 *  - Responsive overflow wrapper with horizontal scrollbar styling
 *  - Accessible empty state variant
 *  - Loading skeleton state variant
 *  - Error state variant
 */

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  caption?: string;
  isLoading?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  skeletonRows?: number;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  caption,
  isLoading = false,
  errorMessage,
  emptyTitle = 'No records found',
  emptyMessage = 'There are no items to display matching your criteria.',
  emptyAction,
  onRowClick,
  className = '',
  skeletonRows = 4,
}: TableProps<T>) {
  return (
    <div className={`carbon-table-container ${className}`}>
      <table className="carbon-table">
        {caption && <caption className="carbon-table__caption">{caption}</caption>}
        <thead>
          <tr className="carbon-table__header-row">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`carbon-table__th carbon-table__th--${col.align || 'left'}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 1. Loading Skeleton Variant */}
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, rIdx) => (
              <tr key={`skeleton-${rIdx}`} className="carbon-table__skeleton-row" aria-hidden="true">
                {columns.map((col) => (
                  <td key={col.key} className={`carbon-table__td carbon-table__td--${col.align || 'left'}`}>
                    <div className="carbon-table__skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))}

          {/* 2. Error State Variant */}
          {!isLoading && errorMessage && (
            <tr>
              <td colSpan={columns.length} className="carbon-table__state-cell">
                <div className="carbon-table__state-content carbon-table__state--error" role="alert">
                  <span className="carbon-table__state-title">Unable to load table data</span>
                  <p className="carbon-table__state-desc">{errorMessage}</p>
                </div>
              </td>
            </tr>
          )}

          {/* 3. Empty State Variant */}
          {!isLoading && !errorMessage && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="carbon-table__state-cell">
                <div className="carbon-table__state-content carbon-table__state--empty">
                  <span className="carbon-table__state-title">{emptyTitle}</span>
                  <p className="carbon-table__state-desc">{emptyMessage}</p>
                  {emptyAction && <div className="carbon-table__state-action">{emptyAction}</div>}
                </div>
              </td>
            </tr>
          )}

          {/* 4. Data Rows */}
          {!isLoading &&
            !errorMessage &&
            data.map((row, rIdx) => {
              const rowKey = keyExtractor(row, rIdx);
              const isClickable = Boolean(onRowClick);

              return (
                <tr
                  key={rowKey}
                  className={`carbon-table__body-row ${
                    isClickable ? 'carbon-table__body-row--clickable' : ''
                  }`}
                  onClick={isClickable ? () => onRowClick!(row) : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={
                    isClickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick!(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col, cIdx) => {
                    const content = col.render
                      ? col.render(row, rIdx)
                      : (row as Record<string, unknown>)[col.key] as React.ReactNode;

                    if (cIdx === 0) {
                      return (
                        <th
                          key={col.key}
                          scope="row"
                          className={`carbon-table__td carbon-table__td--row-header carbon-table__td--${
                            col.align || 'left'
                          }`}
                        >
                          {content}
                        </th>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        className={`carbon-table__td carbon-table__td--${col.align || 'left'}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
