"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { usePortfolioSummary } from "@/hooks/usePortfolio";
import { useTransactions } from "@/hooks/useHoldings";
import { usePortfolioStore } from "@/store/portfolio";
import TransactionForm from "@/components/transactions/TransactionForm";

function formatValue(value: number, currency: string) {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getAccountId(accounts: any[], accountType: string) {
  const typeMap: Record<string, string> = {
    indian: "indian_broker",
    robinhood: "robinhood",
    crypto: "crypto",
  };
  return accounts.find((a) => a.account_type === typeMap[accountType])?.id || null;
}

export default function HoldingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountType = params.accountType as string;
  const holdingId = params.holdingId as string;
  const { currency } = usePortfolioStore();
  const [showForm, setShowForm] = useState(false);

  const { data: summary, loading: summaryLoading } = usePortfolioSummary();

  const accountId = summary ? getAccountId(summary.accounts, accountType) : null;
  const holding = summary?.holdings.find((h) => h.id === holdingId);

  const { data: transactions, loading: txLoading, refetch } = useTransactions(accountId, holdingId);

  if (summaryLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-bg-raised rounded animate-pulse" />
        <div className="h-32 bg-bg-raised rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!holding) {
    return (
      <div className="text-text-secondary">
        <p>Holding not found.</p>
      </div>
    );
  }

  const isPnlPositive = holding.pnl >= 0;
  const holdingCurrency = holding.currency;

  return (
    <div className="text-text-primary max-w-3xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Holding header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{holding.name}</h1>
          <span className="font-mono text-accent-cyan text-sm">{holding.ticker}</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-violet hover:opacity-90 text-white text-sm font-medium rounded-lg transition-opacity"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Holding stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Quantity", value: holding.quantity.toLocaleString(), mono: true },
          { label: "Avg Cost", value: formatValue(holding.avg_buy_price, holdingCurrency), mono: true },
          { label: "Current Price", value: holding.current_price > 0 ? formatValue(holding.current_price, holdingCurrency) : "--", mono: true },
          { label: "Total Value", value: formatValue(holding.total_value, holdingCurrency), mono: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-surface border border-border-subtle rounded-xl p-4">
            <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="font-mono text-text-primary font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* P&L */}
      <div className={`p-4 rounded-xl border mb-8 ${isPnlPositive ? "border-profit/30 bg-profit/5" : "border-loss/30 bg-loss/5"}`}>
        <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total P&L</div>
        <div className={`font-mono text-2xl font-bold ${isPnlPositive ? "text-profit" : "text-loss"}`}>
          {isPnlPositive ? "+" : ""}{formatValue(holding.pnl, holdingCurrency)}
        </div>
        <div className={`font-mono text-sm ${isPnlPositive ? "text-profit" : "text-loss"}`}>
          {isPnlPositive ? "+" : ""}{holding.pnl_percent.toFixed(2)}%
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">Transaction History</h2>
        {txLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-bg-raised rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center h-24 bg-bg-surface border border-border-subtle rounded-xl">
            <p className="text-text-secondary text-sm">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-bg-surface border border-border-subtle rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                    tx.transaction_type === "buy" ? "bg-profit/10 text-profit" :
                    tx.transaction_type === "sell" ? "bg-loss/10 text-loss" :
                    "bg-accent-violet/10 text-accent-violet"
                  }`}>
                    {tx.transaction_type.replace("_", " ")}
                  </span>
                  <span className="text-text-secondary text-sm font-mono">{tx.transaction_date}</span>
                  {tx.notes && <span className="text-text-secondary text-xs">{tx.notes}</span>}
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-text-primary">
                    {formatValue(tx.total_value, holdingCurrency)}
                  </div>
                  {tx.quantity && (
                    <div className="font-mono text-xs text-text-secondary">
                      {tx.quantity} @ {formatValue(tx.price_per_unit!, holdingCurrency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction form modal */}
      {showForm && accountId && (
        <TransactionForm
          accountId={accountId}
          holdingId={holdingId}
          holdingName={holding.name}
          onSuccess={refetch}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
