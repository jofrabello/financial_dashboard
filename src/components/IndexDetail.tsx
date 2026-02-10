import { MarketIndex, IndexHistoryPoint } from '../types/market';
import { MiniChart } from './MiniChart';

interface IndexDetailProps {
  index: MarketIndex;
  history: IndexHistoryPoint[];
}

export function IndexDetail({ index, history }: IndexDetailProps) {
  const isPositive = index.change >= 0;

  return (
    <div className="index-detail">
      <div className="detail-header">
        <div>
          <h2 className="detail-name">{index.name}</h2>
          <span className="detail-symbol">{index.symbol}</span>
        </div>
        <div className="detail-price-section">
          <span className="detail-value">
            {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`detail-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="detail-chart">
        <MiniChart data={history} />
      </div>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Day Range</span>
          <span className="stat-value">
            {index.dayLow.toLocaleString(undefined, { minimumFractionDigits: 2 })} &ndash; {index.dayHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week Range</span>
          <span className="stat-value">
            {index.yearLow.toLocaleString(undefined, { minimumFractionDigits: 2 })} &ndash; {index.yearHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Day High</span>
          <span className="stat-value">{index.dayHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Day Low</span>
          <span className="stat-value">{index.dayLow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week High</span>
          <span className="stat-value">{index.yearHigh.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="stat">
          <span className="stat-label">52-Week Low</span>
          <span className="stat-value">{index.yearLow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
