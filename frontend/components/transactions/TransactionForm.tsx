"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";

interface Props {
  accountId: string;
  holdingId: string;
  holdingName: string;
  onSuccess: () => void;
  onClose: () => void;
}

const TRANSACTION_TYPES = ["buy", "sell", "dividend", "reward", "staking_earning"];
const TRADE_TYPES = ["buy", "sell"];

export default function TransactionForm({ accountId, holdingId, holdingName, onSuccess, onClose }: Props) {
  const [type, setType] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTradeType = TRADE_TYPES.includes(type);

  async function handleSubmit() {
    if (!totalValue) {
      setError("Total value is required");
      return;
    }
    if (isTradeType && (!quantity || !pricePerUnit)) {
      setError("Quantity and price per unit are required for buy/sell");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/api/v1/accounts/${accountId}/holdings/${holdingId}/transactions`, {
        transaction_type: type,
        quantity: isTradeType ? parseFloat(quantity) : null,
        price_per_unit: isTradeType ? parseFloat(pricePerUnit) : null,
        total_value: parseFloat(totalValue),
        transaction_date: date,
        notes: notes || null,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to log transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg-raised border border-border-subtle rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-text-primary font-semibold text-lg">Log Transaction</h2>
            <p className="text-text-secondary text-sm mt-0.5">{holdingName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Transaction type */}
          <div>
            <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {TRANSACTION_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    type === t
                      ? "bg-accent-violet text-white"
                      : "bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and price — only for buy/sell */}
          {isTradeType && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 bg-bg-surface border border-border-subtle rounded-lg px-3 font-mono text-sm text-text-primary outline-none focus:border-accent-violet transition-colors placeholder:text-text-secondary"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Price/Unit</label>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 bg-bg-surface border border-border-subtle rounded-lg px-3 font-mono text-sm text-text-primary outline-none focus:border-accent-violet transition-colors placeholder:text-text-secondary"
                />
              </div>
            </div>
          )}

          {/* Total value */}
          <div>
            <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Total Value</label>
            <input
              type="number"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              placeholder="0.00"
              className="w-full h-11 bg-bg-surface border border-border-subtle rounded-lg px-3 font-mono text-sm text-text-primary outline-none focus:border-accent-violet transition-colors placeholder:text-text-secondary"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 bg-bg-surface border border-border-subtle rounded-lg px-3 font-mono text-sm text-text-primary outline-none focus:border-accent-violet transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-text-secondary text-xs uppercase tracking-wider mb-2">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional note"
              className="w-full h-11 bg-bg-surface border border-border-subtle rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent-violet transition-colors placeholder:text-text-secondary"
            />
          </div>

          {error && <p className="text-loss text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 bg-accent-violet hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-lg transition-opacity"
          >
            {loading ? "Logging..." : "Log Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
