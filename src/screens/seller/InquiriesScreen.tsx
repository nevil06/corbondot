import React, { useState } from 'react';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { formatINR } from '../../utils/formatters';
import {
  Send,
  XCircle,
  CheckCircle2,
  Building2
} from 'lucide-react';
import './InquiriesScreen.css';

export const InquiriesScreen: React.FC = () => {
  const { inquiries, respondToInquiry, rejectInquiry } = useCarbonApp();

  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [offerPriceInput, setOfferPriceInput] = useState<string>('1220');
  const [offerVolumeInput, setOfferVolumeInput] = useState<string>('20000');
  const [offerNote, setOfferNote] = useState('We can confirm instant Verra serial allocation upon escrow contract execution.');

  const activeInquiry = inquiries.find((inq) => inq.id === selectedInquiryId);

  const openRespondModal = (id: string) => {
    setSelectedInquiryId(id);
    const inq = inquiries.find((i) => i.id === id);
    if (inq) {
      setOfferPriceInput(inq.targetPrice.toString());
      setOfferVolumeInput(inq.volumeRequested.toString());
    }
  };

  const handleSendCounterQuote = () => {
    if (!selectedInquiryId) return;
    const price = parseFloat(offerPriceInput) || 1200;
    respondToInquiry(selectedInquiryId, price);
    setSelectedInquiryId(null);
  };

  return (
    <div className="inquiries-page">
      <div className="inquiries-header">
        <div>
          <h1 className="inquiries-title">Buyer Inquiries & RFP Inbox</h1>
          <p className="inquiries-subtitle">
            Direct bilateral inquiries submitted by corporate buyers for volume allocations and customized pricing.
          </p>
        </div>
      </div>

      <div className="inquiries-grid">
        {inquiries.map((inq) => (
          <div key={inq.id} className="inquiry-card">
            <div className="inquiry-card-header">
              <div className="inquiry-id-box">
                <span className="inquiry-id">{inq.id}</span>
                <span className="inquiry-date">{inq.date}</span>
              </div>
              <StatusPill status={inq.status} size="sm" />
            </div>

            <div className="inquiry-body">
              <h2 className="buyer-company-name">
                <Building2 size={18} className="company-icon" /> {inq.buyerCompany}
              </h2>
              <span className="buyer-email">{inq.buyerContact}</span>

              <div className="inquiry-project-box">
                <span className="inquiry-project-lbl">Target Carbon Project:</span>
                <strong className="inquiry-project-val">{inq.projectName}</strong>
              </div>

              <div className="inquiry-request-metrics">
                <div className="metric-col">
                  <span className="lbl">Volume Requested</span>
                  <strong className="val">{inq.volumeRequested.toLocaleString('en-IN')} tonnes</strong>
                </div>
                <div className="metric-col">
                  <span className="lbl">Target Unit Price</span>
                  <strong className="val green">{formatINR(inq.targetPrice)} / credit</strong>
                </div>
              </div>

              <div className="buyer-note-box">
                <span className="buyer-note-lbl">Buyer Note:</span>
                <p className="buyer-note-text">"{inq.buyerNote}"</p>
              </div>
            </div>

            <div className="inquiry-card-footer">
              {inq.status === 'Pending' ? (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openRespondModal(inq.id)}
                  >
                    <Send size={14} /> Send Counter-Quote
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rejectInquiry(inq.id)}
                  >
                    <XCircle size={14} /> Decline
                  </Button>
                </>
              ) : (
                <div className="status-closed-note">
                  <CheckCircle2 size={16} /> Status: {inq.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {selectedInquiryId && activeInquiry && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInquiryId(null)}
          title={`Respond to Inquiry #${activeInquiry.id}`}
          size="md"
        >
          <div className="modal-respond-content">
            <div className="buyer-summary-banner">
              <strong>{activeInquiry.buyerCompany}</strong>
              <p>Project: {activeInquiry.projectName}</p>
            </div>

            <div className="modal-field">
              <label htmlFor="offer-price" className="modal-label">
                Official Offered Price (INR / Credit) *
              </label>
              <input
                id="offer-price"
                type="number"
                className="modal-input"
                value={offerPriceInput}
                onChange={(e) => setOfferPriceInput(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label htmlFor="offer-vol" className="modal-label">
                Confirmed Allocation Volume (Credits) *
              </label>
              <input
                id="offer-vol"
                type="number"
                className="modal-input"
                value={offerVolumeInput}
                onChange={(e) => setOfferVolumeInput(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label htmlFor="offer-notes" className="modal-label">
                Contract Terms & Delivery Schedule Notes
              </label>
              <textarea
                id="offer-notes"
                rows={3}
                className="modal-textarea"
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <Button variant="outline" onClick={() => setSelectedInquiryId(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendCounterQuote}>
                <Send size={14} /> Transmit Binding Quotation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
