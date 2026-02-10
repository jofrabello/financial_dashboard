import { useEffect } from 'react';
import { HistoryPoint, RatioPoint } from '../types/market';
import { MiniChart } from './MiniChart';

interface ChartModalProps {
  title: string;
  subtitle?: string;
  data: HistoryPoint[] | RatioPoint[];
  type: 'history' | 'ratio';
  onClose: () => void;
}

export function ChartModal({ title, subtitle, data, type, onClose }: ChartModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Convert RatioPoint[] to HistoryPoint[] for MiniChart
  const chartData: HistoryPoint[] = type === 'ratio'
    ? (data as RatioPoint[]).map((d) => ({ date: d.date, close: d.value }))
    : (data as HistoryPoint[]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-chart">
          <MiniChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
