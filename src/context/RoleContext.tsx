import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

interface RoleContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isRoleModalOpen: boolean;
  openRoleModal: () => void;
  closeRoleModal: () => void;
  selectRole: (newRole: UserRole) => void;
  // Admin Password Gate
  isAdminAuthenticated: boolean;
  isAdminAuthModalOpen: boolean;
  openAdminAuthModal: () => void;
  closeAdminAuthModal: () => void;
  authenticateAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: 'buyer',
  setRole: () => {},
  isRoleModalOpen: false,
  openRoleModal: () => {},
  closeRoleModal: () => {},
  selectRole: () => {},
  isAdminAuthenticated: false,
  isAdminAuthModalOpen: false,
  openAdminAuthModal: () => {},
  closeAdminAuthModal: () => {},
  authenticateAdmin: () => false,
  logoutAdmin: () => {},
});

export const useRole = () => useContext(RoleContext);

const ROLE_STORAGE_KEY = 'carbonly_active_role';
const ROLE_MODAL_SHOWN_KEY = 'carbonly_role_onboarding_completed';
const ADMIN_AUTH_KEY = 'carbonly_admin_authenticated';
export const ADMIN_CORRECT_PASSWORD = 'admin123';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY);
      if (stored === 'seller') return 'seller';
      if (stored === 'admin') {
        const isAuth = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
        return isAuth ? 'admin' : 'buyer';
      }
    } catch {
      // LocalStorage fallback
    }
    return 'buyer';
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(() => {
    try {
      const alreadyCompleted = localStorage.getItem(ROLE_MODAL_SHOWN_KEY);
      return !alreadyCompleted;
    } catch {
      return false;
    }
  });

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch {
      // ignore
    }
  };

  const selectRole = (newRole: UserRole) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setIsRoleModalOpen(false);
      setIsAdminAuthModalOpen(true);
      return;
    }
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_MODAL_SHOWN_KEY, 'true');
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    } catch {
      // ignore
    }
    setIsRoleModalOpen(false);
  };

  const authenticateAdmin = (password: string): boolean => {
    if (password === ADMIN_CORRECT_PASSWORD) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.setItem(ROLE_STORAGE_KEY, 'admin');
      } catch {
        // ignore
      }
      setRoleState('admin');
      setIsAdminAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // ignore
    }
    setRole('buyer');
  };

  const openAdminAuthModal = () => setIsAdminAuthModalOpen(true);
  const closeAdminAuthModal = () => setIsAdminAuthModalOpen(false);

  const openRoleModal = () => setIsRoleModalOpen(true);
  const closeRoleModal = () => {
    try {
      localStorage.setItem(ROLE_MODAL_SHOWN_KEY, 'true');
    } catch {
      // ignore
    }
    setIsRoleModalOpen(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
  }, [role]);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isRoleModalOpen,
        openRoleModal,
        closeRoleModal,
        selectRole,
        isAdminAuthenticated,
        isAdminAuthModalOpen,
        openAdminAuthModal,
        closeAdminAuthModal,
        authenticateAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
