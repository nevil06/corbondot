import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatCard } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { formatINR, formatCredits } from '../../utils/formatters';
import {
  ArrowRight,
  ShoppingBag,
  Wallet,
  Sparkles
} from 'lucide-react';
import './BuyerDashboard.css';

export const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, holdings, certificates, quotes, shortlist } = useCarbonApp();

  const totalHeld = holdings.reduce((sum, h) => sum + h.creditsHeld, 0);
  const totalRetired = certificates.reduce((sum, c) => sum + c.creditsRetired, 0);
  const totalValuation = holdings.reduce((sum, h) => sum + h.creditsHeld * h.currentValue, 0);
  const pendingQuotes = quotes.filter((q) => q.status === 'Pending' || q.status === 'Responded').length;

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="buyer-dashboard-page">
      {/* Top Welcome Bar */}
      <div className="dashboard-welcome-bar">
        <div>
          <div className="welcome-tag-row">
            <h1 className="dashboard-heading">Buyer Overview</h1>
            <StatusPill status="Verified" size="sm" />
          </div>
          <p className="dashboard-sub-heading">
            Corporate ESG Carbon Portfolio • Tata Steel Sustainability Mandate
          </p>
        </div>

        <div className="dashboard-actions">
          <Button variant="outline" onClick={() => navigate('/portfolio')}>
            <Wallet size={16} /> My Portfolio
          </Button>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            <ShoppingBag size={16} /> Explore Marketplace
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="dashboard-kpis-grid">
        <StatCard
          label="Active Portfolio Volume"
          value={formatCredits(totalHeld)}
          subValue="Tonnes CO₂e held"
          trend={{ value: '+8.4% this quarter', isPositive: true }}
        />
        <StatCard
          label="Total Retired Offsets"
          value={formatCredits(totalRetired)}
          subValue={`${certificates.length} verifiable certificates`}
          trend={{ value: 'Audit complete', isPositive: true }}
        />
        <StatCard
          label="Portfolio Valuation"
          value={formatINR(totalValuation)}
          subValue="Mark-to-market index"
        />
        <StatCard
          label="Active Quotes & RFPs"
          value={`${pendingQuotes} Active`}
          subValue={`${quotes.length} total RFPs logged`}
          trend={{ value: 'Real-time quotes', isPositive: true }}
        />
      </div>

      {/* Primary Flow Quick Banner */}
      <div className="flow-walkthrough-card">
        <div className="flow-card-left">
          <div className="flow-badge">
            <Sparkles size={14} /> End-to-End Primary Clickable Flow
          </div>
          <h2 className="flow-title">Ready to Procure & Retire Carbon Credits?</h2>
          <p className="flow-desc">
            Experience the complete seamless buyer lifecycle: browse verified Indian carbon projects in Marketplace, compare neutral side-by-side matrices, request bilateral quotes, accept offers into your Portfolio, and execute cryptographic retirements with downloadable certificates.
          </p>
        </div>
        <div className="flow-card-right">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/marketplace')}
          >
            Start Flow at Marketplace <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Featured Projects Spotlight Grid */}
      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Verified High-Permanence Projects</h2>
            <p className="section-desc">Audited nature-based & engineered carbon removal credits from India.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/marketplace')}>
            View All ({projects.length}) <ArrowRight size={14} />
          </Button>
        </div>

        <div className="featured-grid">
          {featuredProjects.map((p) => (
            <div key={p.id} className="featured-card">
              <div className="featured-card-top">
                <span className="featured-reg-badge">{p.registry} ({p.registryId})</span>
                <span className="featured-type-badge">{p.type}</span>
              </div>
              <h3 className="featured-card-title">{p.name}</h3>
              <p className="featured-card-location">{p.location}, {p.state}</p>

              <div className="featured-card-pricing">
                <div>
                  <span className="price-label">Price / Unit</span>
                  <div className="price-val">{formatINR(p.pricePerCredit)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="price-label">Available</span>
                  <div className="volume-val">{p.availableCredits.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="featured-card-actions">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/project/${p.id}`)}
                >
                  View Details & Quote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links & Shortlist Reminder */}
      {shortlist.length > 0 && (
        <div className="dashboard-shortlist-reminder">
          <div>
            <strong>You have {shortlist.length} project(s) ready to compare</strong>
            <p>Review side-by-side technical parameters without automated ranking bias.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/compare')}>
            Open Comparison Matrix
          </Button>
        </div>
      )}
    </div>
  );
};
