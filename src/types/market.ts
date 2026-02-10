export interface Instrument {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  history: HistoryPoint[];
}

export interface HistoryPoint {
  date: string;
  close: number;
}

export interface RatioPoint {
  date: string;
  value: number;
}

export interface DashboardData {
  lastUpdated: string;
  categories: {
    coreBenchmarks: Instrument[];
    fearCreditGauges: Instrument[];
    sectorInternals: Instrument[];
    macroCommodities: Instrument[];
  };
  ratios: {
    techVsStaples: RatioPoint[];
    equalWeightVsSP500: RatioPoint[];
  };
}

export type CategoryKey = keyof DashboardData['categories'];
