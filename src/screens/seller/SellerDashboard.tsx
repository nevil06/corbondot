import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatCard } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { formatINR, formatCredits } from '../../utils/formatters';
import {
  Plus,
  ArrowRight
} from 'lucide-react';
import './SellerDashboard.css';

export const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, inquiries } = useCarbonApp();

  const totalAvailable = inventory.reduce((sum, item) => sum + item.available, 0);
  const totalSold = inventory.reduce((sum, item) => sum + item.sold, 0);
  const totalRevenue = totalSold * 1150;
  const pendingInquiries = inquiries.filter((inq) => inq.status === 'Pending').length;

  return (
    <div className="seller-dashboard-page">
      {/* Header */}
      <div className="seller-dashboard-header">
        <div>
          <div className="seller-title-row">
            <h1 className="seller-dashboard-title">Seller Operations Portal</h1>
            <StatusPill status="Verified" size="sm" />
          </div>
          <p className="seller-dashboard-subtitle">
            Project Proponent & Originator • Vanya Climate Foundation (Odisha & Karnataka)
          </p>
        </div>

        <div className="seller-dashboard-actions">
          <Button
            variant="outline"
            onClick={() => navigate('/seller/onboarding')}
          >
            KYC Onboarding
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/seller/projects/new')}
          >
            <Plus size={16} /> Register New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="seller-kpis-grid">
        <StatCard
          label="Active Available Inventory"
          value={formatCredits(totalAvailable)}
          subValue="Tonnes CO₂e listed on exchange"
          trend={{ value: '+14% issued this month', isPositive: true }}
        />
        <StatCard
          label="Total Realized Revenue"
          value={formatINR(totalRevenue)}
          subValue={`${formatCredits(totalSold)} credits delivered`}
          trend={{ value: 'Escrow settled', isPositive: true }}
        />
        <StatCard
          label="Open Buyer Inquiries"
          value={`${pendingInquiries} Pending`}
          subValue="Bilateral enterprise RFPs"
          trend={{ value: 'Requires response', isPositive: false }}
        />
        <StatCard
          label="Registry Validation"
          value="Verra & Gold Std"
          subValue="100% issuance compliance"
        />
      </div>

      {/* Grid: Recent Inquiries + Inventory Quick Table */}
      <div className="seller-portal-layout">
        {/* Buyer Inquiries Box */}
        <div className="seller-portal-card">
          <div className="seller-card-header">
            <div>
              <h2 className="seller-card-title">Recent Buyer Inquiries & RFPs</h2>
              <span className="seller-card-sub">{pendingInquiries} awaiting quotation</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/seller/inquiries')}
            >
              View All Inquiries <ArrowRight size={14} />
            </Button>
          </div>

          <div className="inquiry-list">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="inquiry-summary-item">
                <div className="inquiry-left">
                  <span className="inquiry-badge">{inq.id}</span>
                  <strong className="inquiry-buyer">{inq.buyerCompany}</strong>
                  <span className="inquiry-project">{inq.projectName}</span>
                  <span className="inquiry-req">
                    Requested: {inq.volumeRequested.toLocaleString('en-IN')} t @ {formatINR(inq.targetPrice)}
                  </span>
                </div>
                <div className="inquiry-right">
                  <StatusPill status={inq.status} size="sm" />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/seller/inquiries')}
                  >
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Quick Status */}
        <div className="seller-portal-card">
          <div className="seller-card-header">
            <div>
              <h2 className="seller-card-title">Credit Inventory Allocation</h2>
              <span className="seller-card-sub">{inventory.length} active batches</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/seller/inventory')}
            >
              Manage Inventory <ArrowRight size={14} />
            </Button>
          </div>

          <div className="inventory-summary-list">
            {inventory.map((item) => (
              <div key={item.id} className="inv-summary-row">
                <div className="inv-meta">
                  <span className="inv-batch">{item.batchNumber}</span>
                  <strong className="inv-name">{item.projectName}</strong>
                  <span className="inv-vintage">Vintage {item.vintage} • {item.registry}</span>
                </div>
                <div className="inv-stats">
                  <div className="inv-stat-block">
                    <span className="inv-stat-lbl">Available</span>
                    <strong className="inv-stat-num green">{item.available.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="inv-stat-block">
                    <span className="inv-stat-lbl">Sold</span>
                    <strong className="inv-stat-num">{item.sold.toLocaleString('en-IN')}</strong>
                  </div>
                  <StatusPill status={item.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
