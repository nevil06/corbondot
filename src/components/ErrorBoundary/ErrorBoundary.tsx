import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';
import { Button } from '../Button/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log cleanly without crashing the prototype
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="carbon-error-boundary" role="alert">
          <div className="carbon-error-boundary__card">
            <div className="carbon-error-boundary__icon" aria-hidden="true">
              ⚠
            </div>
            <h1 className="carbon-error-boundary__title">Something unexpected occurred</h1>
            <p className="carbon-error-boundary__desc">
              The application encountered a runtime issue. Your session data is safely preserved.
            </p>
            {this.state.error && (
              <pre className="carbon-error-boundary__trace">
                {this.state.error.message}
              </pre>
            )}
            <div className="carbon-error-boundary__actions">
              <Button variant="primary" onClick={this.handleReset}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
