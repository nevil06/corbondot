import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatCard } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { LineChart, BarChart } from '../../components/Chart/Chart';
import { formatINR, formatCredits } from '../../utils/formatters';
import {
  Users,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sellerVerifications, listingApprovals } = useCarbonApp();

  const pendingSellers = sellerVerifications.filter((s) => s.status === 'Under Review').length;
  const pendingListings = listingApprovals.filter((l) => l.status === 'Under Review').length;

  const volumeChartData = [
    { label: 'May 24', value: 45000 },
    { label: 'Jun 24', value: 80000 },
    { label: 'Jul 24', value: 125000 },
    { label: 'Aug 24', value: 210000 },
    { label: 'Sep 24', value: 340000 },
    { label: 'Oct 24', value: 520000 }
  ];

  const registryDistribution = [
    { label: 'Verra VCS', value: 250000 },
    { label: 'Gold Standard', value: 180000 },
    { label: 'Puro.earth', value: 90000 }
  ];

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div>
          <div className="admin-title-row">
            <h1 className="admin-dashboard-title">Marketplace Governance & Compliance Desk</h1>
            <StatusPill status="Verified" size="sm" />
          </div>
          <p className="admin-dashboard-subtitle">
            System Integrity • Automated Registry Ledger Auditing & Anti-Fraud Oversight
          </p>
        </div>

        <div className="admin-actions">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/users-transactions')}
          >
            <Users size={16} /> Audit Logs
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/verification')}
          >
            Review Seller KYC ({pendingSellers})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpis-grid">
        <StatCard
          label="Pending Seller Verifications"
          value={`${pendingSellers} Pending`}
          subValue="KYC & GSTN verification"
          trend={{ value: 'Action required', isPositive: false }}
        />
        <StatCard
          label="Pending Listing Approvals"
          value={`${pendingListings} In Review`}
          subValue="Registry cross-check required"
          trend={{ value: 'Checklist audits ready', isPositive: true }}
        />
        <StatCard
          label="Platform Volume Liquidity"
          value={formatCredits(520000)}
          subValue="Zero double-counting violations"
        />
        <StatCard
          label="Monthly Settlement GMV"
          value={formatINR(84000000)}
          subValue="Across 38 corporate buyers"
          trend={{ value: '+34% MoM', isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <h2 className="admin-card-title">
            <Layers size={16} /> Platform Cumulative Transaction Velocity (Tonnes)
          </h2>
          <LineChart
            data={volumeChartData}
            title="FY24 Clearing Volume"
            height={200}
            valueSuffix=" t"
            accessibleDescription="Cumulative transaction volume growth."
          />
        </div>

        <div className="admin-chart-card">
          <h2 className="admin-card-title">
            <ShieldCheck size={16} /> Verified Volume by Standard
          </h2>
          <BarChart
            data={registryDistribution}
            title="Registry Standards Distribution"
            height={200}
          />
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="admin-action-panels-grid">
        {/* Seller Queue Card */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-card-title">Seller Verification Backlog</h3>
              <span className="panel-card-sub">{pendingSellers} dossiers requiring identity sign-off</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/verification')}
            >
              Open Queue <ArrowRight size={14} />
            </Button>
          </div>

          <div className="admin-queue-list">
            {sellerVerifications.map((s) => (
              <div key={s.id} className="queue-item">
                <div>
                  <span className="queue-id">{s.id}</span>
                  <strong className="queue-title">{s.companyName}</strong>
                  <span className="queue-meta">GSTN: {s.legalEntityId} • {s.registeredState}</span>
                </div>
                <div className="queue-action">
                  <span className={`risk-badge risk-${s.riskScore.toLowerCase()}`}>{s.riskScore} Risk</span>
                  <StatusPill status={s.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Approvals Card */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-card-title">Listing Review Backlog</h3>
              <span className="panel-card-sub">{pendingListings} methodology validations</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/listings')}
            >
              Checklist <ArrowRight size={14} />
            </Button>
          </div>

          <div className="admin-queue-list">
            {listingApprovals.map((l) => (
              <div key={l.id} className="queue-item">
                <div>
                  <span className="queue-id">{l.id}</span>
                  <strong className="queue-title">{l.projectName}</strong>
                  <span className="queue-meta">{l.registry} • {l.volume.toLocaleString('en-IN')} tonnes</span>
                </div>
                <div className="queue-action">
                  <StatusPill status={l.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
