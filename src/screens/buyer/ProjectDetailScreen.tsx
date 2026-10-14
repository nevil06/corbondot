import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Stepper } from '../../components/Stepper/Stepper';
import { Button } from '../../components/Button/Button';
import { LineChart } from '../../components/Chart/Chart';
import { formatINR } from '../../utils/formatters';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Scale,
  Check,
  FileText,
  Download
} from 'lucide-react';
import './ProjectDetailScreen.css';

export const ProjectDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, toggleShortlist, isInShortlist } = useCarbonApp();

  const project = projects.find((p) => p.id === id) || projects[0];
  const inShortlist = isInShortlist(project.id);

  const lifecycleSteps = [
    { label: 'Feasibility', description: 'Methodology baseline' },
    { label: 'Validation', description: 'Third-party audit' },
    { label: 'Verification', description: 'Registry audit' },
    { label: 'Issuance', description: 'Credits active' }
  ];

  const chartData = project.priceHistory.map((h) => ({
    label: h.month,
    value: h.price
  }));

  const documents = [
    { name: 'Project_Design_Document_PDD.pdf', size: '4.8 MB', date: '12 Jan 2023', verified: true },
    { name: 'Validation_Report_TUV_SUD.pdf', size: '2.1 MB', date: '04 Mar 2023', verified: true },
    { name: 'Registry_Serial_Issuance_Confirmation.pdf', size: '1.4 MB', date: '18 Aug 2023', verified: true },
    { name: 'Community_Consent_Free_Prior_Informed.pdf', size: '3.6 MB', date: '22 Oct 2023', verified: true }
  ];

  return (
    <div className="project-detail-page">
      {/* Back button & Breadcrumb */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="breadcrumb-back-btn"
          onClick={() => navigate('/marketplace')}
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{project.name}</span>
      </nav>

      {/* Hero Header */}
      <header className="detail-hero">
        <div className="hero-main">
          <div className="hero-tags">
            <span className="detail-registry-tag">{project.registry} • {project.registryId}</span>
            <span className={`detail-type-tag detail-type-tag--${project.type.toLowerCase()}`}>
              {project.type}
            </span>
            <span className="detail-category-tag">{project.category}</span>
            <StatusPill status={project.verificationStatus} size="sm" />
          </div>

          <h1 className="hero-title">{project.name}</h1>

          <div className="hero-meta">
            <span className="hero-meta-item">
              <MapPin size={15} aria-hidden="true" />
              {project.location}, {project.state}, {project.country}
            </span>
            <span className="meta-dot">•</span>
            <span className="hero-meta-item">Developer: <strong>{project.developer}</strong></span>
            <span className="meta-dot">•</span>
            <span className="hero-meta-item">Vintage {project.vintage}</span>
          </div>
        </div>

        {/* Hero Price & Fast Action Card */}
        <div className="hero-pricing-card">
          <div className="hero-pricing-row">
            <div className="hero-price-block">
              <span className="hero-price-label">Spot Price</span>
              <div className="hero-price-val">
                {formatINR(project.pricePerCredit)}
                <span className="hero-price-unit"> / credit</span>
              </div>
            </div>
            <div className="hero-volume-block">
              <span className="hero-volume-label">Available Liquidity</span>
              <div className="hero-volume-val">{project.availableCredits.toLocaleString('en-IN')}</div>
              <span className="hero-volume-unit">credits ready for transfer</span>
            </div>
          </div>

          <div className="hero-pricing-actions">
            <Button
              variant="primary"
              size="md"
              className="hero-rfp-btn"
              onClick={() => navigate(`/quotes/request/${project.id}`)}
            >
              Request Enterprise Quote
            </Button>
            <Button
              variant={inShortlist ? 'secondary' : 'outline'}
              size="md"
              onClick={() => toggleShortlist(project.id)}
            >
              {inShortlist ? (
                <>
                  <Check size={16} /> In Compare Shortlist
                </>
              ) : (
                <>
                  <Scale size={16} /> Add to Compare
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Grid: Details Left, Stats/Chart Right */}
      <div className="detail-layout">
        <div className="detail-primary-col">
          {/* Section: Project Lifecycle Stepper */}
          <section className="detail-section" aria-labelledby="lifecycle-heading">
            <h2 id="lifecycle-heading" className="section-title">
              Verification Lifecycle
            </h2>
            <div className="lifecycle-card">
              <Stepper
                steps={lifecycleSteps}
                currentStep={project.lifecycleStage - 1}
              />
              <div className="lifecycle-note">
                <ShieldCheck size={16} className="note-icon" />
                <span>
                  All credits in this batch have passed final <strong>Verification and Issuance</strong> on the official {project.registry} registry ledger.
                </span>
              </div>
            </div>
          </section>

          {/* Section: Project Description & Narrative */}
          <section className="detail-section" aria-labelledby="narrative-heading">
            <h2 id="narrative-heading" className="section-title">
              Project Description & Climate Impact
            </h2>
            <div className="narrative-card">
              <p className="narrative-p">{project.description}</p>
              
              <h3 className="sub-heading">Methodology & Standard Integrity</h3>
              <p className="narrative-p">
                Governed under <strong>{project.methodology}</strong>. Baseline and additionality modeling ensure strict carbon accounting principles, audited against permanence safeguards for long-term sequestration.
              </p>

              {/* UN SDGs Co-benefits */}
              <h3 className="sub-heading">UN Sustainable Development Goals (SDGs)</h3>
              <div className="sdg-badges-row">
                {project.coBenefitsSDGs.map((sdg) => (
                  <div key={sdg} className="sdg-badge">
                    <span className="sdg-badge-num">SDG {sdg}</span>
                    <span className="sdg-badge-label">
                      {sdg === 1 && 'No Poverty'}
                      {sdg === 3 && 'Good Health'}
                      {sdg === 6 && 'Clean Water'}
                      {sdg === 7 && 'Affordable Energy'}
                      {sdg === 8 && 'Decent Work'}
                      {sdg === 9 && 'Industry & Innovation'}
                      {sdg === 12 && 'Responsible Consumption'}
                      {sdg === 13 && 'Climate Action'}
                      {sdg === 14 && 'Life Below Water'}
                      {sdg === 15 && 'Life on Land'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Documentation & Audit Reports */}
          <section className="detail-section" aria-labelledby="docs-heading">
            <h2 id="docs-heading" className="section-title">
              Audited Documentation & Registry Filings
            </h2>
            <div className="documents-card">
              <ul className="docs-list">
                {documents.map((doc, idx) => (
                  <li key={idx} className="doc-item">
                    <div className="doc-item__left">
                      <FileText size={20} className="doc-icon" aria-hidden="true" />
                      <div>
                        <div className="doc-name">{doc.name}</div>
                        <div className="doc-meta">{doc.size} • Verified {doc.date}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="doc-download-btn"
                      onClick={() => alert(`Simulated document preview for: ${doc.name}`)}
                      aria-label={`Download ${doc.name}`}
                    >
                      <Download size={16} /> Download
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar Column: Price History Chart & Key Stats */}
        <div className="detail-sidebar-col">
          {/* Price History Trend Chart */}
          <div className="sidebar-card chart-sidebar-card">
            <h2 className="sidebar-card__title">Historical Spot Price (INR)</h2>
            <LineChart
              data={chartData}
              title="6-Month Spot Value Trend"
              height={190}
              valuePrefix="₹"
              valueSuffix=""
            />
            <div className="chart-stats-footer">
              <div className="stat-pill">
                <span className="stat-pill-label">30D Change</span>
                <span className="stat-pill-val positive">+3.8%</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Lifetime High</span>
                <span className="stat-pill-val">{formatINR(project.pricePerCredit)}</span>
              </div>
            </div>
          </div>

          {/* Institutional Compliance Checklist */}
          <div className="sidebar-card compliance-card">
            <h2 className="sidebar-card__title">Compliance & Integrity Metrics</h2>
            <dl className="compliance-list">
              <div className="compliance-row">
                <dt className="compliance-dt">Registry ID</dt>
                <dd className="compliance-dd">{project.registryId}</dd>
              </div>
              <div className="compliance-row">
                <dt className="compliance-dt">Additionality Score</dt>
                <dd className="compliance-dd compliance-dd--positive">{project.additionalityScore}</dd>
              </div>
              <div className="compliance-row">
                <dt className="compliance-dt">Permanence Risk</dt>
                <dd className="compliance-dd">{project.permanenceRisk} Risk</dd>
              </div>
              <div className="compliance-row">
                <dt className="compliance-dt">Quality Rating</dt>
                <dd className="compliance-dd">★ {project.rating} / 5.0</dd>
              </div>
              <div className="compliance-row">
                <dt className="compliance-dt">Total Issued Volume</dt>
                <dd className="compliance-dd">{project.totalVolume.toLocaleString('en-IN')} tonnes</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile & Desktop Convenience */}
      <aside className="sticky-action-bar" role="region" aria-label="Quick action bar">
        <div className="sticky-action-bar__container">
          <div className="sticky-action-info">
            <div className="sticky-project-name">{project.name}</div>
            <div className="sticky-price-display">
              <strong>{formatINR(project.pricePerCredit)}</strong> / credit • {project.availableCredits.toLocaleString('en-IN')} available
            </div>
          </div>
          <div className="sticky-action-btns">
            <Button
              variant={inShortlist ? 'secondary' : 'outline'}
              size="md"
              onClick={() => toggleShortlist(project.id)}
            >
              {inShortlist ? <Check size={16} /> : <Scale size={16} />}
              <span className="sticky-btn-text">{inShortlist ? 'Shortlisted' : 'Compare'}</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/quotes/request/${project.id}`)}
            >
              Request Quote
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};
