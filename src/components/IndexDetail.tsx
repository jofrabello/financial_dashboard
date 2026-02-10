import { Instrument } from '../types/market';
import { MiniChart } from './MiniChart';

interface IndexDetailProps {
  instrument: Instrument;
  onExpandChart?: () => void;
}

export function IndexDetail({ instrument, onExpandChart }: IndexDetailProps) {
  const isPositive = instrument.change >= 0;

  return (
    <div className="index-detail">
      <div className="detail-header">
        <div>
          <h2 className="detail-name">{instrument.name}</h2>
          <span className="detail-symbol">{instrument.symbol}</span>
        </div>
        <div className="detail-price-section">
          <span className="detail-value">
            {instrument.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`detail-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{instrument.change.toFixed(2)} ({isPositive ? '+' : ''}{instrument.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="detail-chart">
        <MiniChart data={instrument.history} onExpand={onExpandChart} />
        {onExpandChart && <p className="chart-expand-hint">Click chart to expand</p>}
      </div>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Day Range</span>
          <span className="stat-value">
            {instrument.dayLow.toLocaleString(undefined, { minimumFractionDigits: 2 })} &ndash; {instrument.dayHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week Range</span>
          <span className="stat-value">
            {instrument.yearLow.toLocaleString(undefined, { minimumFractionDigits: 2 })} &ndash; {instrument.yearHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Day High</span>
          <span className="stat-value">{instrument.dayHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Day Low</span>
          <span className="stat-value">{instrument.dayLow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week High</span>
          <span className="stat-value">{instrument.yearHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week Low</span>
          <span className="stat-value">{instrument.yearLow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
