export interface User {
  id: string;
  username: string;
}

export interface Account {
  id: string;
  name: string;
  account_type: 'indian_broker' | 'robinhood' | 'crypto';
  currency: 'USD' | 'INR';
  total_value_usd?: number;
  total_value_inr?: number;
}

export interface Holding {
  id: string;
  account_id: string;
  ticker: string;
  name: string;
  asset_type: 'stock' | 'etf' | 'crypto';
  quantity: number;
  avg_buy_price: number;
  currency: string;
  current_price?: number;
  total_value?: number;
  pnl?: number;
  pnl_percent?: number;
}

export interface Transaction {
  id: string;
  holding_id: string;
  transaction_type: 'buy' | 'sell' | 'dividend' | 'reward' | 'staking_earning';
  quantity?: number;
  price_per_unit?: number;
  total_value: number;
  transaction_date: string;
  notes?: string;
}

export interface PortfolioSummary {
  total_value_usd: number;
  total_value_inr: number;
  daily_change_usd: number;
  daily_change_percent: number;
  prices_fresh: boolean;
}

export interface SnapshotPoint {
  date: string;
  value: number;
  twr: number;
}
