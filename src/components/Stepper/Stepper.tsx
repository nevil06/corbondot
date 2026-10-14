import React from 'react';
import './Stepper.css';

/**
 * Stepper Component
 *
 * Used for multi-step onboarding wizard and project lifecycle tracking.
 * Provides accessible step orientation via aria-current="step"
 * and clear visual state (completed, active, upcoming).
 */

export interface StepItem {
  id?: string | number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex?: number;
  currentStep?: number;
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  const activeIndex = currentStepIndex ?? currentStep ?? 0;
  return (
    <nav
      aria-label="Progress Stepper"
      className={`carbon-stepper carbon-stepper--${orientation} ${className}`}
    >
      <ol className="carbon-stepper__list">
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const isClickable = Boolean(onStepClick && index <= activeIndex);

          let statusClass = 'upcoming';
          if (isCurrent) statusClass = 'current';
          if (isCompleted) statusClass = 'completed';

          return (
            <li
              key={step.id ?? index}
              className={`carbon-stepper__item carbon-stepper__item--${statusClass}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={`carbon-stepper__button-wrapper ${
                  isClickable ? 'carbon-stepper__button-wrapper--clickable' : ''
                }`}
                onClick={isClickable ? () => onStepClick!(index) : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={
                  isClickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onStepClick!(index);
                        }
                      }
                    : undefined
                }
              >
                <span className="carbon-stepper__indicator" aria-hidden="true">
                  {isCompleted ? '✓' : index + 1}
                </span>

                <div className="carbon-stepper__content">
                  <span className="carbon-stepper__label">{step.label}</span>
                  {step.description && (
                    <span className="carbon-stepper__desc">{step.description}</span>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`carbon-stepper__connector ${
                    isCompleted ? 'carbon-stepper__connector--completed' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
