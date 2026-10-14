import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { formatINR } from '../../utils/formatters';
import {
  ArrowLeft,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import './QuoteRequestScreen.css';

export const QuoteRequestScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, submitQuoteRequest } = useCarbonApp();

  // Find project or default to first
  const project = projects.find((p) => p.id === projectId) || projects[0];

  // Form State
  const [requestedCredits, setRequestedCredits] = useState<string>('5000');
  const [targetPrice, setTargetPrice] = useState<string>(project.pricePerCredit.toString());
  const [companyName, setCompanyName] = useState('Acme Sustainability India Pvt Ltd');
  const [contactEmail, setContactEmail] = useState('procurement@acme-india.mock');
  const [settlementWindow, setSettlementWindow] = useState('Immediate / Spot Escrow');
  const [notes, setNotes] = useState('Required for FY24 ESG Annual Reporting. Prefer Verra registry serial allocation within 5 business days.');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const numericCredits = parseInt(requestedCredits, 10) || 0;
  const numericPrice = parseFloat(targetPrice) || 0;
  const totalValue = numericCredits * numericPrice;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!numericCredits || numericCredits <= 0) {
      newErrors.credits = 'Credit volume must be greater than zero.';
    } else if (numericCredits > project.availableCredits) {
      newErrors.credits = `Requested volume exceeds project available limit (${project.availableCredits.toLocaleString('en-IN')}).`;
    }

    if (!numericPrice || numericPrice <= 0) {
      newErrors.price = 'Target price must be a valid positive amount.';
    }

    if (!companyName.trim()) {
      newErrors.company = 'Company name is required for institutional RFPs.';
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      newErrors.email = 'Please provide a valid corporate contact email.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitQuoteRequest({
      projectId: project.id,
      requestedCredits: numericCredits,
      targetPricePerCredit: numericPrice,
      notes
    });

    navigate('/quotes');
  };

  return (
    <div className="quote-request-page">
      {/* Back button */}
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(`/project/${project.id}`)}
      >
        <ArrowLeft size={16} /> Back to Project Overview
      </button>

      <div className="quote-request-header">
        <h1 className="quote-request-title">Request Enterprise Quote (RFP)</h1>
        <p className="quote-request-subtitle">
          Submit a structured request for proposal directly to verified project developers with Carbonly escrow settlement.
        </p>
      </div>

      <div className="quote-request-layout">
        {/* Left Form Panel */}
        <form className="rfp-form-card" onSubmit={handleSubmit} noValidate>
          {/* Target Project Summary Header */}
          <div className="rfp-project-summary">
            <div className="rfp-project-info">
              <span className="rfp-registry-pill">{project.registry} • {project.registryId}</span>
              <h2 className="rfp-project-name">{project.name}</h2>
              <span className="rfp-developer">Developer: {project.developer}</span>
            </div>
            <StatusPill status="Verified" size="sm" />
          </div>

          {/* Quantity Input */}
          <div className="rfp-field">
            <label htmlFor="credits-input" className="rfp-label">
              Requested Volume (Tonnes / Credits) *
            </label>
            <div className="rfp-input-wrapper">
              <input
                id="credits-input"
                type="number"
                min="100"
                max={project.availableCredits}
                step="500"
                className={`rfp-input ${errors.credits ? 'has-error' : ''}`}
                value={requestedCredits}
                onChange={(e) => setRequestedCredits(e.target.value)}
                aria-describedby={errors.credits ? 'credits-error' : 'credits-help'}
                required
              />
              <span className="rfp-input-suffix">Credits</span>
            </div>
            {errors.credits ? (
              <p id="credits-error" className="rfp-error" role="alert">
                <AlertCircle size={14} /> {errors.credits}
              </p>
            ) : (
              <p id="credits-help" className="rfp-help">
                Available liquidity in this batch: {project.availableCredits.toLocaleString('en-IN')} tonnes.
              </p>
            )}
          </div>

          {/* Target Price */}
          <div className="rfp-field">
            <label htmlFor="price-input" className="rfp-label">
              Target Price per Credit (INR) *
            </label>
            <div className="rfp-input-wrapper">
              <span className="rfp-input-prefix">₹</span>
              <input
                id="price-input"
                type="number"
                min="100"
                step="10"
                className={`rfp-input has-prefix ${errors.price ? 'has-error' : ''}`}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                aria-describedby={errors.price ? 'price-error' : 'price-help'}
                required
              />
            </div>
            {errors.price ? (
              <p id="price-error" className="rfp-error" role="alert">
                <AlertCircle size={14} /> {errors.price}
              </p>
            ) : (
              <p id="price-help" className="rfp-help">
                Current spot index: {formatINR(project.pricePerCredit)} / credit.
              </p>
            )}
          </div>

          {/* Company Name */}
          <div className="rfp-field">
            <label htmlFor="company-input" className="rfp-label">
              Procuring Entity / Corporate Legal Name *
            </label>
            <input
              id="company-input"
              type="text"
              className={`rfp-input ${errors.company ? 'has-error' : ''}`}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              aria-describedby={errors.company ? 'company-error' : undefined}
              required
            />
            {errors.company && (
              <p id="company-error" className="rfp-error" role="alert">
                <AlertCircle size={14} /> {errors.company}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div className="rfp-field">
            <label htmlFor="email-input" className="rfp-label">
              Corporate Email for Contracting *
            </label>
            <input
              id="email-input"
              type="email"
              className={`rfp-input ${errors.email ? 'has-error' : ''}`}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="rfp-error" role="alert">
                <AlertCircle size={14} /> {errors.email}
              </p>
            )}
          </div>

          {/* Settlement Window */}
          <div className="rfp-field">
            <label htmlFor="settlement-select" className="rfp-label">
              Preferred Settlement & Delivery Schedule
            </label>
            <select
              id="settlement-select"
              className="rfp-select"
              value={settlementWindow}
              onChange={(e) => setSettlementWindow(e.target.value)}
            >
              <option value="Immediate / Spot Escrow">Immediate / Spot Escrow (3–5 Days)</option>
              <option value="30-Day Forward Contract">30-Day Forward Contract</option>
              <option value="Quarterly Delivery Mandate">Quarterly Delivery Mandate (FY24 Q4)</option>
            </select>
          </div>

          {/* ESG Notes */}
          <div className="rfp-field">
            <label htmlFor="notes-input" className="rfp-label">
              Audit Notes & Registry Instructions
            </label>
            <textarea
              id="notes-input"
              rows={3}
              className="rfp-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State any specific corporate registry account or serial numbering requirements..."
            />
          </div>

          <div className="rfp-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Submit Request for Quote
            </Button>
          </div>
        </form>

        {/* Right Summary Calculation Panel */}
        <div className="rfp-summary-panel">
          <div className="summary-card">
            <h3 className="summary-title">Quote Calculation Preview</h3>

            <div className="summary-metric-block">
              <span className="summary-metric-label">Estimated Total Value</span>
              <div className="summary-metric-number">
                {formatINR(totalValue)}
              </div>
              <span className="summary-metric-sub">
                ({numericCredits.toLocaleString('en-IN')} tonnes × {formatINR(numericPrice)})
              </span>
            </div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Unit Price Target</span>
                <strong>{formatINR(numericPrice)}</strong>
              </div>
              <div className="summary-row">
                <span>Volume</span>
                <strong>{numericCredits.toLocaleString('en-IN')} credits</strong>
              </div>
              <div className="summary-row">
                <span>Registry</span>
                <strong>{project.registry} ({project.vintage})</strong>
              </div>
              <div className="summary-row">
                <span>Escrow Fee</span>
                <strong className="positive-text">₹0.00 (Included)</strong>
              </div>
            </div>

            <div className="summary-guarantee">
              <ShieldCheck size={18} className="guarantee-icon" />
              <div>
                <strong>Zero Pre-payment Guarantee</strong>
                <p>Funds remain held in simulated escrow until official registry serial numbers are audited and verified.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
