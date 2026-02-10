import { Instrument } from '../types/market';

interface IndexCardProps {
  instrument: Instrument;
  onClick: (symbol: string) => void;
  isSelected: boolean;
}

export function IndexCard({ instrument, onClick, isSelected }: IndexCardProps) {
  const isPositive = instrument.change >= 0;

  return (
    <div
      className={`index-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(instrument.symbol)}
    >
      <div className="index-card-header">
        <span className="index-symbol">{instrument.symbol}</span>
        <span className={`index-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{instrument.changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="index-name">{instrument.name}</div>
      <div className="index-value">{instrument.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div className={`index-abs-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{instrument.change.toFixed(2)}
      </div>
    </div>
  );
}
