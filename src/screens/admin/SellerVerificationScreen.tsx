import React, { useState } from 'react';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import './SellerVerificationScreen.css';

export const SellerVerificationScreen: React.FC = () => {
  const { sellerVerifications, approveSellerKYC, rejectSellerKYC } = useCarbonApp();

  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [selectedDocName, setSelectedDocName] = useState<string | null>(null);

  const activeSeller = sellerVerifications.find((s) => s.id === selectedSellerId);

  return (
    <div className="verification-page">
      <div className="verification-header">
        <div>
          <h1 className="verification-title">Seller Verification & Due Diligence Queue</h1>
          <p className="verification-subtitle">
            Statutory KYC compliance, GSTN cross-checks, and project proponent credential validation.
          </p>
        </div>
      </div>

      <div className="verification-table-card">
        <div className="table-wrapper">
          <table className="verification-table">
            <thead>
              <tr>
                <th scope="col">Case ID</th>
                <th scope="col">Entity Name</th>
                <th scope="col">GSTN / CIN</th>
                <th scope="col">State</th>
                <th scope="col">Authorized Contact</th>
                <th scope="col">Submission Date</th>
                <th scope="col">Risk Rating</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerVerifications.map((seller) => (
                <tr key={seller.id}>
                  <td>
                    <code className="case-id">{seller.id}</code>
                  </td>
                  <td>
                    <strong className="entity-name">{seller.companyName}</strong>
                  </td>
                  <td>
                    <code className="gstn-code">{seller.legalEntityId}</code>
                  </td>
                  <td>{seller.registeredState}</td>
                  <td>
                    <div className="contact-cell">
                      <span>{seller.contactPerson}</span>
                      <span className="contact-email">{seller.contactEmail}</span>
                    </div>
                  </td>
                  <td>{seller.submissionDate}</td>
                  <td>
                    <span className={`risk-badge risk-${seller.riskScore.toLowerCase()}`}>
                      {seller.riskScore} Risk
                    </span>
                  </td>
                  <td>
                    <StatusPill status={seller.status} size="sm" />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSellerId(seller.id)}
                    >
                      <Eye size={14} /> Review Dossier ({seller.documentCount})
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dossier Modal */}
      {selectedSellerId && activeSeller && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedSellerId(null);
            setSelectedDocName(null);
          }}
          title={`Review KYC Dossier: ${activeSeller.companyName}`}
          size="lg"
        >
          <div className="dossier-modal-content">
            <div className="dossier-summary-grid">
              <div className="dossier-col">
                <span className="dossier-lbl">Corporate GSTN</span>
                <strong>{activeSeller.legalEntityId}</strong>
                <span className="gstn-status green">✓ Verified against GSTN Portal</span>
              </div>
              <div className="dossier-col">
                <span className="dossier-lbl">Registered Jurisdiction</span>
                <strong>{activeSeller.registeredState}, India</strong>
              </div>
              <div className="dossier-col">
                <span className="dossier-lbl">Proponent Officer</span>
                <strong>{activeSeller.contactPerson}</strong>
                <span className="dossier-sub">{activeSeller.contactEmail}</span>
              </div>
            </div>

            {/* Document Review List */}
            <div className="dossier-docs-section">
              <h3 className="docs-sec-title">Uploaded Compliance Documents ({activeSeller.documents.length})</h3>
              <div className="docs-review-list">
                {activeSeller.documents.map((doc, idx) => (
                  <div key={idx} className="doc-review-item">
                    <div className="doc-review-left">
                      <FileText size={20} className="doc-icon" />
                      <div>
                        <strong className="doc-name">{doc.name}</strong>
                        <span className="doc-size">{doc.size} • {doc.type}</span>
                      </div>
                    </div>
                    <div className="doc-review-right">
                      <StatusPill status={doc.status} size="sm" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDocName(doc.name)}
                      >
                        Preview Document
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Document Viewer Pane */}
            {selectedDocName && (
              <div className="doc-preview-pane">
                <div className="preview-pane-header">
                  <span>Document Preview: <strong>{selectedDocName}</strong></span>
                  <span className="preview-badge">Simulated Render</span>
                </div>
                <div className="preview-pane-body">
                  <div className="simulated-pdf-page">
                    <div className="pdf-header-bar" />
                    <p className="pdf-text">
                      GOVERNMENT OF INDIA • REGISTRAR OF COMPANIES<br />
                      This is to certify that <strong>{activeSeller.companyName}</strong> is registered under the Companies Act, 2013.<br />
                      CIN: U01400OR2020PTC034567 • Date of Issuance: 12 March 2020.
                    </p>
                    <div className="pdf-seal">SEAL OF REGISTRAR</div>
                  </div>
                </div>
              </div>
            )}

            {/* Decision Controls */}
            <div className="dossier-actions-bar">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSellerId(null);
                  setSelectedDocName(null);
                }}
              >
                Close
              </Button>

              <div style={{ display: 'flex', gap: 10 }}>
                <Button
                  variant="danger"
                  onClick={() => {
                    rejectSellerKYC(activeSeller.id);
                    setSelectedSellerId(null);
                  }}
                >
                  <XCircle size={16} /> Reject Verification
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    approveSellerKYC(activeSeller.id);
                    setSelectedSellerId(null);
                  }}
                >
                  <CheckCircle2 size={16} /> Approve Corporate KYC
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
