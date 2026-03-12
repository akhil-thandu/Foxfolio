export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      <aside className="w-60 bg-bg-surface border-r border-border-subtle">
        <div className="p-6">
          <span className="text-text-primary font-mono font-bold">🦊 FOXFOLIO</span>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
