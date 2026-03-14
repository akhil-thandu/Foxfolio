import Link from "next/link";
import { TrendingUp, IndianRupee, Bitcoin } from "lucide-react";

const ACCOUNTS = [
  {
    name: "Groww",
    description: "Indian stocks on NSE/BSE",
    href: "/accounts/indian",
    icon: IndianRupee,
    currency: "INR",
  },
  {
    name: "Robinhood",
    description: "US stocks and ETFs",
    href: "/accounts/robinhood",
    icon: TrendingUp,
    currency: "USD",
  },
  {
    name: "Crypto",
    description: "Cryptocurrency via Ledger",
    href: "/accounts/crypto",
    icon: Bitcoin,
    currency: "USD",
  },
];

export default function AccountsPage() {
  return (
    <div className="text-text-primary">
      <h1 className="text-2xl font-bold mb-2">Accounts</h1>
      <p className="text-text-secondary text-sm mb-8">
        Select an account to view holdings and performance.
      </p>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        {ACCOUNTS.map((account) => (
          <Link
            key={account.href}
            href={account.href}
            className="flex items-center gap-4 p-6 bg-bg-surface border border-border-subtle rounded-xl hover:border-accent-violet transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-bg-raised flex items-center justify-center text-accent-cyan group-hover:text-accent-violet transition-colors">
              <account.icon size={22} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-text-primary">{account.name}</h2>
              <p className="text-text-secondary text-sm">{account.description}</p>
            </div>
            <div className="font-mono text-xs text-text-secondary bg-bg-raised px-2 py-1 rounded">
              {account.currency}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
