import { MarketIndex } from '../types/market';

interface IndexCardProps {
  index: MarketIndex;
  onClick: (symbol: string) => void;
  isSelected: boolean;
}

export function IndexCard({ index, onClick, isSelected }: IndexCardProps) {
  const isPositive = index.change >= 0;

  return (
    <div
      className={`index-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(index.symbol)}
    >
      <div className="index-card-header">
        <span className="index-symbol">{index.symbol}</span>
        <span className={`index-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="index-name">{index.name}</div>
      <div className="index-value">{index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div className={`index-abs-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '+' : ''}{index.change.toFixed(2)}
      </div>
    </div>
  );
}
