export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  region: 'US' | 'Europe' | 'Asia';
}

export interface IndexHistoryPoint {
  date: string;
  close: number;
}
