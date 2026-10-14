import React from 'react';
import './StatusPill.css';

/**
 * StatusPill Component
 *
 * Serves all roles (Buyer, Seller, Admin) across the platform.
 * Variants (8 states):
 *  - 'Pending': Neutral muted grey/slate
 *  - 'Under Review': Muted amber/warm tone
 *  - 'Verified': Muted forest green
 *  - 'Listed': Muted sky/teal active tone
 *  - 'Sold': Muted slate/indigo
 *  - 'Retired': Rich muted emerald green
 *  - 'Rejected': Muted dark red/rose
 *  - 'Draft': Slate neutral
 *
 * Accessibility:
 *  - Always renders a visible semantic text label alongside the status indicator dot.
 *  - Dot is aria-hidden so screen readers announce the clear text label.
 *  - High-contrast text satisfies WCAG AA guidelines.
 */
export type StatusState =
  | 'Pending'
  | 'Under Review'
  | 'Verified'
  | 'Listed'
  | 'Sold'
  | 'Retired'
  | 'Rejected'
  | 'Draft'
  | 'Responded'
  | 'Accepted';

export interface StatusPillProps {
  status: StatusState;
  className?: string;
  size?: 'sm' | 'md';
}

const normalizeStatusKey = (status: StatusState): string => {
  return status.toLowerCase().replace(/\s+/g, '-');
};

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const statusKey = normalizeStatusKey(status);

  return (
    <span
      className={`status-pill status-pill--${statusKey} status-pill--${size} ${className}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <span className="status-pill__dot" aria-hidden="true" />
      <span className="status-pill__label">{status}</span>
    </span>
  );
};
