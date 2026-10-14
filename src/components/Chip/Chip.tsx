import React from 'react';
import './Chip.css';

/**
 * Filter & Category Chip Component
 *
 * Used for marketplace category filtering, removal vs reduction badges,
 * and multi-select tags.
 *
 * States:
 *  - unselected: Light neutral pill, dark text, subtle border
 *  - selected: Forest Green background or border, high contrast
 *  - with count: optional number badge
 */

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  count?: number | string;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  count,
  onRemove,
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={selected}
      className={`carbon-chip ${selected ? 'carbon-chip--selected' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="carbon-chip__icon" aria-hidden="true">{icon}</span>}
      <span className="carbon-chip__label">{label}</span>
      {count !== undefined && (
        <span className="carbon-chip__count" aria-hidden="true">
          {count}
        </span>
      )}
      {onRemove && (
        <span
          className="carbon-chip__remove"
          role="button"
          aria-label={`Remove filter ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </span>
      )}
    </button>
  );
};
