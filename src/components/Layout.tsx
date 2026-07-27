import { ReactNode, useState } from 'react';
import { Search, ShoppingBag, Tag, MessageSquare, BarChart3, Sparkles, Users, MapPin, ScanLine } from 'lucide-react';
import { Tab } from '@/data';
import { ScanModal } from './Modal';

const NAV: { id: Tab; label: string; icon: typeof Search }[] = [
  { id: 'buy', label: 'Buy', icon: ShoppingBag },
  { id: 'sell', label: 'Sell', icon: Tag },
  { id: 'msg', label: 'Messages', icon: MessageSquare },
  { id: 'price', label: 'Price', icon: BarChart3 },
  { id: 'oracle', label: 'Oracle', icon: Sparkles },
  { id: 'crowd', label: 'Crowd', icon: Users },
];

export function Layout({
  tab, setTab, children, onScan, search, setSearch,
}: {
  tab: Tab; setTab: (t: Tab) => void; children: ReactNode;
  onScan: (name: string) => void;
  search: string; setSearch: (v: string) => void;
}) {
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top header — website style */}
      <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <button onClick={() => setTab('buy')} className="flex items-center gap-2.5 shrink-0">
            <img src="/smol.png" alt="Lion Market" className="w-8 h-8" />
            <span className="font-bold text-[15px] tracking-tight hidden sm:block">Lion Market</span>
          </button>

          {/* Global search */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2.5 bg-surface border border-border px-3.5 py-2">
              <Search size={16} className="text-text-faint shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards, sets, sellers…"
                className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-text-faint"
              />
              <button onClick={() => setScanOpen(true)} className="tap text-accent hover:text-accent-strong text-xs font-medium shrink-0 flex items-center gap-1">
                <ScanLine size={14} /> Scan
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted shrink-0">
            <MapPin size={14} className="text-accent" /> Phoenix, AZ
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-surface-3 text-accent font-semibold text-sm flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/smol.png" alt="Profile" className="w-5 h-5 object-contain" />
          </div>
        </div>

        {/* Section nav — horizontal tabs (desktop) */}
        <nav className="hidden lg:block border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 flex items-center">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = tab === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className={`tap flex items-center gap-2 px-4 py-2.5 text-sm font-medium relative ${
                    active ? 'text-text' : 'text-text-faint hover:text-text-muted'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-accent' : ''} />
                  {n.label}
                  {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Content — no sidebar */}
      <main className="px-4 lg:px-8 py-6 pb-24 lg:pb-12">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-bg/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-around px-1 py-1.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`tap flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg ${
                  active ? 'text-accent' : 'text-text-faint'
                }`}
              >
                <Icon size={19} />
                <span className="text-[10px] font-medium">{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onResult={onScan} />
    </div>
  );
}
