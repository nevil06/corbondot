import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface ToastContextValue {
  showToast: (text?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text = 'Prototype: not wired', type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="carbon-toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`carbon-toast carbon-toast--${toast.type || 'info'}`} role="status">
            <span className="carbon-toast__icon" aria-hidden="true">
              {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="carbon-toast__text">{toast.text}</span>
            <button
              type="button"
              className="carbon-toast__close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
