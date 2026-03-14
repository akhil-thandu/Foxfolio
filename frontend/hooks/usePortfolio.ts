import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface AccountSummary {
  id: string;
  name: string;
  account_type: string;
  currency: string;
  total_value_usd: number;
  total_value_inr: number;
}

export interface HoldingSummary {
  id: string;
  account_id: string;
  ticker: string;
  name: string;
  asset_type: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  currency: string;
  total_value: number;
  cost_basis: number;
  pnl: number;
  pnl_percent: number;
  price_fresh: boolean;
}

export interface PortfolioSummary {
  total_value_usd: number;
  total_value_inr: number;
  daily_change_usd: number | null;
  daily_change_percent: number | null;
  accounts: AccountSummary[];
  holdings: HoldingSummary[];
}

export interface SnapshotPoint {
  date?: string;
  timestamp?: string;
  value_usd: number;
  value_inr: number;
  twr?: number;
}

export function usePortfolioSummary() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/api/v1/portfolio/summary");
        setData(res.data.data);
      } catch (err) {
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { data, loading, error };
}

export function usePortfolioHistory(range: string) {
  const [data, setData] = useState<SnapshotPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/portfolio/history?range=${range}`);
        setData(res.data.data);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [range]);

  return { data, loading, error };
}
