import React from 'react';
import './Card.css';

/**
 * Card Component
 *
 * Groww-inspired rounded card surface with subtle enterprise shadows,
 * generous whitespace, and high-contrast typography hierarchy.
 *
 * Variants:
 *  - 'default': White surface with subtle border and light shadow.
 *  - 'bordered': Slightly darker border, flat background.
 *  - 'elevated': Raised shadow for highlighted dashboard widgets.
 *  - 'interactive': Clickable card with focus-visible state and subtle hover lift.
 *
 * Padding:
 *  - 'none', 'sm' (16px), 'md' (24px), 'lg' (32px)
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      as: Component = 'div',
      selected = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={`carbon-card carbon-card--${variant} carbon-card--pad-${padding} ${
          selected ? 'carbon-card--selected' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Card.displayName = 'Card';

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon,
  className = '',
}) => {
  return (
    <Card variant="default" padding="md" className={`carbon-stat-card ${className}`}>
      <div className="carbon-stat-card__header">
        <span className="carbon-stat-card__label">{label}</span>
        {icon && <span className="carbon-stat-card__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="carbon-stat-card__value">{value}</div>
      {(subValue || trend) && (
        <div className="carbon-stat-card__footer">
          {trend && (
            <span
              className={`carbon-stat-card__trend ${
                trend.isPositive ? 'carbon-stat-card__trend--positive' : 'carbon-stat-card__trend--neutral'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subValue && <span className="carbon-stat-card__subvalue">{subValue}</span>}
        </div>
      )}
    </Card>
  );
};
