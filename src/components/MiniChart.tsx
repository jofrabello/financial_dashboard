import { IndexHistoryPoint } from '../types/market';

interface MiniChartProps {
  data: IndexHistoryPoint[];
}

export function MiniChart({ data }: MiniChartProps) {
  if (data.length < 2) return null;

  const width = 800;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };

  const values = data.map((d) => d.close);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (v: number) => padding.top + chartHeight - ((v - minVal) / valRange) * chartHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(d.close).toFixed(1)}`)
    .join(' ');

  const isPositive = data[data.length - 1].close >= data[0].close;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  const areaD = `${pathD} L ${xScale(data.length - 1).toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${padding.left.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`;

  // Y-axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const val = minVal + (valRange * i) / (yTicks - 1);
    return { val, y: yScale(val) };
  });

  // X-axis labels (show ~6 dates)
  const xTicks = 6;
  const xLabels = Array.from({ length: xTicks }, (_, i) => {
    const idx = Math.round((i / (xTicks - 1)) * (data.length - 1));
    return { label: data[idx].date.slice(5), x: xScale(idx) };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
      <defs>
        <linearGradient id={`grad-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map((t, i) => (
        <line
          key={i}
          x1={padding.left}
          x2={width - padding.right}
          y1={t.y}
          y2={t.y}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill={`url(#grad-${isPositive ? 'up' : 'down'})`} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" />

      {/* Y-axis labels */}
      {yLabels.map((t, i) => (
        <text key={i} x={padding.left - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="#6b7280">
          {t.val >= 1000 ? (t.val / 1000).toFixed(1) + 'k' : t.val.toFixed(1)}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((t, i) => (
        <text key={i} x={t.x} y={height - 5} textAnchor="middle" fontSize="11" fill="#6b7280">
          {t.label}
        </text>
      ))}
    </svg>
  );
}
