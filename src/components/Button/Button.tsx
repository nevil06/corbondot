import React from 'react';
import './Button.css';

/**
 * Button Component
 *
 * Variants:
 *  - 'primary': Forest Green (#2D6A4F) background, white text. Reserved for primary actions.
 *  - 'secondary': Light neutral surface, dark text with subtle border.
 *  - 'outline': Transparent background, border in Forest Green or slate, hover tint.
 *  - 'ghost': Transparent background, minimal padding, subtle hover.
 *  - 'danger': Red accent for destructive operations (e.g. Reject, Cancel).
 *
 * Sizes:
 *  - 'sm' (32px height, 12px padding)
 *  - 'md' (40px height, 16px padding)
 *  - 'lg' (48px height, 20px padding)
 *
 * Accessibility:
 *  - Always retains visible focus ring on keyboard navigation.
 *  - Supports aria-label for icon or abbreviated buttons.
 *  - Uses aria-busy and aria-disabled when loading or disabled.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        className={`carbon-btn carbon-btn--${variant} carbon-btn--${size} ${
          fullWidth ? 'carbon-btn--full' : ''
        } ${isLoading ? 'carbon-btn--loading' : ''} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="carbon-btn__spinner" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className="carbon-btn__icon carbon-btn__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="carbon-btn__text">{children}</span>
        {!isLoading && rightIcon && (
          <span className="carbon-btn__icon carbon-btn__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
