import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { formatINR } from '../../utils/formatters';
import {
  Package,
  Search,
  Plus,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './InventoryScreen.css';

export const InventoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { inventory } = useCarbonApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewState, setViewState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const filteredInventory = useMemo(() => {
    if (viewState === 'empty') return [];

    return inventory.filter((item) => {
      const matchesSearch =
        item.projectName.toLowerCase().includes(search.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.registry.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, selectedStatus, viewState]);

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1 className="inventory-title">Carbon Credit Inventory Desk</h1>
          <p className="inventory-subtitle">
            Audited batch inventory ledger, registry issuance accounts, and multi-channel allocation controls.
          </p>
        </div>

        <div className="inventory-actions">
          {/* Table State Switcher (Required for Prototype) */}
          <div className="inventory-state-switcher">
            <span className="state-lbl">State:</span>
            <button
              type="button"
              className={`state-btn ${viewState === 'normal' ? 'active' : ''}`}
              onClick={() => setViewState('normal')}
            >
              Normal
            </button>
            <button
              type="button"
              className={`state-btn ${viewState === 'loading' ? 'active' : ''}`}
              onClick={() => setViewState('loading')}
            >
              Skeleton
            </button>
            <button
              type="button"
              className={`state-btn ${viewState === 'empty' ? 'active' : ''}`}
              onClick={() => setViewState('empty')}
            >
              Empty
            </button>
            <button
              type="button"
              className={`state-btn ${viewState === 'error' ? 'active' : ''}`}
              onClick={() => setViewState('error')}
            >
              Error
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/seller/projects/new')}
          >
            <Plus size={16} /> New Batch Listing
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="inventory-toolbar">
        <div className="inventory-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by project name, batch #, or registry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-tabs" role="tablist">
          {['All', 'Listed', 'Under Review', 'Sold', 'Draft'].map((st) => (
            <button
              key={st}
              role="tab"
              aria-selected={selectedStatus === st}
              className={`status-tab-btn ${selectedStatus === st ? 'active' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="inventory-table-card">
        {viewState === 'error' && (
          <div className="inv-state-panel error">
            <AlertCircle size={36} className="error-icon" />
            <h3>Unable to fetch inventory balances</h3>
            <p>Simulated local connection error with the registry ledger.</p>
            <Button variant="primary" size="sm" onClick={() => setViewState('normal')}>
              <RefreshCw size={14} /> Retry Inventory
            </Button>
          </div>
        )}

        {viewState === 'loading' && (
          <div className="skeleton-table">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-row">
                <div className="skeleton-cell w-25" />
                <div className="skeleton-cell w-15" />
                <div className="skeleton-cell w-10" />
                <div className="skeleton-cell w-15" />
                <div className="skeleton-cell w-10" />
                <div className="skeleton-cell w-10" />
              </div>
            ))}
          </div>
        )}

        {viewState === 'normal' && filteredInventory.length === 0 && (
          <div className="inv-state-panel empty">
            <Package size={36} className="empty-icon" />
            <h3>No inventory records found</h3>
            <p>No batches match the applied filter parameters.</p>
          </div>
        )}

        {viewState === 'normal' && filteredInventory.length > 0 && (
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th scope="col">Batch Reference</th>
                  <th scope="col">Project Name</th>
                  <th scope="col">Registry</th>
                  <th scope="col">Vintage</th>
                  <th scope="col" className="text-right">Issued</th>
                  <th scope="col" className="text-right">Available</th>
                  <th scope="col" className="text-right">Allocated</th>
                  <th scope="col" className="text-right">Sold</th>
                  <th scope="col" className="text-right">Base Price</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code className="batch-code">{item.batchNumber}</code>
                    </td>
                    <td>
                      <strong className="project-title">{item.projectName}</strong>
                    </td>
                    <td>{item.registry}</td>
                    <td>{item.vintage}</td>
                    <td className="text-right">{item.totalIssued.toLocaleString('en-IN')}</td>
                    <td className="text-right font-bold green">
                      {item.available.toLocaleString('en-IN')}
                    </td>
                    <td className="text-right">{item.allocated.toLocaleString('en-IN')}</td>
                    <td className="text-right">{item.sold.toLocaleString('en-IN')}</td>
                    <td className="text-right font-bold">{formatINR(item.basePrice)}</td>
                    <td>
                      <StatusPill status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
