import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole, ADMIN_CORRECT_PASSWORD } from '../../context/RoleContext';
import { useToast } from '../Toast/ToastContext';
import { ShieldCheck, Lock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './AdminAuthModal.css';

export const AdminAuthModal: React.FC = () => {
  const { isAdminAuthModalOpen, closeAdminAuthModal, authenticateAdmin } = useRole();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = authenticateAdmin(password);
    if (success) {
      setPassword('');
      showToast('Admin Authority unlocked successfully', 'success');
      navigate('/admin/dashboard');
    } else {
      setError('Access Denied: Incorrect password. Use admin123 to verify.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    closeAdminAuthModal();
  };

  return (
    <div className="admin-auth-overlay" onClick={handleClose}>
      <div
        className="admin-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-auth-modal__header">
          <div className="admin-auth-modal__icon-wrap">
            <ShieldCheck size={28} />
          </div>
          <span className="admin-auth-modal__badge">SECURE RESTRICTED ACCESS</span>
          <h2 id="admin-auth-title" className="admin-auth-modal__title">
            Admin Authority Access
          </h2>
          <p className="admin-auth-modal__desc">
            This portal controls seller KYC approvals, listing validations, and immutable transaction audit logs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-modal__form">
          <div className="admin-auth-field">
            <label htmlFor="admin-password-input" className="admin-auth-label">
              <Lock size={14} />
              <span>Admin Passcode</span>
            </label>
            <div className="admin-auth-input-wrapper">
              <KeyRound size={16} className="admin-auth-input-icon" />
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin password (admin123)"
                className="admin-auth-input"
                autoFocus
                required
              />
              <button
                type="button"
                className="admin-auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="admin-auth-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="admin-auth-hint">
              <span>Prototype Key: </span>
              <code>{ADMIN_CORRECT_PASSWORD}</code>
            </div>
          </div>

          <div className="admin-auth-actions">
            <button
              type="button"
              className="admin-auth-btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-auth-btn-submit"
            >
              Unlock Authority →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
