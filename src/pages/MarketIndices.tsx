import { useState } from 'react';
import { dashboardData } from '../data/marketIndices';
import { IndexCard } from '../components/IndexCard';
import { IndexDetail } from '../components/IndexDetail';
import { RatioChart } from '../components/RatioChart';
import { ChartModal } from '../components/ChartModal';
import { Instrument, CategoryKey, HistoryPoint, RatioPoint } from '../types/market';

const CATEGORY_META: Record<CategoryKey, { title: string; subtitle: string }> = {
  coreBenchmarks: {
    title: 'Core Benchmarks',
    subtitle: 'Market direction — if these are red, almost everything else will be too',
  },
  fearCreditGauges: {
    title: 'Fear & Credit Gauges',
    subtitle: 'How the market is moving, not just where it\'s going',
  },
  sectorInternals: {
    title: 'Sector & Smart Money Internals',
    subtitle: 'Where capital is rotating',
  },
  macroCommodities: {
    title: 'Macro & Commodities',
    subtitle: 'Inflation, hedges, and risk appetite',
  },
};

const CATEGORIES: CategoryKey[] = ['coreBenchmarks', 'fearCreditGauges', 'sectorInternals', 'macroCommodities'];

interface ModalState {
  title: string;
  subtitle?: string;
  data: HistoryPoint[] | RatioPoint[];
  type: 'history' | 'ratio';
}

export function MarketIndices() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('^GSPC');
  const [modal, setModal] = useState<ModalState | null>(null);

  const allInstruments: Instrument[] = CATEGORIES.flatMap(
    (cat) => dashboardData.categories[cat]
  );

  const selected = allInstruments.find((inst) => inst.symbol === selectedSymbol);

  const summary = {
    advancing: allInstruments.filter((i) => i.change > 0).length,
    declining: allInstruments.filter((i) => i.change < 0).length,
    unchanged: allInstruments.filter((i) => i.change === 0).length,
  };

  const lastUpdated = new Date(dashboardData.lastUpdated).toLocaleString();

  return (
    <div className="market-indices-page">
      <div className="page-header">
        <h1>Market Dashboard</h1>
        <p className="page-subtitle">
          Live data via Yahoo Finance &middot; Last updated: {lastUpdated}
        </p>
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

      <div className="dashboard-layout">
        <div className="dashboard-main">
          {CATEGORIES.map((catKey) => {
            const instruments = dashboardData.categories[catKey];
            if (!instruments || instruments.length === 0) return null;
            const meta = CATEGORY_META[catKey];

            return (
              <section key={catKey} className="category-section">
                <div className="category-header">
                  <h2 className="category-title">{meta.title}</h2>
                  <p className="category-subtitle">{meta.subtitle}</p>
                </div>
                <div className="category-grid">
                  {instruments.map((inst) => (
                    <IndexCard
                      key={inst.symbol}
                      instrument={inst}
                      onClick={setSelectedSymbol}
                      isSelected={inst.symbol === selectedSymbol}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <section className="category-section">
            <div className="category-header">
              <h2 className="category-title">Market Regime Indicators</h2>
              <p className="category-subtitle">Ratio analysis — offense vs. defense mode. Click charts to expand.</p>
            </div>
            <div className="ratio-charts">
              <RatioChart
                data={dashboardData.ratios.techVsStaples}
                title="Tech / Staples Ratio (XLK / XLP)"
                description="Rising = Offense (risk-on). Falling = Defense (risk-off)."
                onExpand={() => setModal({
                  title: 'Tech / Staples Ratio (XLK / XLP)',
                  subtitle: 'Rising = Offense (risk-on). Falling = Defense (risk-off).',
                  data: dashboardData.ratios.techVsStaples,
                  type: 'ratio',
                })}
              />
              <RatioChart
                data={dashboardData.ratios.equalWeightVsSP500}
                title="Equal Weight / S&P 500 (RSP / ^GSPC)"
                description="Rising = broad participation. Falling = narrow mega-cap led rally."
                onExpand={() => setModal({
                  title: 'Equal Weight / S&P 500 (RSP / ^GSPC)',
                  subtitle: 'Rising = broad participation. Falling = narrow mega-cap led rally.',
                  data: dashboardData.ratios.equalWeightVsSP500,
                  type: 'ratio',
                })}
              />
            </div>
          </section>
        </div>

        <div className="dashboard-detail-panel">
          {selected && (
            <IndexDetail
              instrument={selected}
              onExpandChart={() => setModal({
                title: selected.name,
                subtitle: selected.symbol,
                data: selected.history,
                type: 'history',
              })}
            />
          )}
        </div>
      </div>

      {modal && (
        <ChartModal
          title={modal.title}
          subtitle={modal.subtitle}
          data={modal.data}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
