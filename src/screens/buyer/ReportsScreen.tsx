import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarbonApp } from '../../context/CarbonAppContext';
import { Button } from '../../components/Button/Button';
import { LineChart, BarChart, DonutChart } from '../../components/Chart/Chart';
import { useToast } from '../../components/Toast/ToastContext';
import {
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  BarChart3,
  Layers
} from 'lucide-react';
import './ReportsScreen.css';

export const ReportsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { holdings, certificates } = useCarbonApp();
  const { showToast } = useToast();

  const [dateRange, setDateRange] = useState<string>('FY 2023-24');

  // Trend mock data
  const monthlyRetirementData = [
    { label: 'Apr 24', value: 1200 },
    { label: 'May 24', value: 1800 },
    { label: 'Jun 24', value: 2400 },
    { label: 'Jul 24', value: 2100 },
    { label: 'Aug 24', value: 3100 },
    { label: 'Sep 24', value: 4200 },
    { label: 'Oct 24', value: 5000 }
  ];

  const cumulativeEmissionChart = [
    { label: 'Nov 23', value: 4500 },
    { label: 'Jan 24', value: 8200 },
    { label: 'Mar 24', value: 14000 },
    { label: 'May 24', value: 19500 },
    { label: 'Jul 24', value: 24800 },
    { label: 'Sep 24', value: 32000 }
  ];

  const scopeAllocation = [
    { label: 'Scope 1 (Direct)', value: 40, color: 'var(--color-forest-green)' },
    { label: 'Scope 2 (Electricity)', value: 45, color: '#0284C7' },
    { label: 'Scope 3 (Supply Chain)', value: 15, color: 'var(--color-deep-green)' }
  ];

  const handleExport = (format: 'CSV' | 'PDF') => {
    showToast(`Generating audit-verified ${format} sustainability package for ${dateRange}...`, 'success');
  };

  const totalRetired = certificates.reduce((acc, c) => acc + c.creditsRetired, 0);

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">ESG & Sustainability Reporting</h1>
          <p className="reports-subtitle">
            SEBI BRSR and GHG Protocol compliant carbon neutralization reporting with automated audit trails.
          </p>
        </div>

        <div className="reports-controls">
          <div className="date-select-wrapper">
            <Calendar size={16} className="calendar-icon" />
            <select
              className="date-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              aria-label="Select report date range"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="FY 2023-24">Full FY 2023-24</option>
              <option value="All-Time">All-Time Cumulative</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('CSV')}
          >
            <FileSpreadsheet size={16} /> Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('PDF')}
          >
            <Download size={16} /> Export Audit PDF
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="reports-kpi-grid">
        <div className="report-kpi-card">
          <span className="kpi-label">Cumulative Neutralized Emissions</span>
          <div className="kpi-num kpi-num--green">
            {totalRetired.toLocaleString('en-IN')}
            <span className="kpi-unit"> tCO₂e</span>
          </div>
          <span className="kpi-sub">Audited against Verra & Gold Standard registries</span>
        </div>

        <div className="report-kpi-card">
          <span className="kpi-label">Active Portfolio Hedging</span>
          <div className="kpi-num">
            {holdings.reduce((sum, h) => sum + h.creditsHeld, 0).toLocaleString('en-IN')}
            <span className="kpi-unit"> tCO₂e</span>
          </div>
          <span className="kpi-sub">Secured at weighted average price</span>
        </div>

        <div className="report-kpi-card">
          <span className="kpi-label">Compliance Alignment</span>
          <div className="kpi-num">100%</div>
          <span className="kpi-sub">SEBI BRSR Core Indicator 7 & 8 verified</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="reports-charts-grid">
        {/* Line Chart: Cumulative Offsets */}
        <div className="chart-card">
          <h2 className="chart-card__title">
            <TrendingUp size={16} /> Cumulative Carbon Sequestration Progress (tCO₂e)
          </h2>
          <LineChart
            data={cumulativeEmissionChart}
            title="FY24 Emissions Offset Trajectory"
            height={200}
            valuePrefix=""
            valueSuffix=" t"
            accessibleDescription="Cumulative emissions offset trajectory over the selected period."
          />
        </div>

        {/* Bar Chart: Monthly Retirements */}
        <div className="chart-card">
          <h2 className="chart-card__title">
            <BarChart3 size={16} /> Monthly Credit Retirement Velocity
          </h2>
          <BarChart
            data={monthlyRetirementData}
            title="Monthly Retired Volumes (Tonnes)"
            height={200}
          />
        </div>

        {/* Donut Chart: Scope Breakdown */}
        <div className="chart-card">
          <h2 className="chart-card__title">
            <Layers size={16} /> Neutralization by GHG Protocol Scope
          </h2>
          <DonutChart
            data={scopeAllocation}
            centerLabel="Total Neutralized"
            centerValue={`${(totalRetired / 1000).toFixed(1)}k t`}
          />
        </div>
      </div>

      {/* Audit Registry Traceability Table */}
      <div className="audit-table-card">
        <div className="audit-table-header">
          <div>
            <h2 className="audit-title">Registry Traceability & Serial Ledger</h2>
            <p className="audit-subtitle">
              Detailed registry audit logs mapping corporate offset claims directly to Verra and Puro.earth issuance batches.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="audit-table">
            <thead>
              <tr>
                <th scope="col">Certificate ID</th>
                <th scope="col">Project Proponent</th>
                <th scope="col">Registry</th>
                <th scope="col">Serial Range</th>
                <th scope="col" className="text-right">Volume</th>
                <th scope="col">Date Retired</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>
                    <span
                      className="cert-link"
                      onClick={() => navigate(`/certificate/${cert.id}`)}
                    >
                      {cert.certificateNumber}
                    </span>
                  </td>
                  <td>{cert.projectName}</td>
                  <td>{cert.registry} ({cert.vintage})</td>
                  <td className="font-mono">{cert.serialNumberRange}</td>
                  <td className="text-right font-bold">
                    {cert.creditsRetired.toLocaleString('en-IN')} t
                  </td>
                  <td>{cert.retirementDate}</td>
                  <td>
                    <span className="verified-pill">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
