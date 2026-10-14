import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { DonutChart } from '../../components/Chart/Chart';
import { formatINR } from '../../utils/formatters';
import {
  Wallet,
  Award,
  Flame,
  ArrowRight,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import './PortfolioScreen.css';

export const PortfolioScreen: React.FC = () => {
  const navigate = useNavigate();
  const { holdings, certificates, retireHolding } = useCarbonApp();

  // Summary Metrics
  const totalHeld = holdings.reduce((sum, h) => sum + h.creditsHeld, 0);
  const totalRetired = certificates.reduce((sum, c) => sum + c.creditsRetired, 0);
  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + h.creditsHeld * h.currentValue,
    0
  );

  // Retirement Modal State
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null);
  const [retireCreditsInput, setRetireCreditsInput] = useState<string>('1000');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('Acme Enterprise India Pvt Ltd');
  const [retirementReason, setRetirementReason] = useState<string>(
    'FY2023-24 Scope 1 & 2 Emissions Neutralization'
  );
  const [retireError, setRetireError] = useState<string>('');

  const targetHolding = holdings.find((h) => h.id === selectedHoldingId);

  const openRetireDialog = (holdingId: string) => {
    setSelectedHoldingId(holdingId);
    const holding = holdings.find((h) => h.id === holdingId);
    if (holding) {
      setRetireCreditsInput(Math.min(1000, holding.creditsHeld).toString());
    }
    setRetireError('');
  };

  const handleConfirmRetire = () => {
    if (!targetHolding) return;
    const count = parseInt(retireCreditsInput, 10) || 0;

    if (count <= 0) {
      setRetireError('Retirement volume must be greater than zero.');
      return;
    }
    if (count > targetHolding.creditsHeld) {
      setRetireError(
        `Cannot retire more than held volume (${targetHolding.creditsHeld.toLocaleString('en-IN')}).`
      );
      return;
    }
    if (!beneficiaryName.trim()) {
      setRetireError('Beneficiary entity name is required for cryptographic certificate issuance.');
      return;
    }

    const certId = retireHolding({
      holdingId: targetHolding.id,
      creditsToRetire: count,
      beneficiaryName,
      retirementReason
    });

    if (certId) {
      setSelectedHoldingId(null);
      navigate(`/certificate/${certId}`);
    }
  };

  // Donut chart distribution data
  const donutData = [
    { label: 'Verra ARR', value: 45, color: 'var(--color-forest-green)' },
    { label: 'Gold Standard Solar', value: 35, color: '#0284C7' },
    { label: 'Puro Biochar', value: 20, color: 'var(--color-deep-green)' }
  ];

  return (
    <div className="portfolio-page">
      {/* Page Header */}
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Carbon Portfolio & Holdings</h1>
          <p className="portfolio-subtitle">
            Manage your verified carbon assets, trigger permanent retirements, and download audit-ready compliance certificates.
          </p>
        </div>

        <div className="portfolio-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports')}
          >
            View ESG Reports <ArrowRight size={16} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/marketplace')}
          >
            Acquire More Credits
          </Button>
        </div>
      </div>

      {/* Top 3 Bold KPI Cards (Groww Style) */}
      <div className="portfolio-kpis-grid">
        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-label">Active Portfolio Volume</span>
            <Wallet size={18} className="kpi-icon" />
          </div>
          <div className="kpi-value">{totalHeld.toLocaleString('en-IN')}</div>
          <span className="kpi-sub">tonnes CO₂e held across {holdings.length} projects</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-label">Total Portfolio Spot Value</span>
            <span className="kpi-tag">Mark to Market</span>
          </div>
          <div className="kpi-value kpi-value--green">{formatINR(totalPortfolioValue)}</div>
          <span className="kpi-sub">based on current exchange indices</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__top">
            <span className="kpi-label">Total Credits Retired</span>
            <Flame size={18} className="kpi-icon kpi-icon--flame" />
          </div>
          <div className="kpi-value">{totalRetired.toLocaleString('en-IN')}</div>
          <span className="kpi-sub">{certificates.length} verified certificates issued</span>
        </div>
      </div>

      {/* Split Section: Table + Diversification Donut */}
      <div className="portfolio-layout">
        {/* Holdings Table */}
        <div className="portfolio-table-panel">
          <div className="panel-header">
            <h2 className="panel-title">Active Holding Accounts</h2>
            <span className="panel-count">{holdings.length} assets</span>
          </div>

          <div className="table-wrapper">
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th scope="col">Project Name</th>
                  <th scope="col">Registry</th>
                  <th scope="col">Vintage</th>
                  <th scope="col" className="text-right">Credits Held</th>
                  <th scope="col" className="text-right">Spot Value</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-table-cell">
                      No active holdings. Acquire credits from the Marketplace.
                    </td>
                  </tr>
                ) : (
                  holdings.map((h) => (
                    <tr key={h.id}>
                      <td className="project-cell">
                        <strong className="project-name-link" onClick={() => navigate(`/project/${h.projectId}`)}>
                          {h.projectName}
                        </strong>
                        <span className="project-sub-id">ID: {h.id}</span>
                      </td>
                      <td>
                        <span className="registry-chip">{h.registry} ({h.registryId})</span>
                      </td>
                      <td><strong>{h.vintage}</strong></td>
                      <td className="text-right font-numeric">
                        {h.creditsHeld.toLocaleString('en-IN')}
                      </td>
                      <td className="text-right font-numeric font-green">
                        {formatINR(h.creditsHeld * h.currentValue)}
                      </td>
                      <td>
                        <span className={`holding-badge holding-badge--${h.status.toLowerCase().replace(' ', '-')}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openRetireDialog(h.id)}
                        >
                          <Flame size={14} /> Retire
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Diversification Card */}
        <div className="portfolio-diversification-panel">
          <div className="diversification-card">
            <h3 className="diversification-title">Portfolio Allocation</h3>
            <DonutChart
              data={donutData}
              centerLabel="Active Volume"
              centerValue={`${(totalHeld / 1000).toFixed(0)}k t`}
            />
          </div>
        </div>
      </div>

      {/* Retirement Records Section */}
      <div className="certificates-section">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Executed Retirement Certificates</h2>
            <p className="panel-subtitle">
              Immutable retirement records with public serial ranges and verifiable transaction hashes.
            </p>
          </div>
        </div>

        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card">
              <div className="cert-card__top">
                <div className="cert-badge">
                  <Award size={16} /> Verified Permanent Retirement
                </div>
                <span className="cert-date">{cert.retirementDate}</span>
              </div>

              <h3 className="cert-title">{cert.projectName}</h3>
              <div className="cert-beneficiary">
                Beneficiary: <strong>{cert.beneficiaryName}</strong>
              </div>

              <div className="cert-stats">
                <div className="cert-stat-block">
                  <span className="stat-label">Retired Volume</span>
                  <strong className="stat-num">{cert.creditsRetired.toLocaleString('en-IN')} tCO₂e</strong>
                </div>
                <div className="cert-stat-block">
                  <span className="stat-label">Registry Serial</span>
                  <span className="stat-serial">{cert.serialNumberRange}</span>
                </div>
              </div>

              <div className="cert-actions">
                <Button
                  variant="outline"
                  size="sm"
                  className="cert-btn"
                  onClick={() => navigate(`/certificate/${cert.id}`)}
                >
                  <FileCheck2 size={16} /> View Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Retirement Confirmation Modal */}
      {selectedHoldingId && targetHolding && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedHoldingId(null)}
          title="Retire Carbon Credits"
          size="md"
        >
          <div className="retire-modal-content">
            <div className="retire-warning-banner" role="alert">
              <AlertTriangle size={20} className="warning-icon" />
              <div>
                <strong>Irreversible Action</strong>
                <p>
                  Retiring credits permanently removes them from circulation. They cannot be sold, transferred, or relisted once retired.
                </p>
              </div>
            </div>

            <div className="retire-project-summary">
              <div>
                <span className="retire-tag">{targetHolding.registry} • Vintage {targetHolding.vintage}</span>
                <h4 className="retire-title">{targetHolding.projectName}</h4>
              </div>
              <div className="retire-balance">
                <span className="balance-label">Available Balance</span>
                <strong>{targetHolding.creditsHeld.toLocaleString('en-IN')} credits</strong>
              </div>
            </div>

            {/* Volume Input */}
            <div className="modal-field">
              <label htmlFor="retire-qty" className="modal-label">
                Credits to Permanently Retire (Tonnes) *
              </label>
              <input
                id="retire-qty"
                type="number"
                min="1"
                max={targetHolding.creditsHeld}
                value={retireCreditsInput}
                onChange={(e) => setRetireCreditsInput(e.target.value)}
                className="modal-input"
                required
              />
            </div>

            {/* Beneficiary Name */}
            <div className="modal-field">
              <label htmlFor="beneficiary-name" className="modal-label">
                Beneficiary Corporate Legal Name *
              </label>
              <input
                id="beneficiary-name"
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="modal-input"
                required
              />
              <span className="modal-hint">Will appear on official certificate for ESG reporting audits.</span>
            </div>

            {/* Retirement Reason */}
            <div className="modal-field">
              <label htmlFor="retire-reason" className="modal-label">
                Retirement Reason / Purpose
              </label>
              <input
                id="retire-reason"
                type="text"
                value={retirementReason}
                onChange={(e) => setRetirementReason(e.target.value)}
                className="modal-input"
              />
            </div>

            {retireError && (
              <div className="modal-error" role="alert">
                {retireError}
              </div>
            )}

            <div className="modal-actions">
              <Button variant="outline" onClick={() => setSelectedHoldingId(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmRetire}>
                Confirm Permanent Retirement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
