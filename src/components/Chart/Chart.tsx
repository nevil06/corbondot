import React from 'react';
import './Chart.css';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface LineChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
  accessibleDescription?: string;
}

/**
 * Clean, restrained SVG Line Chart adhering to Groww-style minimalist aesthetics.
 * Restrained green rule: Line uses --color-forest-green, neutral grid lines.
 * Full WCAG accessibility: screen reader data table fallback & aria-label.
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 180,
  valuePrefix = '₹',
  valueSuffix = '',
  className = '',
  accessibleDescription = 'Price trend over past observation periods.'
}) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No trend data available</div>;
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.15 || minVal * 0.1 || 10;
  const yMin = Math.max(0, minVal - padding);
  const yMax = maxVal + padding;
  const range = yMax - yMin || 1;

  const width = 500;
  const chartHeight = height - 40;
  const xStep = data.length > 1 ? (width - 40) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = 20 + i * xStep;
    const y = chartHeight - ((d.value - yMin) / range) * (chartHeight - 30) - 10;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under curve
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  return (
    <div className={`carbonly-chart ${className}`} role="region" aria-label={title || 'Line Chart'}>
      {title && <div className="chart-title">{title}</div>}
      
      {/* Screen reader text alternative */}
      <span className="sr-only">
        {accessibleDescription} Values range from {valuePrefix}{minVal} to {valuePrefix}{maxVal}.
      </span>

      <div className="chart-svg-container" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="chart-svg"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-forest-green)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-forest-green)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1={chartHeight * 0.25} x2={width - 20} y2={chartHeight * 0.25} className="chart-grid-line" />
          <line x1="20" y1={chartHeight * 0.5} x2={width - 20} y2={chartHeight * 0.5} className="chart-grid-line" />
          <line x1="20" y1={chartHeight * 0.75} x2={width - 20} y2={chartHeight * 0.75} className="chart-grid-line" />
          <line x1="20" y1={chartHeight} x2={width - 20} y2={chartHeight} className="chart-axis-line" />

          {/* Area under curve */}
          <path d={areaD} fill="url(#chartLineGradient)" />

          {/* Primary Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-forest-green)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i} className="chart-point-group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="chart-point"
              />
              <title>{`${p.label}: ${valuePrefix}${p.value.toLocaleString('en-IN')}${valueSuffix}`}</title>
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="chart-x-labels">
          {points.map((p, i) => (
            <span key={i} className="chart-x-label">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface BarChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 180,
  className = ''
}) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`carbonly-chart bar-chart ${className}`} role="region" aria-label={title || 'Bar Chart'}>
      {title && <div className="chart-title">{title}</div>}
      <div className="bar-chart-container" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const heightPercent = Math.max(6, (item.value / maxVal) * 100);
          return (
            <div key={idx} className="bar-column">
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.label}: ${item.value.toLocaleString('en-IN')}`}
                />
              </div>
              <span className="bar-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface DonutItem {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutItem[];
  title?: string;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  centerLabel,
  centerValue,
  className = ''
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  let cumulativePercent = 0;

  const segments = data.map((item) => {
    const percent = (item.value / total) * 100;
    const strokeDasharray = `${percent} ${100 - percent}`;
    const strokeDashoffset = 100 - cumulativePercent;
    cumulativePercent += percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className={`carbonly-chart donut-chart ${className}`}>
      {title && <div className="chart-title">{title}</div>}
      <div className="donut-wrapper">
        <svg viewBox="0 0 36 36" className="donut-svg" aria-hidden="true">
          <circle cx="18" cy="18" r="15.91549430918954" className="donut-ring-bg" />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.91549430918954"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="4"
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              className="donut-segment"
            />
          ))}
        </svg>
        <div className="donut-center-info">
          {centerValue && <div className="donut-center-value">{centerValue}</div>}
          {centerLabel && <div className="donut-center-label">{centerLabel}</div>}
        </div>
      </div>
      <div className="donut-legend">
        {data.map((item, idx) => (
          <div key={idx} className="donut-legend-item">
            <span className="donut-legend-color" style={{ backgroundColor: item.color }} />
            <span className="donut-legend-text">{item.label}</span>
            <span className="donut-legend-value">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
