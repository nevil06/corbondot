import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useRole, UserRole } from '../../context/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Building2,
  Sprout,
  ShieldCheck,
  Search,
  Bell,
  SlidersHorizontal,
  Lock,
  LogOut
} from 'lucide-react';
import './TopNav.css';

interface NavItem {
  label: string;
  to: string;
}

const BUYER_NAV: NavItem[] = [
  { label: 'Explore', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Compare', to: '/compare' },
  { label: 'RFPs & Quotes', to: '/quotes' },
  { label: 'Holdings', to: '/portfolio' },
  { label: 'ESG Reports', to: '/reports' },
];

const SELLER_NAV: NavItem[] = [
  { label: 'Explore', to: '/seller/dashboard' },
  { label: 'Projects', to: '/seller/projects' },
  { label: 'Inventory Ledger', to: '/seller/inventory' },
  { label: 'Buyer Inquiries', to: '/seller/inquiries' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', to: '/admin/dashboard' },
  { label: 'Verification Queue', to: '/admin/verification' },
  { label: 'Listing Approvals', to: '/admin/listings' },
  { label: 'Audit Trail', to: '/admin/users-transactions' },
];

const MARKET_TICKER = [
  { index: 'INDIA CCTS', value: '₹1,450.00', change: '+28.50 (2.01%)', isUp: true },
  { index: 'VCS NATURE-BASED', value: '₹1,280.00', change: '+16.40 (1.30%)', isUp: true },
  { index: 'GOLD STANDARD', value: '₹1,820.00', change: '-9.20 (-0.50%)', isUp: false },
  { index: 'GCC RENEWABLE', value: '₹640.00', change: '+7.80 (1.23%)', isUp: true },
  { index: 'CORSIA AVIATION', value: '₹2,100.00', change: '+35.00 (1.69%)', isUp: true },
];

const ROLE_PROFILE_DATA = {
  buyer: {
    name: 'Tata Power ESG Desk',
    roleLabel: 'Institutional Buyer',
    orgType: 'Corporate Offsetter',
    avatarChar: 'B',
    homePath: '/',
    icon: Building2,
  },
  seller: {
    name: 'Renewable Biochar Ltd',
    roleLabel: 'Project Developer',
    orgType: 'Registry Originator',
    avatarChar: 'S',
    homePath: '/seller/dashboard',
    icon: Sprout,
  },
  admin: {
    name: 'Carbonly Integrity Council',
    roleLabel: 'Market Authority',
    orgType: 'Compliance & Audit',
    avatarChar: 'A',
    homePath: '/admin/dashboard',
    icon: ShieldCheck,
  },
};

export const TopNav: React.FC = () => {
  const {
    role,
    setRole,
    openRoleModal,
    isAdminAuthenticated,
    openAdminAuthModal,
    logoutAdmin
  } = useRole();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [profileDropdownOpen]);

  const handleRoleSwitch = (newRole: UserRole) => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);

    if (newRole === 'admin' && !isAdminAuthenticated) {
      openAdminAuthModal();
      return;
    }

    setRole(newRole);
    if (newRole === 'buyer') navigate('/');
    if (newRole === 'seller') navigate('/seller/dashboard');
    if (newRole === 'admin') navigate('/admin/dashboard');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const navLinks = role === 'buyer' ? BUYER_NAV : role === 'seller' ? SELLER_NAV : ADMIN_NAV;
  const currentProfile = ROLE_PROFILE_DATA[role];
  const CurrentIcon = currentProfile.icon;

  return (
    <header className="carbon-nav">
      {/* ── Tier 1: Top Line (Little Up) ──
          Left: Logo + Carbonly (Bold, prominent)
          Right: Search bar, Theme Switcher, Notifications, Profile / Authority (In that line itself!) */}
      <div className="carbon-nav__tier-top">
        <div className="carbon-nav__container">
          {/* Logo & Brand */}
          <div className="carbon-nav__brand-wrapper">
            <Link to={currentProfile.homePath} className="carbon-nav__brand" aria-label="Carbonly Home">
              <span className="carbon-nav__logo-circle" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v9l9 6 9-6V7l-9-5z" />
                  <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M12 2v10" />
                </svg>
              </span>
              <div className="carbon-nav__brand-titles">
                <span className="carbon-nav__brand-name">Carbonly</span>
                <span className="carbon-nav__brand-tag">B2B Carbon Registry</span>
              </div>
            </Link>
          </div>

          {/* Right Controls: Search, Theme, Bell, Profile (In this line itself!) */}
          <div className="carbon-nav__top-right">
            {/* Search Bar with Ctrl+K */}
            <form onSubmit={handleSearchSubmit} className="carbon-nav__search-bar">
              <Search size={15} className="carbon-nav__search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credits, vintages (Ctrl+K)..."
                className="carbon-nav__search-input"
                aria-label="Search carbon projects"
              />
            </form>

            {/* Design System Link */}
            <Link
              to="/design-system"
              className="carbon-nav__ds-badge"
              title="Inspect Design System Tokens & Components"
            >
              Design System
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="carbon-nav__icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'White'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="carbon-nav__icon-btn carbon-nav__bell-btn"
              aria-label="Notifications"
              onClick={() => navigate(role === 'buyer' ? '/quotes' : role === 'seller' ? '/seller/inquiries' : '/admin/verification')}
              title="5 Pending ESG notifications"
            >
              <Bell size={18} />
              <span className="carbon-nav__bell-badge">5</span>
            </button>

            {/* Profile / Authority Button (In this exact line) */}
            <div className="carbon-nav__profile-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`carbon-nav__profile-btn ${profileDropdownOpen ? 'carbon-nav__profile-btn--active' : ''}`}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
                aria-label="User Profile & Perspective Menu"
              >
                <div className="carbon-nav__avatar-badge">
                  {currentProfile.avatarChar}
                </div>
                <div className="carbon-nav__profile-text">
                  <span className="carbon-nav__profile-role-name">{currentProfile.roleLabel}</span>
                  <span className="carbon-nav__profile-org">{currentProfile.name.split(' ')[0]}</span>
                </div>
                <ChevronDown size={14} className={`carbon-nav__chevron ${profileDropdownOpen ? 'carbon-nav__chevron--rotated' : ''}`} />
              </button>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div className="carbon-profile-popover" role="menu">
                  <div className="carbon-profile-popover__header">
                    <div className="carbon-profile-popover__avatar-large">
                      <CurrentIcon size={22} />
                    </div>
                    <div className="carbon-profile-popover__details">
                      <div className="carbon-profile-popover__name">{currentProfile.name}</div>
                      <div className="carbon-profile-popover__sub">{currentProfile.orgType}</div>
                    </div>
                  </div>

                  <div className="carbon-profile-popover__divider" />

                  <div className="carbon-profile-popover__section">
                    <span className="carbon-profile-popover__label">Active Perspective:</span>
                    <div className="carbon-profile-popover__roles">
                      <button
                        type="button"
                        className={`carbon-profile-popover__role-chip ${role === 'buyer' ? 'carbon-profile-popover__role-chip--active' : ''}`}
                        onClick={() => handleRoleSwitch('buyer')}
                      >
                        <Building2 size={13} />
                        <span>Buyer</span>
                      </button>
                      <button
                        type="button"
                        className={`carbon-profile-popover__role-chip ${role === 'seller' ? 'carbon-profile-popover__role-chip--active' : ''}`}
                        onClick={() => handleRoleSwitch('seller')}
                      >
                        <Sprout size={13} />
                        <span>Seller</span>
                      </button>
                      <button
                        type="button"
                        className={`carbon-profile-popover__role-chip ${role === 'admin' ? 'carbon-profile-popover__role-chip--active' : ''}`}
                        onClick={() => handleRoleSwitch('admin')}
                      >
                        {isAdminAuthenticated ? <ShieldCheck size={13} /> : <Lock size={13} />}
                        <span>Admin</span>
                      </button>
                    </div>
                  </div>

                  <div className="carbon-profile-popover__divider" />

                  <div className="carbon-profile-popover__actions">
                    <button
                      type="button"
                      className="carbon-profile-popover__action-btn"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openRoleModal();
                      }}
                    >
                      <Sparkles size={15} />
                      <span>Switch Perspective Gateway</span>
                    </button>

                    <button
                      type="button"
                      className="carbon-profile-popover__action-btn"
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                      <span>Theme: {theme === 'light' ? 'Switch to Dark' : 'Switch to White'}</span>
                    </button>

                    {role === 'admin' && isAdminAuthenticated && (
                      <button
                        type="button"
                        className="carbon-profile-popover__action-btn carbon-profile-popover__action-btn--danger"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutAdmin();
                        }}
                      >
                        <LogOut size={15} />
                        <span>Lock Admin Authority</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle Button */}
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
      </div>

      {/* ── Tier 2: Bottom Line (Little Bit Down) ──
          Left: Navigation Tabs (Explore, Marketplace, Compare, etc.)
          Right: Switch Perspective Button */}
      <div className="carbon-nav__tier-bottom">
        <div className="carbon-nav__container">
          <nav className="carbon-nav__tabs" aria-label="Perspective Navigation">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `carbon-nav__tab ${isActive ? 'carbon-nav__tab--active' : ''}`
                }
                end={item.to === '/' || item.to.endsWith('dashboard')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="carbon-nav__sub-right">
            <button
              type="button"
              className="carbon-nav__quick-portal-btn"
              onClick={openRoleModal}
              title="Open Role Selection Gateway"
            >
              <SlidersHorizontal size={13} />
              <span>Switch Perspective</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Tier 3: Market Indices Ticker Strip (Strictly bounded, no right-side spill!) ── */}
      <div className="carbon-nav__tier-ticker" aria-label="Live Carbon Price Indices">
        <div className="carbon-nav__container carbon-nav__ticker-container">
          <div className="carbon-nav__ticker-grid">
            {MARKET_TICKER.map((item, idx) => (
              <div key={idx} className="carbon-nav__ticker-item">
                <span className="carbon-nav__ticker-name">{item.index}</span>
                <span className="carbon-nav__ticker-val">{item.value}</span>
                <span className={`carbon-nav__ticker-delta ${item.isUp ? 'carbon-nav__ticker-delta--up' : 'carbon-nav__ticker-delta--down'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="carbon-nav__mobile-drawer">
          <div className="carbon-nav__mobile-role-banner">
            <span className="carbon-nav__mobile-role-label">Current Perspective:</span>
            <div className="carbon-nav__mobile-role-buttons">
              {(['buyer', 'seller', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`carbon-nav__mobile-role-btn ${role === r ? 'carbon-nav__mobile-role-btn--active' : ''}`}
                  onClick={() => handleRoleSwitch(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

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
            <button
              type="button"
              className="carbon-nav__mobile-action"
              onClick={() => {
                setMobileMenuOpen(false);
                toggleTheme();
              }}
            >
              {theme === 'light' ? '🌙 Switch to Dark Theme' : '☀️ Switch to White Theme'}
            </button>
            <button
              type="button"
              className="carbon-nav__mobile-action"
              onClick={() => {
                setMobileMenuOpen(false);
                openRoleModal();
              }}
            >
              ✨ Full Perspective Gateway
            </button>
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
