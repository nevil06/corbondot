import React, { useId } from 'react';
import './Input.css';

/**
 * Accessible Input Components (Input, Select, Textarea)
 *
 * Adheres strictly to WCAG AA form standards:
 *  - Real semantic <label> linked via htmlFor / id.
 *  - Clear helper text or error messages linked via aria-describedby.
 *  - Errors marked with role="alert" and aria-invalid="true".
 *  - Visible focus ring with high contrast border.
 */

export interface BaseFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

export interface InputProps
  extends BaseFieldProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = '',
      id,
      leftIcon,
      rightElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = error
      ? errorId
      : helperText
      ? helperId
      : undefined;

    return (
      <div className={`carbon-field ${error ? 'carbon-field--error' : ''} ${className}`}>
        <label htmlFor={inputId} className="carbon-field__label">
          {label}
          {required && <span className="carbon-field__required" aria-hidden="true">*</span>}
        </label>

        <div className={`carbon-input-wrapper ${disabled ? 'carbon-input-wrapper--disabled' : ''}`}>
          {leftIcon && <span className="carbon-input__icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            required={required}
            className={`carbon-input ${leftIcon ? 'carbon-input--has-left' : ''} ${
              rightElement ? 'carbon-input--has-right' : ''
            }`}
            {...props}
          />
          {rightElement && <div className="carbon-input__right-element">{rightElement}</div>}
        </div>

        {error && (
          <p id={errorId} className="carbon-field__error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="carbon-field__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends BaseFieldProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = '',
      id,
      options,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const describedBy = error
      ? errorId
      : helperText
      ? helperId
      : undefined;

    return (
      <div className={`carbon-field ${error ? 'carbon-field--error' : ''} ${className}`}>
        <label htmlFor={selectId} className="carbon-field__label">
          {label}
          {required && <span className="carbon-field__required" aria-hidden="true">*</span>}
        </label>

        <div className={`carbon-select-wrapper ${disabled ? 'carbon-select-wrapper--disabled' : ''}`}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            required={required}
            className="carbon-select"
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="carbon-select__arrow" aria-hidden="true">
            ▾
          </span>
        </div>

        {error && (
          <p id={errorId} className="carbon-field__error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="carbon-field__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps
  extends BaseFieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const describedBy = error
      ? errorId
      : helperText
      ? helperId
      : undefined;

    return (
      <div className={`carbon-field ${error ? 'carbon-field--error' : ''} ${className}`}>
        <label htmlFor={textareaId} className="carbon-field__label">
          {label}
          {required && <span className="carbon-field__required" aria-hidden="true">*</span>}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          required={required}
          className="carbon-textarea"
          {...props}
        />

        {error && (
          <p id={errorId} className="carbon-field__error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="carbon-field__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
