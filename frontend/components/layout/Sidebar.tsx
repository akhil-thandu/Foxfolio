"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bitcoin,
  IndianRupee,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: Briefcase,
    children: [
      { label: "Groww", href: "/accounts/indian", icon: IndianRupee },
      { label: "Robinhood", href: "/accounts/robinhood", icon: TrendingUp },
      { label: "Crypto", href: "/accounts/crypto", icon: Bitcoin },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`relative flex flex-col bg-bg-surface border-r border-border-subtle transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-6 ${collapsed ? "justify-center" : ""}`}>
        <span className="text-2xl">🦊</span>
        {!collapsed && (
          <span className="font-mono font-bold text-text-primary tracking-wide text-lg">
            FOXFOLIO
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group ${
                isActive(item.href)
                  ? "text-text-primary bg-bg-raised border-l-2 border-accent-violet"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>

            {/* Children */}
            {!collapsed && item.children && (
              <div className="ml-4 mt-1 space-y-1 border-l border-border-subtle pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      isActive(child.href)
                        ? "text-text-primary bg-bg-raised border-l-2 border-accent-violet"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
                    }`}
                  >
                    <child.icon size={15} className="shrink-0" />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border-subtle">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center w-full py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors ${
            collapsed ? "" : "gap-2"
          }`}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
