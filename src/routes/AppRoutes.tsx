import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

      {/* Admin Governance Routes (4 Screens) */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/verification" element={<SellerVerificationScreen />} />
      <Route path="/admin/listings" element={<ListingApprovalScreen />} />
      <Route path="/admin/users-transactions" element={<UsersTransactionsScreen />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
