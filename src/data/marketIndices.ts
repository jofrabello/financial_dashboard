import { MarketIndex, IndexHistoryPoint } from '../types/market';

export const marketIndices: MarketIndex[] = [
  {
    symbol: 'SPX',
    name: 'S&P 500',
    value: 6025.99,
    change: 22.44,
    changePercent: 0.37,
    dayHigh: 6032.48,
    dayLow: 5990.17,
    yearHigh: 6118.71,
    yearLow: 4953.56,
    region: 'US',
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    value: 44556.04,
    change: 134.13,
    changePercent: 0.30,
    dayHigh: 44620.51,
    dayLow: 44310.22,
    yearHigh: 45073.63,
    yearLow: 37611.56,
    region: 'US',
  },
  {
    symbol: 'IXIC',
    name: 'NASDAQ Composite',
    value: 19654.02,
    change: 91.11,
    changePercent: 0.47,
    dayHigh: 19721.45,
    dayLow: 19502.34,
    yearHigh: 20204.58,
    yearLow: 15222.77,
    region: 'US',
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000',
    value: 2279.71,
    change: -5.38,
    changePercent: -0.24,
    dayHigh: 2298.45,
    dayLow: 2270.12,
    yearHigh: 2442.74,
    yearLow: 1942.05,
    region: 'US',
  },
  {
    symbol: 'VIX',
    name: 'CBOE Volatility Index',
    value: 16.54,
    change: -0.98,
    changePercent: -5.59,
    dayHigh: 17.82,
    dayLow: 16.31,
    yearHigh: 65.73,
    yearLow: 10.62,
    region: 'US',
  },
  {
    symbol: 'FTSE',
    name: 'FTSE 100',
    value: 8727.28,
    change: 45.71,
    changePercent: 0.53,
    dayHigh: 8741.12,
    dayLow: 8680.45,
    yearHigh: 8770.56,
    yearLow: 7404.08,
    region: 'Europe',
  },
  {
    symbol: 'DAX',
    name: 'DAX',
    value: 21787.00,
    change: 156.32,
    changePercent: 0.72,
    dayHigh: 21801.50,
    dayLow: 21610.23,
    yearHigh: 21801.50,
    yearLow: 16345.02,
    region: 'Europe',
  },
  {
    symbol: 'CAC',
    name: 'CAC 40',
    value: 7948.45,
    change: 30.17,
    changePercent: 0.38,
    dayHigh: 7962.10,
    dayLow: 7905.33,
    yearHigh: 8259.19,
    yearLow: 7029.91,
    region: 'Europe',
  },
  {
    symbol: 'N225',
    name: 'Nikkei 225',
    value: 38787.02,
    change: -279.51,
    changePercent: -0.72,
    dayHigh: 39118.45,
    dayLow: 38702.11,
    yearHigh: 42426.77,
    yearLow: 31156.12,
    region: 'Asia',
  },
  {
    symbol: 'HSI',
    name: 'Hang Seng',
    value: 20891.62,
    change: 312.08,
    changePercent: 1.52,
    dayHigh: 20945.30,
    dayLow: 20520.77,
    yearHigh: 23241.74,
    yearLow: 14794.16,
    region: 'Asia',
  },
  {
    symbol: 'SSEC',
    name: 'Shanghai Composite',
    value: 3303.67,
    change: 18.94,
    changePercent: 0.58,
    dayHigh: 3310.22,
    dayLow: 3278.45,
    yearHigh: 3674.40,
    yearLow: 2689.70,
    region: 'Asia',
  },
  {
    symbol: 'KOSPI',
    name: 'KOSPI',
    value: 2521.92,
    change: -12.35,
    changePercent: -0.49,
    dayHigh: 2548.10,
    dayLow: 2515.40,
    yearHigh: 2886.05,
    yearLow: 2319.49,
    region: 'Asia',
  },
];

function generateHistory(baseValue: number, volatility: number): IndexHistoryPoint[] {
  const points: IndexHistoryPoint[] = [];
  let value = baseValue * 0.92;
  const now = new Date(2026, 1, 10);

  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyChange = (Math.random() - 0.48) * volatility * value;
    value = Math.max(value * 0.7, value + dailyChange);

    points.push({
      date: date.toISOString().split('T')[0],
      close: Math.round(value * 100) / 100,
    });
  }

  return points;
}

export const indexHistories: Record<string, IndexHistoryPoint[]> = {
  SPX: generateHistory(6025, 0.012),
  DJI: generateHistory(44556, 0.011),
  IXIC: generateHistory(19654, 0.015),
  RUT: generateHistory(2279, 0.014),
  VIX: generateHistory(16.54, 0.04),
  FTSE: generateHistory(8727, 0.010),
  DAX: generateHistory(21787, 0.013),
  CAC: generateHistory(7948, 0.011),
  N225: generateHistory(38787, 0.013),
  HSI: generateHistory(20891, 0.016),
  SSEC: generateHistory(3303, 0.012),
  KOSPI: generateHistory(2521, 0.013),
};
