import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';
import './RetirementCertificateScreen.css';

export const RetirementCertificateScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { certificates } = useCarbonApp();

  const cert = certificates.find((c) => c.id === id) || certificates[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-page">
      {/* Top Controls (Not in print) */}
      <div className="certificate-nav-bar no-print">
        <button
          type="button"
          className="cert-back-btn"
          onClick={() => navigate('/portfolio')}
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </button>

        <div className="cert-actions-group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports')}
          >
            Go to ESG Reports
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
          >
            <Printer size={16} /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="certificate-paper" role="region" aria-label="Official Retirement Certificate">
        {/* Certificate Outer Border Frame */}
        <div className="certificate-inner-frame">
          {/* Header Watermark & Brand */}
          <header className="cert-official-header">
            <div className="cert-brand-stamp">
              <Award size={36} className="cert-stamp-icon" />
              <div className="cert-brand-text">
                <span className="brand-name">CARBONLY</span>
                <span className="brand-sub">HIGH-INTEGRITY VOLUNTARY CARBON REGISTRY</span>
              </div>
            </div>

            <div className="cert-official-badge">
              <ShieldCheck size={18} />
              <span>OFFICIAL RETIREMENT RECEIPT</span>
            </div>
          </header>

          {/* Certificate Title */}
          <div className="cert-title-block">
            <h1 className="cert-main-heading">Certificate of Carbon Credit Retirement</h1>
            <p className="cert-sub-statement">
              This cryptographic registry document certifies that the carbon offsets detailed below have been permanently retired from circulation on behalf of the named beneficiary entity.
            </p>
          </div>

          {/* Big Number Volume Retired Banner */}
          <div className="cert-volume-banner">
            <span className="volume-banner-label">TOTAL VOLUME PERMANENTLY RETIRED</span>
            <div className="volume-banner-value">
              {cert.creditsRetired.toLocaleString('en-IN')}
              <span className="volume-unit"> TONNES CO₂e</span>
            </div>
            <span className="volume-sub">1 Credit = 1 Metric Tonne of Carbon Dioxide Equivalent sequestered</span>
          </div>

          {/* Core Beneficiary & Purpose Section */}
          <div className="cert-details-grid">
            <div className="detail-field">
              <span className="field-label">Beneficiary Legal Entity</span>
              <div className="field-value-strong">{cert.beneficiaryName}</div>
            </div>

            <div className="detail-field">
              <span className="field-label">Retirement Purpose / Claim</span>
              <div className="field-value">{cert.retirementReason}</div>
            </div>

            <div className="detail-field">
              <span className="field-label">Project Name & Developer</span>
              <div className="field-value-strong">{cert.projectName}</div>
              <span className="field-sub">Proponent: {cert.developer}</span>
            </div>

            <div className="detail-field">
              <span className="field-label">Registry Standard & ID</span>
              <div className="field-value">{cert.registry} ({cert.registryId})</div>
              <span className="field-sub">Vintage: {cert.vintage}</span>
            </div>

            <div className="detail-field">
              <span className="field-label">Certificate Serial Number</span>
              <div className="field-mono">{cert.certificateNumber}</div>
            </div>

            <div className="detail-field">
              <span className="field-label">Date of Official Retirement</span>
              <div className="field-value">{cert.retirementDate}</div>
            </div>
          </div>

          {/* Serial Number Block */}
          <div className="cert-serial-block">
            <span className="serial-title">Audited Registry Serial Range</span>
            <code className="serial-range-code">{cert.serialNumberRange}</code>
          </div>

          {/* Cryptographic Ledger Proof Section */}
          <footer className="cert-proof-footer">
            <div className="qr-sim-box" aria-hidden="true">
              <div className="qr-grid">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className={`qr-dot ${i % 3 === 0 || i % 7 === 0 ? 'dark' : ''}`} />
                ))}
              </div>
              <span className="qr-caption">Scan to Verify</span>
            </div>

            <div className="tx-proof-box">
              <div className="tx-header">
                <Lock size={14} /> Immutable Ledger Proof (Escrow Hash)
              </div>
              <code className="tx-hash-code">{cert.blockchainTxHash}</code>
              <div className="tx-status">
                <CheckCircle2 size={14} className="green-icon" /> Verified against registry issuance ledger
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
