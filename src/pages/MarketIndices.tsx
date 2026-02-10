import { useState } from 'react';
import { marketIndices, indexHistories } from '../data/marketIndices';
import { IndexCard } from '../components/IndexCard';
import { IndexDetail } from '../components/IndexDetail';
import { MarketIndex } from '../types/market';

type RegionFilter = 'All' | 'US' | 'Europe' | 'Asia';

export function MarketIndices() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('SPX');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');

  const selectedIndex = marketIndices.find((idx) => idx.symbol === selectedSymbol) as MarketIndex;
  const selectedHistory = indexHistories[selectedSymbol] ?? [];

  const filteredIndices =
    regionFilter === 'All'
      ? marketIndices
      : marketIndices.filter((idx) => idx.region === regionFilter);

  const regions: RegionFilter[] = ['All', 'US', 'Europe', 'Asia'];

  const summary = {
    advancing: marketIndices.filter((i) => i.change > 0).length,
    declining: marketIndices.filter((i) => i.change < 0).length,
    unchanged: marketIndices.filter((i) => i.change === 0).length,
  };

  return (
    <div className="market-indices-page">
      <div className="page-header">
        <h1>Market Indices</h1>
        <p className="page-subtitle">Global market overview as of February 10, 2026</p>
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">Advancing</span>
          <span className="summary-value positive">{summary.advancing}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Declining</span>
          <span className="summary-value negative">{summary.declining}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Unchanged</span>
          <span className="summary-value">{summary.unchanged}</span>
        </div>
      </div>

      <div className="region-filters">
        {regions.map((region) => (
          <button
            key={region}
            className={`filter-btn ${regionFilter === region ? 'active' : ''}`}
            onClick={() => setRegionFilter(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="indices-layout">
        <div className="indices-grid">
          {filteredIndices.map((idx) => (
            <IndexCard
              key={idx.symbol}
              index={idx}
              onClick={setSelectedSymbol}
              isSelected={idx.symbol === selectedSymbol}
            />
          ))}
        </div>

        <div className="indices-detail-panel">
          {selectedIndex && (
            <IndexDetail index={selectedIndex} history={selectedHistory} />
          )}
        </div>
      </div>
    </div>
  );
}
