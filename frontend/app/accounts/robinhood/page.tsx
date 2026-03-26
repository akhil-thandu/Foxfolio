"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Wallet,
  ReceiptText,
  Settings,
  Home,
  PieChart,
  History,
  Plus,
} from "lucide-react";
import styles from "./robinhood.module.css";

/* ──────────────────────────────────────────────
   DUMMY DATA — replace with API calls later
   TODO: fetch from /api/v1/accounts/{id}/holdings
   TODO: fetch from /api/v1/portfolio/summary
   TODO: fetch from /api/v1/portfolio/snapshots
   ────────────────────────────────────────────── */

interface HoldingItem {
  ticker: string;
  name: string;
  category: string;
  currentValue: number;
  dailyChangePercent: number;
  badgeColor: "violet" | "cyan" | "green" | "purple";
}

interface PortfolioData {
  totalValue: number;
  dailyChangeUsd: number;
  dailyChangePercent: number;
  isPositive: boolean;
}

const DUMMY_PORTFOLIO: PortfolioData = {
  totalValue: 142840.62,
  dailyChangeUsd: 3241.15,
  dailyChangePercent: 2.32,
  isPositive: true,
};

const DUMMY_HOLDINGS: HoldingItem[] = [
  { ticker: "AAPL", name: "Apple Inc.", category: "Technology", currentValue: 42192.5, dailyChangePercent: 1.24, badgeColor: "violet" },
  { ticker: "NVDA", name: "Nvidia Corp.", category: "Semiconductors", currentValue: 38210.0, dailyChangePercent: 4.12, badgeColor: "cyan" },
  { ticker: "BTC", name: "Bitcoin", category: "Cryptocurrency", currentValue: 28500.12, dailyChangePercent: -0.85, badgeColor: "green" },
  { ticker: "TSLA", name: "Tesla, Inc.", category: "Automotive", currentValue: 15410.8, dailyChangePercent: -2.3, badgeColor: "purple" },
];

const DUMMY_TOTAL_ASSETS = 42;

const TIME_RANGES = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;

const SORT_COLUMNS = [
  "Ticker",
  "Stock Name",
  "Shares",
  "Avg Cost",
  "Current Value",
  "Total Return",
  "Total % Return",
  "Today's Return",
] as const;

/* ── Helpers ── */

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function splitDollars(value: number): { dollars: string; cents: string } {
  const parts = formatCurrency(value).split(".");
  return { dollars: parts[0], cents: parts[1] };
}

/* ── Badge color mapping ── */
const BADGE_STYLE: Record<HoldingItem["badgeColor"], string> = {
  violet: styles.tickerBadge,
  cyan: styles.tickerBadgeCyan,
  green: styles.tickerBadgeGreen,
  purple: styles.tickerBadgePurple,
};

/* ── Nav tabs ── */
const NAV_TABS = [
  { label: "Portfolio", icon: Wallet, active: true },
  { label: "Transactions", icon: ReceiptText, active: false },
  { label: "Settings", icon: Settings, active: false },
] as const;

/* ── Component ── */

export default function RobinhoodPage() {
  const [selectedRange, setSelectedRange] = useState<string>("3M");
  const [activeSorts, setActiveSorts] = useState<Set<string>>(new Set(["Ticker", "Current Value"]));

  // TODO: Replace with real data from API
  const portfolio = DUMMY_PORTFOLIO;
  const holdings = DUMMY_HOLDINGS;
  const totalAssets = DUMMY_TOTAL_ASSETS;

  const { dollars, cents } = splitDollars(portfolio.totalValue);

  const toggleSort = (col: string) => {
    setActiveSorts((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      {/* ── Top Navigation Bar ── */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>
            <span className={styles.navLogo}>Foxfolio</span>
            <span className={styles.navSubtitle}>Robinhood</span>
          </div>
          <nav className={styles.navLinks}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab.label}
                className={tab.active ? styles.navLinkActive : styles.navLink}
              >
                <tab.icon className={styles.navIcon} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className={styles.main}>
        {/* ── Portfolio Summary ── */}
        <section className={styles.summarySection}>
          <div className={styles.summaryRow}>
            <div>
              <span className={styles.label}>Total Net Worth</span>
              <h2 className={styles.totalValue}>
                ${dollars}<span className={styles.totalCents}>.{cents}</span>
              </h2>
              <div className={styles.changeRow}>
                {portfolio.isPositive ? (
                  <span className={styles.changePositive}>
                    <TrendingUp className={styles.changeIcon} />
                    +${formatCurrency(portfolio.dailyChangeUsd)} ({portfolio.dailyChangePercent}%)
                  </span>
                ) : (
                  <span className={styles.changeNegative}>
                    <TrendingDown className={styles.changeIcon} />
                    -${formatCurrency(Math.abs(portfolio.dailyChangeUsd))} ({Math.abs(portfolio.dailyChangePercent)}%)
                  </span>
                )}
                <span className={styles.changePeriod}>Today</span>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className={styles.timeRangeGroup}>
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  className={selectedRange === range ? styles.timeBtnActive : styles.timeBtn}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart — TODO: replace SVG placeholder with Recharts using snapshot data */}
          <div className={styles.chartContainer}>
            <svg className={styles.chartSvg} viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#7B4FFF", stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: "#7B4FFF", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path
                d="M0,250 C100,240 150,280 250,230 C350,180 400,220 500,140 C600,60 650,100 750,70 C850,40 900,60 1000,20"
                fill="none"
                stroke="#7B4FFF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0,250 C100,240 150,280 250,230 C350,180 400,220 500,140 C600,60 650,100 750,70 C850,40 900,60 1000,20 L1000,300 L0,300 Z"
                fill="url(#chartGradient)"
              />
            </svg>
            <div className={styles.chartTooltip}>
              <div className={styles.tooltipCard}>
                <p className={styles.tooltipDate}>Oct 24, 2023</p>
                <p className={styles.tooltipValue}>$124,512.10</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Assets Section ── */}
        <section className={styles.assetsSection}>
          <div>
            <div className={styles.assetsHeader}>
              <h3 className={styles.assetsTitle}>Assets</h3>
            </div>

            {/* Sort/Filter Pills */}
            <div className={styles.filterPills}>
              {SORT_COLUMNS.map((col) => (
                <button
                  key={col}
                  className={activeSorts.has(col) ? styles.filterPillActive : styles.filterPill}
                  onClick={() => toggleSort(col)}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Holdings Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.holdingsTable}>
              <thead>
                <tr className={styles.tableHead}>
                  <th>Ticker</th>
                  <th>Current Value</th>
                  <th className={styles.actionsCol}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.ticker} className={styles.holdingRow}>
                    <td>
                      <div className={styles.tickerInfo}>
                        <div className={BADGE_STYLE[holding.badgeColor]}>
                          {holding.ticker}
                        </div>
                        <div>
                          <p className={styles.holdingName}>{holding.name}</p>
                          <p className={styles.holdingCategory}>{holding.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.valueCell}>
                      <p className={styles.holdingValue}>${formatCurrency(holding.currentValue)}</p>
                      <p className={holding.dailyChangePercent >= 0 ? styles.holdingChangePositive : styles.holdingChangeNegative}>
                        {holding.dailyChangePercent >= 0 ? "+" : ""}
                        {holding.dailyChangePercent.toFixed(2)}%
                      </p>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.moreBtn}>
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.viewAllRow}>
              <button className={styles.viewAllBtn}>
                View All {totalAssets} Assets
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={styles.mobileNav}>
        <button className={styles.mobileNavLinkActive}>
          <Home className={styles.mobileNavIcon} />
          <span className={styles.mobileNavLabel}>Home</span>
        </button>
        <button className={styles.mobileNavLink}>
          <PieChart className={styles.mobileNavIcon} />
          <span className={styles.mobileNavLabel}>Assets</span>
        </button>
        <button className={styles.mobileNavLink}>
          <History className={styles.mobileNavIcon} />
          <span className={styles.mobileNavLabel}>Activity</span>
        </button>
      </nav>

      {/* ── Floating Action Button (Mobile) ── */}
      <button className={styles.fab}>
        <Plus className={styles.fabIcon} />
      </button>
    </div>
  );
}
