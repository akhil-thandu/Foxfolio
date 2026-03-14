"use client";

import { useState } from "react";
import { RefreshCw, Clock } from "lucide-react";

export default function Topbar() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  return (
    <header className="h-16 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left — refresh indicator */}
      <div className="flex items-center gap-2 text-text-secondary text-sm">
        <Clock size={14} />
        <span className="font-mono text-xs">Last updated: --:--</span>
        <span className="flex items-center gap-1 text-xs text-accent-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block animate-pulse" />
          Live
        </span>
      </div>

      {/* Right — currency toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-bg-raised border border-border-subtle rounded-lg p-1">
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
              currency === "USD"
                ? "bg-accent-violet text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency("INR")}
            className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
              currency === "INR"
                ? "bg-accent-violet text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            INR
          </button>
        </div>
      </div>
    </header>
  );
}
