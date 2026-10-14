import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useRole, UserRole } from '../../context/RoleContext';
import './TopNav.css';

interface NavItem {
  label: string;
  to: string;
}

const BUYER_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Compare', to: '/compare' },
  { label: 'Quotes', to: '/quotes' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Reports', to: '/reports' },
];

const SELLER_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/seller/dashboard' },
  { label: 'Projects', to: '/seller/projects' },
  { label: 'Inventory', to: '/seller/inventory' },
  { label: 'Inquiries', to: '/seller/inquiries' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Verification', to: '/admin/verification' },
  { label: 'Listings', to: '/admin/listings' },
  { label: 'Users & Transactions', to: '/admin/users-transactions' },
];

export const TopNav: React.FC = () => {
  const { role, setRole } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    // Navigate to role's primary dashboard
    if (newRole === 'buyer') navigate('/');
    if (newRole === 'seller') navigate('/seller/dashboard');
    if (newRole === 'admin') navigate('/admin/dashboard');
    setMobileMenuOpen(false);
  };

  const navLinks = role === 'buyer' ? BUYER_NAV : role === 'seller' ? SELLER_NAV : ADMIN_NAV;

  return (
    <header className="carbon-nav">
      <div className="carbon-nav__container">
        {/* Brand / Logo */}
        <div className="carbon-nav__brand-section">
          <Link to="/" className="carbon-nav__brand" aria-label="Carbonly Home">
            <span className="carbon-nav__logo-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9l9 6 9-6V7l-9-5z" />
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M12 2v10" />
              </svg>
            </span>
            <span className="carbon-nav__brand-name">Carbonly</span>
          </Link>
          <span className="carbon-nav__prototype-badge" title="Figma Design Reference Prototype">
            PROTOTYPE
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="carbon-nav__links" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `carbon-nav__link ${isActive ? 'carbon-nav__link--active' : ''}`
              }
              end={item.to === '/' || item.to.endsWith('dashboard')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Role Switcher & Design System Link */}
        <div className="carbon-nav__controls">
          <Link
            to="/design-system"
            className="carbon-nav__ds-link"
            title="Inspect Phase A Design System & Tokens Showroom"
          >
            Design System
          </Link>

          <div className="carbon-nav__role-switcher">
            <label htmlFor="role-select" className="carbon-nav__role-label">
              Role:
            </label>
            <div className="carbon-nav__role-select-wrapper">
              <select
                id="role-select"
                value={role}
                onChange={handleRoleChange}
                className="carbon-nav__role-select"
                aria-label="Switch active user role"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
              <span className="carbon-nav__role-arrow" aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="carbon-nav__mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="carbon-nav__mobile-drawer">
          <nav className="carbon-nav__mobile-links" aria-label="Mobile Navigation">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `carbon-nav__mobile-link ${isActive ? 'carbon-nav__mobile-link--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
                end={item.to === '/' || item.to.endsWith('dashboard')}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="carbon-nav__mobile-divider" />
            <NavLink
              to="/design-system"
              className="carbon-nav__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Design System Showcase
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};
