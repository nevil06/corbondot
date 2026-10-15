import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole, UserRole } from '../../context/RoleContext';
import { useToast } from '../Toast/ToastContext';
import { Building2, Sprout, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import './RoleSelectionModal.css';

interface RoleOption {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  features: string[];
  destination: string;
  destinationLabel: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    id: 'buyer',
    title: 'Institutional Buyer',
    badge: 'ESG & Corporate Offsets',
    description: 'Procure high-integrity carbon credits, issue institutional RFPs, compare project methodologies, and execute permanent retirements.',
    features: [
      'Interactive Marketplace & Faceted Filters',
      'Side-by-side Technical Compare Matrix',
      'RFP Quote Negotiation & Counter-Offers',
      'Cryptographic Retirement Certificates',
      'SEBI BRSR / GHG Protocol Scope Reports'
    ],
    destination: '/',
    destinationLabel: 'Go to Buyer Dashboard',
    icon: <Building2 size={26} strokeWidth={2} />,
  },
  {
    id: 'seller',
    title: 'Project Developer',
    badge: 'Origination & Registry',
    description: 'List certified carbon projects, complete seamless corporate KYC, manage batch-level inventory, and counter-quote buyer RFPs.',
    features: [
      '6-Step Guided Developer Onboarding',
      'New Project Listing & Document Submissions',
      'Batch Inventory Allocation Ledger',
      'Real-time Buyer RFP Inquiry Inbox'
    ],
    destination: '/seller/dashboard',
    destinationLabel: 'Go to Seller Dashboard',
    icon: <Sprout size={26} strokeWidth={2} />,
  },
  {
    id: 'admin',
    title: 'Registry Authority',
    badge: 'Governance & Integrity',
    description: 'Audit corporate developer credentials, verify 5-point methodological integrity checklists, and inspect immutable audit trails.',
    features: [
      'Seller Corporate KYC Verification Queue',
      '5-Point Methodological Integrity Review',
      'Marketplace Listing Approval Panel',
      'Dual-Tab Transaction & User Audit Logs'
    ],
    destination: '/admin/dashboard',
    destinationLabel: 'Go to Admin Dashboard',
    icon: <ShieldCheck size={26} strokeWidth={2} />,
  },
];

export const RoleSelectionModal: React.FC = () => {
  const { role: currentRole, isRoleModalOpen, closeRoleModal, selectRole, isAdminAuthenticated, openAdminAuthModal } = useRole();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!isRoleModalOpen) return null;

  const handleSelectRole = (roleOption: RoleOption) => {
    if (roleOption.id === 'admin' && !isAdminAuthenticated) {
      closeRoleModal();
      openAdminAuthModal();
      return;
    }
    selectRole(roleOption.id);
    navigate(roleOption.destination);
    showToast(`Switched to ${roleOption.title}`, 'success');
  };

  return (
    <div className="carbon-role-modal-overlay" onClick={closeRoleModal}>
      <div
        className="carbon-role-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="carbon-role-modal__header">
          <div className="carbon-role-modal__badge">PERSPECTIVE SELECTION</div>
          <h2 id="role-modal-title" className="carbon-role-modal__title">
            Select Your Role in Carbonly
          </h2>
          <p className="carbon-role-modal__subtitle">
            Choose your organizational viewpoint. You can seamlessly switch perspectives anytime via the top navigation or your profile button.
          </p>
        </div>

        <div className="carbon-role-modal__grid">
          {ROLES.map((item) => {
            const isSelected = currentRole === item.id;
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                className={`carbon-role-card ${isSelected ? 'carbon-role-card--active' : ''}`}
                onClick={() => handleSelectRole(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectRole(item);
                  }
                }}
              >
                <div className="carbon-role-card__top">
                  <div className="carbon-role-card__icon-wrap">{item.icon}</div>
                  <span className="carbon-role-card__badge">{item.badge}</span>
                </div>

                <h3 className="carbon-role-card__title">{item.title}</h3>
                <p className="carbon-role-card__desc">{item.description}</p>

                <ul className="carbon-role-card__features" aria-label={`${item.title} features`}>
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="carbon-role-card__feature-item">
                      <Check size={14} className="carbon-role-card__check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`carbon-role-card__btn ${isSelected ? 'carbon-role-card__btn--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(item);
                  }}
                >
                  <span>{isSelected ? 'Continue to Portal' : 'Select Portal'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="carbon-role-modal__footer">
          <span className="carbon-role-modal__hint">
            💡 100% In-Memory State • Actions in one role (like Buyer RFP or Seller Inventory) instantly reflect across all perspectives.
          </span>
          <button
            type="button"
            className="carbon-role-modal__dismiss"
            onClick={closeRoleModal}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
