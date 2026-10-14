import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { StatusPill } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { formatINR } from '../../utils/formatters';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import './QuotesScreen.css';

export const QuotesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { quotes, acceptQuote, rejectQuote } = useCarbonApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeQuoteId, setActiveQuoteId] = useState<string>(quotes[0]?.id || '');

  const filteredQuotes = quotes.filter((q) => {
    if (selectedStatus === 'All') return true;
    return q.status === selectedStatus;
  });

  const activeQuote = quotes.find((q) => q.id === activeQuoteId) || quotes[0];

  return (
    <div className="quotes-page">
      {/* Header */}
      <div className="quotes-header">
        <div>
          <h1 className="quotes-title">Quote Tracking & RFP Desk</h1>
          <p className="quotes-subtitle">
            Monitor seller quotations, counter-offers, and bilateral contract executions in real-time.
          </p>
        </div>

        <div className="quotes-header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/portfolio')}
          >
            Go to Portfolio <ArrowRight size={16} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/marketplace')}
          >
            New Request
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="quotes-tabs" role="tablist" aria-label="Filter quotes by status">
        {['All', 'Pending', 'Responded', 'Accepted', 'Rejected'].map((status) => (
          <button
            key={status}
            role="tab"
            aria-selected={selectedStatus === status}
            className={`quotes-tab-btn ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
            <span className="tab-badge">
              {status === 'All'
                ? quotes.length
                : quotes.filter((q) => q.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* List + Detail Split View */}
      {filteredQuotes.length === 0 ? (
        <div className="quotes-empty-card">
          <FileText size={40} className="empty-icon" />
          <h3>No quote requests found</h3>
          <p>No proposals match the selected status filter.</p>
        </div>
      ) : (
        <div className="quotes-split-layout">
          {/* Left Column: Quotes List */}
          <div className="quotes-list-panel" role="region" aria-label="Quotes list">
            {filteredQuotes.map((q) => {
              const isSelected = q.id === activeQuote?.id;
              return (
                <div
                  key={q.id}
                  className={`quote-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setActiveQuoteId(q.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveQuoteId(q.id)}
                  aria-label={`View quote ${q.id}`}
                >
                  <div className="quote-item-top">
                    <span className="quote-id">{q.id}</span>
                    <StatusPill status={q.status} size="sm" />
                  </div>

                  <h3 className="quote-project-title" title={q.projectName}>
                    {q.projectName}
                  </h3>

                  <div className="quote-meta-line">
                    <span>{q.requestedCredits.toLocaleString('en-IN')} credits</span>
                    <span className="meta-sep">•</span>
                    <span>{formatINR(q.targetPricePerCredit)}/credit</span>
                  </div>

                  <div className="quote-footer-line">
                    <span className="quote-date">Requested: {q.requestDate}</span>
                    <ChevronRight size={16} className="quote-chevron" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed View */}
          {activeQuote && (
            <div className="quote-detail-panel" role="region" aria-label="Quote detail">
              <div className="detail-top-card">
                <div className="detail-top-header">
                  <div>
                    <span className="detail-quote-id">Quote Reference #{activeQuote.id}</span>
                    <h2 className="detail-project-title">{activeQuote.projectName}</h2>
                    <span className="detail-developer-name">
                      Developer: <strong>{activeQuote.developer}</strong> • {activeQuote.registry}
                    </span>
                  </div>
                  <StatusPill status={activeQuote.status} size="md" />
                </div>

                {/* Key RFP Metrics Grid */}
                <div className="detail-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-box-label">Requested Volume</span>
                    <div className="metric-box-val">{activeQuote.requestedCredits.toLocaleString('en-IN')}</div>
                    <span className="metric-box-sub">tonnes CO₂e</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-box-label">Target Unit Price</span>
                    <div className="metric-box-val">{formatINR(activeQuote.targetPricePerCredit)}</div>
                    <span className="metric-box-sub">per credit</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-box-label">Total Contract Value</span>
                    <div className="metric-box-val metric-box-val--green">{formatINR(activeQuote.totalValue)}</div>
                    <span className="metric-box-sub">indicative gross</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-box-label">Expiry Date</span>
                    <div className="metric-box-val">{activeQuote.expiryDate}</div>
                    <span className="metric-box-sub">14-day validity window</span>
                  </div>
                </div>

                {/* Buyer Notes */}
                {activeQuote.notes && (
                  <div className="detail-notes-box">
                    <span className="notes-label">Buyer RFP Notes:</span>
                    <p className="notes-text">"{activeQuote.notes}"</p>
                  </div>
                )}
              </div>

              {/* Status Specific Action Cards */}
              {activeQuote.status === 'Responded' && activeQuote.sellerOffer && (
                <div className="seller-offer-card">
                  <div className="offer-header">
                    <div className="offer-tag">
                      <Sparkles size={16} /> Official Seller Counter-Offer
                    </div>
                    <span className="offer-date">Expires {activeQuote.expiryDate}</span>
                  </div>

                  <p className="offer-message">"{activeQuote.sellerOffer.message}"</p>

                  <div className="offer-terms-grid">
                    <div className="term-item">
                      <span className="term-label">Offered Price</span>
                      <strong className="term-val green">{formatINR(activeQuote.sellerOffer.offeredPrice)}</strong>
                    </div>
                    <div className="term-item">
                      <span className="term-label">Allocated Volume</span>
                      <strong className="term-val">{activeQuote.sellerOffer.offeredVolume.toLocaleString('en-IN')} credits</strong>
                    </div>
                    <div className="term-item">
                      <span className="term-label">Escrow Settlement Date</span>
                      <strong className="term-val">{activeQuote.sellerOffer.deliveryDate}</strong>
                    </div>
                  </div>

                  <div className="offer-action-buttons">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => acceptQuote(activeQuote.id)}
                    >
                      <CheckCircle2 size={16} /> Accept Offer & Execute Settlement
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => rejectQuote(activeQuote.id)}
                    >
                      <XCircle size={16} /> Decline Offer
                    </Button>
                  </div>
                </div>
              )}

              {activeQuote.status === 'Accepted' && (
                <div className="accepted-banner-card">
                  <CheckCircle2 size={24} className="accepted-icon" />
                  <div className="accepted-info">
                    <h4>Contract Accepted & Settled in Escrow</h4>
                    <p>
                      Credits have been allocated into your active Carbonly Portfolio holdings. You may now retire these credits or generate compliance certificates.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/portfolio')}
                  >
                    View in Portfolio <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {activeQuote.status === 'Pending' && (
                <div className="pending-banner-card">
                  <Clock size={20} className="pending-icon" />
                  <div>
                    <h4>Awaiting Seller Counter-Signature & Audit Review</h4>
                    <p>
                      The project proponent has been notified. Standard response turnaround is within 48 business hours.
                    </p>
                  </div>
                </div>
              )}

              {activeQuote.status === 'Rejected' && (
                <div className="rejected-banner-card">
                  <XCircle size={20} className="rejected-icon" />
                  <div>
                    <h4>Quote Declined</h4>
                    <p>This proposal was rejected or expired without execution.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
