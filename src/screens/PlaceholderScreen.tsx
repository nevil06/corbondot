import React from 'react';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { StatusPill } from '../components/StatusPill/StatusPill';
import { useToast } from '../components/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';

interface PlaceholderProps {
  title: string;
  role: 'Buyer' | 'Seller' | 'Admin';
  phase: 'Phase B' | 'Phase C';
  description: string;
}

export const PlaceholderScreen: React.FC<PlaceholderProps> = ({
  title,
  role,
  phase,
  description,
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 880, margin: '40px auto', padding: '0 24px' }}>
      <Card variant="default" padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <StatusPill status="Under Review" size="md" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            SCHEDULED FOR {phase.toUpperCase()}
          </span>
        </div>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {title} ({role})
        </h1>
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="primary" onClick={() => navigate('/design-system')}>
            Explore Phase A Design System
          </Button>
          <Button variant="outline" onClick={() => showToast(`Prototype notice: ${title} launches in ${phase}`)}>
            Check Status
          </Button>
        </div>
      </Card>
    </div>
  );
};
