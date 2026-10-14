import React, { useState } from 'react';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { formatINR } from '../../utils/formatters';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import './ListingApprovalScreen.css';

export const ListingApprovalScreen: React.FC = () => {
  const { listingApprovals, approveListing, rejectListing } = useCarbonApp();

  // Local checklist toggle state
  const [checklistState, setChecklistState] = useState<{
    [id: string]: { [k: string]: boolean };
  }>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    listingApprovals.forEach((l) => {
      initial[l.id] = { ...l.checklist };
    });
    return initial;
  });

  const toggleCheck = (listingId: string, itemKey: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [listingId]: {
        ...prev[listingId],
        [itemKey]: !prev[listingId]?.[itemKey]
      }
    }));
  };

  return (
    <div className="listing-approval-page">
      <div className="listing-approval-header">
        <div>
          <h1 className="approval-title">Carbon Project Listing Approvals</h1>
          <p className="approval-subtitle">
            Five-point methodological integrity audit and registry issuance letter verification prior to exchange publication.
          </p>
        </div>
      </div>

      <div className="listing-cards-grid">
        {listingApprovals.map((listing) => {
          const checks = checklistState[listing.id] || listing.checklist;
          const allChecked = Object.values(checks).every(Boolean);

          return (
            <div key={listing.id} className="approval-card">
              <div className="approval-card-header">
                <div>
                  <span className="approval-id">{listing.id}</span>
                  <h2 className="approval-project-name">{listing.projectName}</h2>
                  <span className="approval-meta">
                    Proponent: <strong>{listing.developer}</strong> • {listing.registry}
                  </span>
                </div>
                <StatusPill status={listing.status} size="sm" />
              </div>

              {/* Volume & Price Metrics */}
              <div className="approval-metrics-grid">
                <div className="metric-item">
                  <span className="lbl">Volume for Sale</span>
                  <strong className="val">{listing.volume.toLocaleString('en-IN')} tonnes</strong>
                </div>
                <div className="metric-item">
                  <span className="lbl">Vintage</span>
                  <strong className="val">{listing.vintage}</strong>
                </div>
                <div className="metric-item">
                  <span className="lbl">Proposed Unit Price</span>
                  <strong className="val green">{formatINR(listing.proposedPrice)}</strong>
                </div>
                <div className="metric-item">
                  <span className="lbl">Protocol</span>
                  <strong className="val">{listing.methodology}</strong>
                </div>
              </div>

              {/* 5-Point Integrity Checklist */}
              <div className="checklist-container">
                <h3 className="checklist-title">Methodological Integrity Checklist</h3>
                <ul className="checklist-items">
                  <li
                    className={`checklist-item ${checks.additionalityVerified ? 'checked' : ''}`}
                    onClick={() => toggleCheck(listing.id, 'additionalityVerified')}
                  >
                    {checks.additionalityVerified ? (
                      <CheckSquare size={18} className="check-icon green" />
                    ) : (
                      <Square size={18} className="check-icon" />
                    )}
                    <span>Additionality Analysis Audited (Exceeds regulatory baseline)</span>
                  </li>

                  <li
                    className={`checklist-item ${checks.baselineAudited ? 'checked' : ''}`}
                    onClick={() => toggleCheck(listing.id, 'baselineAudited')}
                  >
                    {checks.baselineAudited ? (
                      <CheckSquare size={18} className="check-icon green" />
                    ) : (
                      <Square size={18} className="check-icon" />
                    )}
                    <span>Dynamic Baseline Modeling & Leakage Calculation Verified</span>
                  </li>

                  <li
                    className={`checklist-item ${checks.landTitleClearance ? 'checked' : ''}`}
                    onClick={() => toggleCheck(listing.id, 'landTitleClearance')}
                  >
                    {checks.landTitleClearance ? (
                      <CheckSquare size={18} className="check-icon green" />
                    ) : (
                      <Square size={18} className="check-icon" />
                    )}
                    <span>Land Tenure & Clear Community Benefit Consent (FPIC)</span>
                  </li>

                  <li
                    className={`checklist-item ${checks.registryIssuanceLetter ? 'checked' : ''}`}
                    onClick={() => toggleCheck(listing.id, 'registryIssuanceLetter')}
                  >
                    {checks.registryIssuanceLetter ? (
                      <CheckSquare size={18} className="check-icon green" />
                    ) : (
                      <Square size={18} className="check-icon" />
                    )}
                    <span>Registry Official Issuance Letter & Escrow Block Active</span>
                  </li>

                  <li
                    className={`checklist-item ${checks.esgSafeguardsChecked ? 'checked' : ''}`}
                    onClick={() => toggleCheck(listing.id, 'esgSafeguardsChecked')}
                  >
                    {checks.esgSafeguardsChecked ? (
                      <CheckSquare size={18} className="check-icon green" />
                    ) : (
                      <Square size={18} className="check-icon" />
                    )}
                    <span>Do-No-Significant-Harm (DNSH) & SDG Safeguards Validated</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="approval-card-actions">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => rejectListing(listing.id)}
                >
                  <XCircle size={14} /> Reject / Return
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={!allChecked}
                  onClick={() => approveListing(listing.id)}
                >
                  <CheckCircle2 size={14} /> Approve & Publish to Marketplace
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
