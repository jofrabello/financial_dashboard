import { RatioPoint } from '../types/market';

interface RatioChartProps {
  data: RatioPoint[];
  title: string;
  description: string;
}

export function RatioChart({ data, title, description }: RatioChartProps) {
  if (data.length < 2) return null;

  const width = 800;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (v: number) => padding.top + chartHeight - ((v - minVal) / valRange) * chartHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(d.value).toFixed(1)}`)
    .join(' ');

  const isRising = data[data.length - 1].value >= data[0].value;
  const lineColor = isRising ? '#2563eb' : '#f59e0b';
  const label = isRising ? 'Offense' : 'Defense';

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const val = minVal + (valRange * i) / (yTicks - 1);
    return { val, y: yScale(val) };
  });

  const xTicks = 6;
  const xLabels = Array.from({ length: xTicks }, (_, i) => {
    const idx = Math.round((i / (xTicks - 1)) * (data.length - 1));
    return { label: data[idx].date.slice(5), x: xScale(idx) };
  });

  return (
    <div className="ratio-chart-card">
      <div className="ratio-header">
        <div>
          <h3 className="ratio-title">{title}</h3>
          <p className="ratio-desc">{description}</p>
        </div>
        <span className={`ratio-mode ${isRising ? 'offense' : 'defense'}`}>
          {label}
        </span>
      </div>
      <div className="ratio-chart-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
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
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" />
          {yLabels.map((t, i) => (
            <text key={i} x={padding.left - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="#6b7280">
              {t.val.toFixed(2)}
            </text>
          ))}
          {xLabels.map((t, i) => (
            <text key={i} x={t.x} y={height - 5} textAnchor="middle" fontSize="11" fill="#6b7280">
              {t.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
