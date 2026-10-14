import React, { useState } from 'react';
import { StatusPill, StatusState } from '../../components/StatusPill/StatusPill';
import { Button } from '../../components/Button/Button';
import { Input, Select, Textarea } from '../../components/Input/Input';
import { Card, StatCard } from '../../components/Card/Card';
import { Table, Column } from '../../components/Table/Table';
import { Modal } from '../../components/Modal/Modal';
import { Stepper } from '../../components/Stepper/Stepper';
import { Chip } from '../../components/Chip/Chip';
import { useToast } from '../../components/Toast/ToastContext';
import { BRAND_COLORS } from '../../tokens';
import { formatINR, formatPricePerCredit, formatCredits } from '../../utils/formatters';
import './DesignSystem.css';

interface SampleRecord {
  id: string;
  name: string;
  vintage: string;
  state: string;
  price: number;
  available: number;
  status: StatusState;
}

const SAMPLE_DATA: SampleRecord[] = [
  {
    id: 'PRJ-01',
    name: 'Odisha Mangrove Blue Carbon Initiative',
    vintage: '2023',
    state: 'Odisha',
    price: 950,
    available: 45000,
    status: 'Verified',
  },
  {
    id: 'PRJ-02',
    name: 'Punjab Crop Stubble Biochar Project',
    vintage: '2024',
    state: 'Punjab',
    price: 1250,
    available: 28000,
    status: 'Listed',
  },
  {
    id: 'PRJ-03',
    name: 'Karnataka Agroforestry & Soil Regeneration',
    vintage: '2023',
    state: 'Karnataka',
    price: 880,
    available: 15000,
    status: 'Under Review',
  },
  {
    id: 'PRJ-04',
    name: 'Sundarbans Coastal Wetland Restoration',
    vintage: '2022',
    state: 'West Bengal',
    price: 1100,
    available: 0,
    status: 'Retired',
  },
];

const ONBOARDING_STEPS = [
  { id: 1, label: 'Company Info', description: 'Entity details' },
  { id: 2, label: 'Contact', description: 'Authorized person' },
  { id: 3, label: 'Verification', description: 'PAN & GSTN' },
  { id: 4, label: 'Documents', description: 'Registry proofs' },
  { id: 5, label: 'Review', description: 'Data check' },
  { id: 6, label: 'Submit', description: 'Admin dispatch' },
];

const ALL_STATUSES: StatusState[] = [
  'Pending',
  'Under Review',
  'Verified',
  'Listed',
  'Sold',
  'Retired',
  'Rejected',
  'Draft',
];

export const DesignSystemScreen: React.FC = () => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedChips, setSelectedChips] = useState<string[]>(['Afforestation', 'Verra']);
  const [tableState, setTableState] = useState<'normal' | 'loading' | 'error' | 'empty'>('normal');

  // Input states
  const [textVal, setTextVal] = useState('Tata Steel Ltd');
  const [errorVal, setErrorVal] = useState('invalid_format');
  const [quantityVal, setQuantityVal] = useState('25000');

  const toggleChip = (label: string) => {
    setSelectedChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const columns: Column<SampleRecord>[] = [
    {
      key: 'name',
      header: 'Project Name & ID',
      render: (row) => (
        <div>
          <div className="ds-table-title">{row.name}</div>
          <div className="ds-table-sub">{row.id} • {row.state}</div>
        </div>
      ),
    },
    {
      key: 'vintage',
      header: 'Vintage',
      width: '100px',
    },
    {
      key: 'price',
      header: 'Price / Credit',
      render: (row) => (
        <span className="ds-table-price">{formatPricePerCredit(row.price)}</span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (row) => formatCredits(row.available),
    },
    {
      key: 'status',
      header: 'Audit Status',
      render: (row) => <StatusPill status={row.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: () => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => showToast('Action clicked in table')}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="ds-container">
      <header className="ds-header">
        <div>
          <span className="ds-badge">PHASE A REFERENCE ARTIFACT</span>
          <h1 className="ds-title">Carbonly Design Tokens & Component Library</h1>
          <p className="ds-desc">
            Visual reference system for B2B carbon-credit marketplace. Strict palette, WCAG AA contrast,
            Groww-inspired hierarchy, and robust keyboard accessible controls.
          </p>
        </div>
        <div className="ds-header-actions">
          <Button
            variant="primary"
            onClick={() => showToast('Prototype: not wired (sample toast notification)')}
          >
            Trigger Prototype Toast
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Open Demo Modal
          </Button>
        </div>
      </header>

      {/* 1. PALETTE & BRAND TOKENS */}
      <section className="ds-section" aria-labelledby="section-palette">
        <h2 id="section-palette" className="ds-section-title">
          1. Brand Palette & Color Tokens
        </h2>
        <p className="ds-section-desc">
          Restrained green rule: Green only for primary CTAs, positive/verified states, and key numbers.
          Backgrounds stay white/light neutral. All defined strictly via CSS variables.
        </p>
        <div className="ds-palette-grid">
          {Object.entries(BRAND_COLORS).map(([name, hex]) => (
            <div key={name} className="ds-swatch">
              <div
                className="ds-swatch-box"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
              />
              <div className="ds-swatch-info">
                <span className="ds-swatch-name">{name}</span>
                <code className="ds-swatch-code">{hex}</code>
                <span className="ds-swatch-var">--color-{name.replace(/([A-Z])/g, '-$1').toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. STATUS PILLS (ALL 8 STATES) */}
      <section className="ds-section" aria-labelledby="section-status-pills">
        <div className="ds-section-header">
          <div>
            <h2 id="section-status-pills" className="ds-section-title">
              2. Status Pill System (All 8 States)
            </h2>
            <p className="ds-section-desc">
              Single reusable component across Buyer, Seller, and Admin. Always renders text + dot,
              never colour alone. Meets WCAG AA contrast standards.
            </p>
          </div>
        </div>

        <div className="ds-pills-row">
          {ALL_STATUSES.map((status) => (
            <div key={status} className="ds-pill-card">
              <StatusPill status={status} size="md" />
              <span className="ds-pill-desc">{status} State</span>
            </div>
          ))}
        </div>

        <div className="ds-pills-row ds-pills-row--sm">
          <span className="ds-pill-size-label">Compact variant (size="sm"):</span>
          {ALL_STATUSES.map((status) => (
            <StatusPill key={status} status={status} size="sm" />
          ))}
        </div>
      </section>

      {/* 3. BUTTONS */}
      <section className="ds-section" aria-labelledby="section-buttons">
        <h2 id="section-buttons" className="ds-section-title">
          3. Button Variants & States
        </h2>
        <p className="ds-section-desc">
          High-contrast focus rings on keyboard tab navigation. Distinct hover/active states.
        </p>

        <div className="ds-buttons-grid">
          <div className="ds-button-group">
            <span className="ds-group-label">Primary (Forest Green)</span>
            <div className="ds-row">
              <Button size="sm" onClick={() => showToast()}>Small</Button>
              <Button size="md" onClick={() => showToast()}>Medium (Default)</Button>
              <Button size="lg" onClick={() => showToast()}>Large CTA</Button>
            </div>
          </div>

          <div className="ds-button-group">
            <span className="ds-group-label">Secondary & Outline</span>
            <div className="ds-row">
              <Button variant="secondary" onClick={() => showToast()}>Secondary Neutral</Button>
              <Button variant="outline" onClick={() => showToast()}>Outline Forest</Button>
              <Button variant="ghost" onClick={() => showToast()}>Ghost Action</Button>
            </div>
          </div>

          <div className="ds-button-group">
            <span className="ds-group-label">Special States (Loading, Disabled, Destructive)</span>
            <div className="ds-row">
              <Button variant="primary" isLoading>Processing</Button>
              <Button variant="primary" disabled>Disabled State</Button>
              <Button variant="danger" onClick={() => showToast('Destructive action triggered', 'warning')}>
                Reject / Cancel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FORM INPUTS & VALIDATION */}
      <section className="ds-section" aria-labelledby="section-inputs">
        <h2 id="section-inputs" className="ds-section-title">
          4. Accessible Form Inputs
        </h2>
        <p className="ds-section-desc">
          Strict WCAG AA labels with `htmlFor`, inline errors with `aria-describedby` and `role="alert"`.
        </p>

        <div className="ds-inputs-grid">
          <Input
            label="Company Name"
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            helperText="Enter legally registered corporate name in India"
            required
          />

          <Input
            label="Corporate Tax ID (GSTN)"
            value={errorVal}
            onChange={(e) => setErrorVal(e.target.value)}
            error="Invalid GSTN format. Must be 15 alphanumeric characters (e.g. 27ABCDE1234F1Z5)"
            required
          />

          <Input
            label="Credits to Purchase"
            type="number"
            value={quantityVal}
            onChange={(e) => setQuantityVal(e.target.value)}
            helperText="Available inventory: 45,000 units"
            rightElement={<span className="ds-input-badge">credits</span>}
          />

          <Select
            label="Standard Registry"
            defaultValue="verra"
            options={[
              { value: 'verra', label: 'Verra (VCS / Verified Carbon Standard)' },
              { value: 'gold-standard', label: 'Gold Standard (GS)' },
              { value: 'puro', label: 'Puro.earth (Engineered Removals)' },
            ]}
          />
        </div>

        <div className="ds-textarea-wrap">
          <Textarea
            label="Quote Requirements & Specifications"
            rows={3}
            placeholder="Describe specific vintage preferences, ESG compliance requirements, or delivery schedule..."
            helperText="Optional note sent directly to seller"
          />
        </div>
      </section>

      {/* 5. CARDS & STAT CARDS */}
      <section className="ds-section" aria-labelledby="section-cards">
        <h2 id="section-cards" className="ds-section-title">
          5. Cards & Numeric Stat Widgets
        </h2>
        <p className="ds-section-desc">
          Fintech typography: Big bold tabular numbers formatted via `Intl.NumberFormat('en-IN')` with ₹ currency.
        </p>

        <div className="ds-stats-grid">
          <StatCard
            label="Total Carbon Offset"
            value={formatCredits(124500)}
            subValue="Across 6 active projects"
            trend={{ value: '+14% vs FY25', isPositive: true }}
          />
          <StatCard
            label="Portfolio Value"
            value={formatINR(14250000)}
            subValue="Avg ₹1,144 / credit"
            trend={{ value: 'Market stable', isPositive: false }}
          />
          <StatCard
            label="Verified Registry Share"
            value="94.2%"
            subValue="Audited by Verra & Gold Standard"
            trend={{ value: 'Top tier compliance', isPositive: true }}
          />
          <StatCard
            label="Total Retired Credits"
            value={formatCredits(42000)}
            subValue="Receipts issued & archived"
          />
        </div>

        <div className="ds-card-variants">
          <Card variant="default" padding="md">
            <h3 className="ds-card-heading">Standard Surface Card</h3>
            <p className="ds-card-body">Clean white background, subtle border, and soft enterprise shadow.</p>
          </Card>
          <Card variant="bordered" padding="md">
            <h3 className="ds-card-heading">Bordered Card</h3>
            <p className="ds-card-body">High-contrast boundary without heavy drop-shadows.</p>
          </Card>
          <Card variant="interactive" padding="md" onClick={() => showToast('Interactive card clicked')}>
            <h3 className="ds-card-heading">Interactive Selectable Card</h3>
            <p className="ds-card-body">Includes subtle hover elevation and keyboard focus ring.</p>
          </Card>
        </div>
      </section>

      {/* 6. STEPPER */}
      <section className="ds-section" aria-labelledby="section-stepper">
        <div className="ds-section-header">
          <div>
            <h2 id="section-stepper" className="ds-section-title">
              6. Stepper Component
            </h2>
            <p className="ds-section-desc">
              Orientation stepper for Seller Onboarding (6 steps) and Project Verification Lifecycle.
            </p>
          </div>
          <div className="ds-stepper-controls">
            <Button
              size="sm"
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            >
              Previous Step
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={currentStep === ONBOARDING_STEPS.length - 1}
              onClick={() => setCurrentStep((p) => Math.min(ONBOARDING_STEPS.length - 1, p + 1))}
            >
              Next Step
            </Button>
          </div>
        </div>

        <Card padding="md">
          <Stepper
            steps={ONBOARDING_STEPS}
            currentStepIndex={currentStep}
            onStepClick={(idx) => setCurrentStep(idx)}
          />
        </Card>
      </section>

      {/* 7. CHIPS */}
      <section className="ds-section" aria-labelledby="section-chips">
        <h2 id="section-chips" className="ds-section-title">
          7. Filter & Category Chips
        </h2>
        <p className="ds-section-desc">
          Keyboard navigable category pills with toggle state and record counters.
        </p>

        <div className="ds-chips-wrap">
          {['All Projects', 'Afforestation', 'Blue Carbon', 'Biochar', 'Renewable Energy', 'Verra', 'Gold Standard', 'Puro.earth'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={selectedChips.includes(tag)}
              count={tag === 'All Projects' ? 34 : tag === 'Verra' ? 18 : undefined}
              onClick={() => toggleChip(tag)}
            />
          ))}
        </div>
      </section>

      {/* 8. DATA TABLE WITH ALL STATES */}
      <section className="ds-section" aria-labelledby="section-table">
        <div className="ds-section-header">
          <div>
            <h2 id="section-table" className="ds-section-title">
              8. Data Table Component (4 States)
            </h2>
            <p className="ds-section-desc">
              Demonstrates normal, loading skeleton, empty, and error state variants as required.
            </p>
          </div>
          <div className="ds-table-state-buttons">
            <Button
              size="sm"
              variant={tableState === 'normal' ? 'primary' : 'outline'}
              onClick={() => setTableState('normal')}
            >
              Normal Data
            </Button>
            <Button
              size="sm"
              variant={tableState === 'loading' ? 'primary' : 'outline'}
              onClick={() => setTableState('loading')}
            >
              Loading Skeleton
            </Button>
            <Button
              size="sm"
              variant={tableState === 'empty' ? 'primary' : 'outline'}
              onClick={() => setTableState('empty')}
            >
              Empty State
            </Button>
            <Button
              size="sm"
              variant={tableState === 'error' ? 'primary' : 'outline'}
              onClick={() => setTableState('error')}
            >
              Error State
            </Button>
          </div>
        </div>

        <Table<SampleRecord>
          columns={columns}
          data={tableState === 'empty' ? [] : SAMPLE_DATA}
          keyExtractor={(row) => row.id}
          isLoading={tableState === 'loading'}
          errorMessage={tableState === 'error' ? 'Simulated query failure: Could not load carbon registry records.' : undefined}
          emptyTitle="No carbon projects found"
          emptyMessage="No active listings match the selected filters or registry credentials."
          emptyAction={
            <Button size="sm" variant="outline" onClick={() => setTableState('normal')}>
              Reset Filter State
            </Button>
          }
        />
      </section>

      {/* MODAL DEMO */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Retire Carbon Credits Confirmation"
        description="Retiring credits permanently removes them from the global registry in your organization's name."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false);
                showToast('Carbon retirement confirmed successfully', 'success');
              }}
            >
              Confirm Retirement
            </Button>
          </>
        }
      >
        <div className="ds-modal-sample">
          <p>
            You are about to retire <strong>5,000 credits</strong> from <strong>Odisha Mangrove Blue Carbon Initiative</strong>.
          </p>
          <div className="ds-modal-summary">
            <div><span>Beneficiary:</span> <strong>Tata Steel Corporate Sustainability</strong></div>
            <div><span>Registry:</span> <strong>Verra VCS (ID: 2489)</strong></div>
            <div><span>Vintage:</span> <strong>2023</strong></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
