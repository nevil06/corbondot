import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { formatINR } from '../../utils/formatters';
import {
  Scale,
  X,
  Plus,
  ShieldCheck
} from 'lucide-react';
import './CompareScreen.css';

export const CompareScreen: React.FC = () => {
  const navigate = useNavigate();
  const { projects, shortlist, toggleShortlist, clearShortlist } = useCarbonApp();

  const comparedProjects = projects.filter((p) => shortlist.includes(p.id));

  return (
    <div className="compare-page">
      {/* Header */}
      <div className="compare-header">
        <div>
          <h1 className="compare-title">Project Comparison Matrix</h1>
          <p className="compare-subtitle">
            Side-by-side evaluation across 2–4 shortlisted projects with objective, neutral metrics (zero automated ranking).
          </p>
        </div>

        <div className="compare-header-actions">
          {shortlist.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearShortlist}>
              Clear Shortlist
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/marketplace')}
          >
            <Plus size={16} /> Add More Projects
          </Button>
        </div>
      </div>

      {/* State: Less than 2 projects selected */}
      {comparedProjects.length < 2 ? (
        <div className="compare-empty-state">
          <Scale size={48} className="empty-icon" aria-hidden="true" />
          <h2 className="empty-title">Select at least 2 projects to compare</h2>
          <p className="empty-description">
            You currently have {comparedProjects.length} project(s) in your shortlist. Select up to 4 projects from the marketplace to compare side-by-side.
          </p>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </Button>
        </div>
      ) : (
        /* Horizontal Scrollable Table */
        <div className="compare-table-wrapper" role="region" aria-label="Project comparison table">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col" className="compare-metric-col">
                  Metric / Attribute
                </th>
                {comparedProjects.map((p) => (
                  <th key={p.id} scope="col" className="compare-project-col">
                    <div className="compare-col-header">
                      <button
                        type="button"
                        className="remove-compare-btn"
                        onClick={() => toggleShortlist(p.id)}
                        aria-label={`Remove ${p.name} from comparison`}
                      >
                        <X size={16} />
                      </button>
                      <span className="compare-col-tag">{p.registry}</span>
                      <h3 className="compare-col-title" title={p.name}>{p.name}</h3>
                      <div className="compare-col-price">
                        {formatINR(p.pricePerCredit)}
                        <span className="compare-unit"> / credit</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="compare-quote-btn"
                        onClick={() => navigate(`/quotes/request/${p.id}`)}
                      >
                        Request Quote
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Status */}
              <tr>
                <th scope="row" className="row-header">Verification Status</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}><StatusPill status={p.verificationStatus} size="sm" /></td>
                ))}
              </tr>

              {/* Category & Type */}
              <tr>
                <th scope="row" className="row-header">Classification</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>
                    <span className="tag-val">{p.category}</span> • <strong>{p.type}</strong>
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr>
                <th scope="row" className="row-header">Location</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>{p.location}, {p.state}</td>
                ))}
              </tr>

              {/* Vintage */}
              <tr>
                <th scope="row" className="row-header">Vintage</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}><strong>{p.vintage}</strong></td>
                ))}
              </tr>

              {/* Available Volume */}
              <tr>
                <th scope="row" className="row-header">Available Liquidity</th>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="numeric-td">
                    {p.availableCredits.toLocaleString('en-IN')} tonnes
                  </td>
                ))}
              </tr>

              {/* Registry Standard */}
              <tr>
                <th scope="row" className="row-header">Registry Standard</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>{p.registry} ({p.registryId})</td>
                ))}
              </tr>

              {/* Methodology */}
              <tr>
                <th scope="row" className="row-header">Methodology Protocol</th>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="methodology-td">
                    <ShieldCheck size={14} className="methodology-icon" />
                    <span>{p.methodology}</span>
                  </td>
                ))}
              </tr>

              {/* Additionality Score */}
              <tr>
                <th scope="row" className="row-header">Additionality Rating</th>
                {comparedProjects.map((p) => (
                  <td key={p.id} className="positive-td">{p.additionalityScore}</td>
                ))}
              </tr>

              {/* Permanence Risk */}
              <tr>
                <th scope="row" className="row-header">Permanence Risk Profile</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>{p.permanenceRisk} Risk</td>
                ))}
              </tr>

              {/* Developer */}
              <tr>
                <th scope="row" className="row-header">Project Proponent / Developer</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>{p.developer}</td>
                ))}
              </tr>

              {/* UN SDGs */}
              <tr>
                <th scope="row" className="row-header">UN SDG Co-Benefits</th>
                {comparedProjects.map((p) => (
                  <td key={p.id}>
                    <div className="sdg-mini-row">
                      {p.coBenefitsSDGs.map((s) => (
                        <span key={s} className="sdg-mini-chip">SDG {s}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
