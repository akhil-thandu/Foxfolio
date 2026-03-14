"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolioSummary, usePortfolioHistory } from "@/hooks/usePortfolio";
import { usePortfolioStore } from "@/store/portfolio";
import PortfolioGraph from "@/components/charts/PortfolioGraph";
import Link from "next/link";

const TIME_RANGES = ["1H", "1D", "1W", "1M", "3M", "1Y", "ALL"];

function formatValue(value: number | null, currency: "USD" | "INR") {
  if (value === null || value === undefined) return "--";
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getAccountHref(accountType: string) {
  if (accountType === "indian_broker") return "/accounts/indian";
  if (accountType === "robinhood") return "/accounts/robinhood";
  if (accountType === "crypto") return "/accounts/crypto";
  return "/accounts";
}

export default function DashboardPage() {
  const [activeRange, setActiveRange] = useState("1M");
  const { currency } = usePortfolioStore();
  const { data: summary, loading: summaryLoading } = usePortfolioSummary();
  const { data: history, loading: historyLoading } = usePortfolioHistory(activeRange);

  const totalValue = currency === "USD"
    ? summary?.total_value_usd ?? null
    : summary?.total_value_inr ?? null;

  const dailyChange = currency === "USD"
    ? summary?.daily_change_usd ?? null
    : null;

  const dailyChangePct = summary?.daily_change_percent ?? null;
  const isPositive = dailyChange !== null ? dailyChange >= 0 : null;

  return (
    <div className="text-text-primary max-w-6xl">
      {/* Net worth */}
      <div className="mb-6">
        {summaryLoading ? (
          <div className="space-y-2">
            <div className="h-12 w-64 bg-bg-raised rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-bg-raised rounded-lg animate-pulse" />
          </div>
        ) : (
          <>
            <div className="font-mono text-5xl font-bold text-text-primary tracking-tight">
              {formatValue(totalValue, currency)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {dailyChange !== null ? (
                <>
                  {isPositive ? (
                    <TrendingUp size={16} className="text-profit" />
                  ) : (
                    <TrendingDown size={16} className="text-loss" />
                  )}
                  <span className={`font-mono text-sm ${isPositive ? "text-profit" : "text-loss"}`}>
                    {isPositive ? "+" : ""}{formatValue(dailyChange, currency)}
                  </span>
                  <span className={`font-mono text-sm ${isPositive ? "text-profit" : "text-loss"}`}>
                    ({isPositive ? "+" : ""}{dailyChangePct?.toFixed(2)}%)
                  </span>
                  <span className="text-text-secondary text-xs">today</span>
                </>
              ) : (
                <span className="text-text-secondary text-sm">Daily change available after first snapshot</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Time range tabs */}
      <div className="flex gap-1 mb-4">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeRange === range
                ? "bg-bg-raised text-accent-cyan border border-accent-cyan"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Portfolio graph */}
      <div className="mb-8">
        <PortfolioGraph
          data={history}
          currency={currency}
          loading={historyLoading}
        />
      </div>

      {/* Account summary cards */}
      <div>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Accounts</h2>
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-bg-raised rounded-xl animate-pulse border border-border-subtle" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary?.accounts.map((account) => {
              const value = currency === "USD" ? account.total_value_usd : account.total_value_inr;
              return (
                <Link
                  key={account.id}
                  href={getAccountHref(account.account_type)}
                  className="p-5 bg-bg-surface border border-border-subtle rounded-xl hover:border-accent-violet transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-text-secondary text-sm">{account.name}</span>
                    <span className="font-mono text-xs text-text-secondary bg-bg-raised px-2 py-0.5 rounded">
                      {account.currency}
                    </span>
                  </div>
                  <div className="font-mono text-xl font-semibold text-text-primary">
                    {formatValue(value, currency)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
