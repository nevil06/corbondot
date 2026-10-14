import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './components/Toast/ToastContext';
import { CarbonAppProvider } from './context/CarbonAppContext';
import { TopNav } from './components/Nav/TopNav';
import { AppRoutes } from './routes/AppRoutes';
import './tokens/tokens.css';
import './App.css';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <ToastProvider>
          <CarbonAppProvider>
            <BrowserRouter>
              <div className="carbon-layout">
              <TopNav />
              <main id="main-content" className="carbon-main">
                <AppRoutes />
              </main>
              <footer className="carbon-footer">
                <div className="carbon-footer__container">
                  <div className="carbon-footer__left">
                    <span className="carbon-footer__brand">Carbonly Reference Prototype</span>
                    <span className="carbon-footer__tagline">
                      • B2B High-Integrity Carbon Marketplace Design Reference
                    </span>
                  </div>
                  <div className="carbon-footer__right">
                    <span className="carbon-footer__badge">No Network Calls • 100% Local Mock Data</span>
                  </div>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </CarbonAppProvider>
      </ToastProvider>
    </RoleProvider>
    </ErrorBoundary>
  );
};

export default App;
