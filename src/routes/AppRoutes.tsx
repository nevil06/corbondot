import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { ShieldCheck, Lock } from 'lucide-react';

// Showcase
import { DesignSystemScreen } from '../screens/DesignSystem/DesignSystem';

// Buyer Screens (9)
import { BuyerDashboard } from '../screens/buyer/BuyerDashboard';
import { MarketplaceScreen } from '../screens/buyer/MarketplaceScreen';
import { ProjectDetailScreen } from '../screens/buyer/ProjectDetailScreen';
import { CompareScreen } from '../screens/buyer/CompareScreen';
import { QuoteRequestScreen } from '../screens/buyer/QuoteRequestScreen';
import { QuotesScreen } from '../screens/buyer/QuotesScreen';
import { PortfolioScreen } from '../screens/buyer/PortfolioScreen';
import { RetirementCertificateScreen } from '../screens/buyer/RetirementCertificateScreen';
import { ReportsScreen } from '../screens/buyer/ReportsScreen';

// Seller Screens (5)
import { SellerDashboard } from '../screens/seller/SellerDashboard';
import { SellerOnboardingScreen } from '../screens/seller/SellerOnboardingScreen';
import { AddProjectScreen } from '../screens/seller/AddProjectScreen';
import { InventoryScreen } from '../screens/seller/InventoryScreen';
import { InquiriesScreen } from '../screens/seller/InquiriesScreen';

// Admin Screens (4)
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { SellerVerificationScreen } from '../screens/admin/SellerVerificationScreen';
import { ListingApprovalScreen } from '../screens/admin/ListingApprovalScreen';
import { UsersTransactionsScreen } from '../screens/admin/UsersTransactionsScreen';

// Admin Security Gate Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated, openAdminAuthModal } = useRole();

  if (!isAdminAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '480px',
        textAlign: 'center',
        padding: '32px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'rgba(45, 106, 79, 0.12)',
          color: 'var(--color-forest-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <ShieldCheck size={36} />
        </div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Admin Authority Gate
        </h2>
        <p style={{ margin: '0 0 24px 0', maxWidth: '420px', color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          This portal is restricted to compliance auditors and registry authorities. Please enter the authority password to proceed.
        </p>
        <button
          type="button"
          onClick={openAdminAuthModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-forest-green)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(45, 106, 79, 0.28)'
          }}
        >
          <Lock size={16} />
          <span>Unlock with Passcode (admin123)</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Design System Reference Route */}
      <Route path="/design-system" element={<DesignSystemScreen />} />

      {/* Buyer Primary Flow Routes (9 Screens) */}
      <Route path="/" element={<BuyerDashboard />} />
      <Route path="/marketplace" element={<MarketplaceScreen />} />
      <Route path="/project/:id" element={<ProjectDetailScreen />} />
      <Route path="/compare" element={<CompareScreen />} />
      <Route path="/quotes/request" element={<QuoteRequestScreen />} />
      <Route path="/quotes/request/:projectId" element={<QuoteRequestScreen />} />
      <Route path="/quotes" element={<QuotesScreen />} />
      <Route path="/portfolio" element={<PortfolioScreen />} />
      <Route path="/certificate" element={<RetirementCertificateScreen />} />
      <Route path="/certificate/:id" element={<RetirementCertificateScreen />} />
      <Route path="/reports" element={<ReportsScreen />} />

      {/* Seller Routes (5 Screens) */}
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/onboarding" element={<SellerOnboardingScreen />} />
      <Route path="/seller/projects" element={<AddProjectScreen />} />
      <Route path="/seller/projects/new" element={<AddProjectScreen />} />
      <Route path="/seller/inventory" element={<InventoryScreen />} />
      <Route path="/seller/inquiries" element={<InquiriesScreen />} />

      {/* Admin Governance Routes (4 Screens Protected by admin123 Gate) */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/verification" element={<AdminRoute><SellerVerificationScreen /></AdminRoute>} />
      <Route path="/admin/listings" element={<AdminRoute><ListingApprovalScreen /></AdminRoute>} />
      <Route path="/admin/users-transactions" element={<AdminRoute><UsersTransactionsScreen /></AdminRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
