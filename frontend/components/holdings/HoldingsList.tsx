"use client";

import { useRouter } from "next/navigation";
import { HoldingSummary } from "@/hooks/usePortfolio";
import { usePortfolioStore } from "@/store/portfolio";

interface Props {
  holdings: HoldingSummary[];
  loading: boolean;
  accountType: string;
}

function formatValue(value: number, currency: "USD" | "INR") {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getAccountPath(accountType: string) {
  if (accountType === "indian_broker") return "indian";
  if (accountType === "robinhood") return "robinhood";
  if (accountType === "crypto") return "crypto";
  return "indian";
}

export default function HoldingsList({ holdings, loading, accountType }: Props) {
  const router = useRouter();
  const { currency } = usePortfolioStore();

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-bg-raised rounded-xl animate-pulse border border-border-subtle" />
        ))}
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-bg-surface border border-border-subtle rounded-xl">
        <p className="text-text-secondary text-sm">No holdings yet. Add one in Settings.</p>
      </div>
    );
  }

  const accountPath = getAccountPath(accountType);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-text-secondary text-xs uppercase tracking-wider border-b border-border-subtle">
            <th className="text-left pb-3 font-medium">Name</th>
            <th className="text-right pb-3 font-medium">Quantity</th>
            <th className="text-right pb-3 font-medium">Avg Cost</th>
            <th className="text-right pb-3 font-medium">Current</th>
            <th className="text-right pb-3 font-medium">Value</th>
            <th className="text-right pb-3 font-medium">P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const isPnlPositive = holding.pnl >= 0;
            const holdingCurrency = holding.currency as "USD" | "INR";

            return (
              <tr
                key={holding.id}
                onClick={() => router.push(`/accounts/${accountPath}/holdings/${holding.id}`)}
                className="border-b border-border-subtle hover:bg-bg-raised cursor-pointer transition-colors group"
              >
                <td className="py-4 pr-4">
                  <div className="font-medium text-text-primary group-hover:text-accent-cyan transition-colors">
                    {holding.name}
                  </div>
                  <div className="font-mono text-xs text-accent-cyan mt-0.5">{holding.ticker}</div>
                </td>
                <td className="py-4 text-right font-mono text-sm text-text-primary">
                  {holding.quantity.toLocaleString()}
                </td>
                <td className="py-4 text-right font-mono text-sm text-text-secondary">
                  {formatValue(holding.avg_buy_price, holdingCurrency)}
                </td>
                <td className="py-4 text-right font-mono text-sm text-text-primary">
                  {holding.current_price > 0
                    ? formatValue(holding.current_price, holdingCurrency)
                    : <span className="text-text-secondary">--</span>
                  }
                </td>
                <td className="py-4 text-right font-mono text-sm text-text-primary">
                  {formatValue(holding.total_value, holdingCurrency)}
                </td>
                <td className="py-4 text-right">
                  <div className={`font-mono text-sm ${isPnlPositive ? "text-profit" : "text-loss"}`}>
                    {isPnlPositive ? "+" : ""}{formatValue(holding.pnl, holdingCurrency)}
                  </div>
                  <div className={`font-mono text-xs ${isPnlPositive ? "text-profit" : "text-loss"}`}>
                    {isPnlPositive ? "+" : ""}{holding.pnl_percent.toFixed(2)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
