import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { HoldingSummary } from "@/hooks/usePortfolio";

export interface Transaction {
  id: string;
  holding_id: string;
  transaction_type: "buy" | "sell" | "dividend" | "reward" | "staking_earning";
  quantity: number | null;
  price_per_unit: number | null;
  total_value: number;
  transaction_date: string;
  notes: string | null;
  created_at: string;
}

export interface HoldingDetail {
  id: string;
  account_id: string;
  ticker: string;
  name: string;
  asset_type: string;
  quantity: number;
  avg_buy_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export function useAccountHoldings(accountId: string | null) {
  const [data, setData] = useState<HoldingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/accounts/${accountId}/holdings`);
      setData(res.data.data);
    } catch {
      setError("Failed to load holdings");
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useTransactions(accountId: string | null, holdingId: string | null) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!accountId || !holdingId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/accounts/${accountId}/holdings/${holdingId}/transactions`);
      setData(res.data.data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [accountId, holdingId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
