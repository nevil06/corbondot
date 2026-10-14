import React, { useState, useMemo } from 'react';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_TRANSACTIONS
} from '../../data/mockData';
import { formatINR } from '../../utils/formatters';
import {
  Users,
  Receipt,
  Search
} from 'lucide-react';
import './UsersTransactionsScreen.css';

export const UsersTransactionsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Users
  const filteredUsers = useMemo(() => {
    return INITIAL_ADMIN_USERS.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    return INITIAL_ADMIN_TRANSACTIONS.filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.txHash.toLowerCase().includes(q) ||
        t.buyerName.toLowerCase().includes(q) ||
        t.sellerName.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div className="users-tx-page">
      <div className="users-tx-header">
        <div>
          <h1 className="users-tx-title">Users & Transaction Audit Registry</h1>
          <p className="users-tx-subtitle">
            Immutable settlement audit trail and account governance across all participating market entities.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-pill-switcher" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'users'}
            className={`tab-pill-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              setSearchQuery('');
              setCurrentPage(1);
            }}
          >
            <Users size={16} /> Market Participants ({filteredUsers.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'transactions'}
            className={`tab-pill-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('transactions');
              setSearchQuery('');
              setCurrentPage(1);
            }}
          >
            <Receipt size={16} /> Transaction Audit Trail ({filteredTransactions.length})
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="users-tx-toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={
              activeTab === 'users'
                ? 'Search users by name, company, email, or role...'
                : 'Search transactions by txHash, entity, or project...'
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="users-tx-table-card">
        {activeTab === 'users' && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Contact Name</th>
                  <th scope="col">Entity / Organization</th>
                  <th scope="col">Role Persona</th>
                  <th scope="col">Corporate Email</th>
                  <th scope="col" className="text-right">Total Transacted</th>
                  <th scope="col">Joined Date</th>
                  <th scope="col">KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-cell">No users found matching query.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <code className="user-id">{user.id}</code>
                      </td>
                      <td>
                        <strong className="user-name">{user.name}</strong>
                      </td>
                      <td>{user.company}</td>
                      <td>
                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.email}</td>
                      <td className="text-right font-bold">
                        {user.totalVolume.toLocaleString('en-IN')} tonnes
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <StatusPill status={user.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Escrow Tx Hash</th>
                  <th scope="col">Buyer Entity</th>
                  <th scope="col">Seller / Proponent</th>
                  <th scope="col">Project Origin</th>
                  <th scope="col" className="text-right">Volume</th>
                  <th scope="col" className="text-right">Gross Settlement</th>
                  <th scope="col">Date Executed</th>
                  <th scope="col">Settlement Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty-cell">No transactions found matching query.</td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <code className="tx-id">{tx.id}</code>
                      </td>
                      <td>
                        <code className="tx-hash">{tx.txHash}</code>
                      </td>
                      <td>
                        <strong>{tx.buyerName}</strong>
                      </td>
                      <td>{tx.sellerName}</td>
                      <td>{tx.projectName}</td>
                      <td className="text-right font-bold">
                        {tx.credits.toLocaleString('en-IN')} t
                      </td>
                      <td className="text-right font-bold green">
                        {formatINR(tx.amount)}
                      </td>
                      <td>{tx.date}</td>
                      <td>
                        <StatusPill status={tx.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="table-pagination-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--color-slate-50)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing Page {currentPage} of 1 • Local In-Memory Registry
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--color-white)', cursor: 'pointer' }}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={true}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'var(--color-white)', cursor: 'pointer', opacity: 0.5 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
