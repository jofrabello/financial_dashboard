import { useState, useRef, useCallback } from 'react';
import { HistoryPoint } from '../types/market';

interface MiniChartProps {
  data: HistoryPoint[];
  onExpand?: () => void;
}

interface HoverInfo {
  x: number;
  y: number;
  date: string;
  value: number;
  svgX: number;
  svgY: number;
}

export function MiniChart({ data, onExpand }: MiniChartProps) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const val = minVal + (valRange * i) / (yTicks - 1);
    return { val, y: yScale(val) };
  });

  const xTicks = 6;
  const xLabels = Array.from({ length: xTicks }, (_, i) => {
    const idx = Math.round((i / (xTicks - 1)) * (data.length - 1));
    return { label: data[idx].date.slice(5), x: xScale(idx) };
  });

  const gradId = `grad-${isPositive ? 'up' : 'down'}-${data[0].date}`;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    if (mouseX < padding.left || mouseX > width - padding.right) {
      setHover(null);
      return;
    }

    const ratio = (mouseX - padding.left) / chartWidth;
    const idx = Math.round(ratio * (data.length - 1));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const point = data[clampedIdx];
    const sx = xScale(clampedIdx);
    const sy = yScale(point.close);

    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, date: point.date, value: point.close, svgX: sx, svgY: sy });
  }, [data, width, chartWidth, padding.left, padding.right]);

  const handleMouseLeave = useCallback(() => setHover(null), []);

  const formatVal = (v: number) => v >= 1000 ? v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : v.toFixed(2);

  return (
    <div className={`chart-container ${onExpand ? 'chart-clickable' : ''}`} onClick={onExpand}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="chart-svg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yLabels.map((t, i) => (
          <line key={i} x1={padding.left} x2={width - padding.right} y1={t.y} y2={t.y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}

        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" />

        {yLabels.map((t, i) => (
          <text key={i} x={padding.left - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="#6b7280">
            {t.val >= 1000 ? (t.val / 1000).toFixed(1) + 'k' : t.val.toFixed(1)}
          </text>
        ))}

        {xLabels.map((t, i) => (
          <text key={i} x={t.x} y={height - 5} textAnchor="middle" fontSize="11" fill="#6b7280">
            {t.label}
          </text>
        ))}

        {hover && (
          <>
            <line x1={hover.svgX} x2={hover.svgX} y1={padding.top} y2={padding.top + chartHeight} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
            <line x1={padding.left} x2={width - padding.right} y1={hover.svgY} y2={hover.svgY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx={hover.svgX} cy={hover.svgY} r="5" fill={lineColor} stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {hover && (
        <div className="chart-tooltip" style={{ left: hover.x, top: hover.y - 50 }}>
          <div className="tooltip-date">{hover.date}</div>
          <div className="tooltip-value">{formatVal(hover.value)}</div>
        </div>
      )}
    </div>
  );
}
