import { ReactNode, useMemo, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Tag,
  MessageSquare,
  BarChart3,
  Sparkles,
  Users,
  MapPin,
  ScanLine,
  Bell,
  Menu,
  X,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Tab } from '@/data';
import { ScanModal } from './Modal';

const NAV: { id: Tab; label: string; short: string; icon: typeof Search; blurb: string }[] = [
  { id: 'buy', label: 'Buy', short: 'Buy', icon: ShoppingBag, blurb: 'Local market and zip discovery' },
  { id: 'sell', label: 'Sell', short: 'Sell', icon: Tag, blurb: 'Storefront and listing workflow' },
  { id: 'msg', label: 'Messages', short: 'Msg', icon: MessageSquare, blurb: 'Buyer and seller conversations' },
  { id: 'price', label: 'Price', short: 'Price', icon: BarChart3, blurb: 'Market movers and tracking' },
  { id: 'oracle', label: 'Oracle', short: 'Oracle', icon: Sparkles, blurb: 'Forecasts and AI signals' },
  { id: 'crowd', label: 'Crowd', short: 'Crowd', icon: Users, blurb: 'Collector feed and discussion' },
];

const TAB_META: Record<Tab, { eyebrow: string; title: string; sub: string }> = {
  buy: {
    eyebrow: 'Local marketplace',
    title: 'Map-first card discovery',
    sub: 'Browse listings by zip, compare nearby sellers, and explore the peer-to-peer market visually.',
  },
  sell: {
    eyebrow: 'Seller workspace',
    title: 'Run your storefront',
    sub: 'Manage inventory, tune pricing, and convert buyer attention into local sales.',
  },
  msg: {
    eyebrow: 'Conversations',
    title: 'Keep deals moving',
    sub: 'Handle negotiations, pickups, and follow-ups in a desktop messaging workspace.',
  },
  price: {
    eyebrow: 'Market intelligence',
    title: 'Track movement across the market',
    sub: 'Follow gainers, drops, volume, and collection exposure from one central board.',
  },
  oracle: {
    eyebrow: 'AI assist',
    title: 'Forecast with context',
    sub: 'Use Oracle as a support layer on top of listings and market data, not as the main story.',
  },
  crowd: {
    eyebrow: 'Community',
    title: 'Follow the collector conversation',
    sub: 'Read local threads, shared forecasts, and card-specific discussion in one feed.',
  },
};

export function Layout({
  tab,
  setTab,
  children,
  onScan,
  search,
  setSearch,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  children: ReactNode;
  onScan: (name: string) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  const [scanOpen, setScanOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const current = useMemo(() => TAB_META[tab], [tab]);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="min-h-screen grid lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="hidden lg:flex lg:flex-col border-r border-border bg-[#171612]">
          <div className="h-20 px-6 border-b border-border flex items-center justify-between">
            <button onClick={() => setTab('buy')} className="tap flex items-center gap-3 text-left">
              <div className="w-11 h-11 rounded-2xl border border-accent/20 bg-accent/10 flex items-center justify-center">
                <img src="smol.png" alt="Lion Market" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <div className="font-semibold text-lg tracking-tight">Lion Market</div>
                <div className="text-xs text-text-faint">Marketplace, pricing, community</div>
              </div>
            </button>

            <button
              onClick={() => setScanOpen(true)}
              className="tap w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text"
            >
              <ScanLine size={18} />
            </button>
          </div>

          <div className="px-4 py-5 border-b border-border">
            <div className="flex items-center gap-2.5 rounded-[20px] border border-border bg-surface px-3.5 py-3">
              <Search size={16} className="text-text-faint shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards, sets, sellers, zip codes"
                className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
              />
            </div>

            <div className="mt-4 rounded-[20px] border border-border bg-surface px-4 py-3.5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-faint font-medium">
                <MapPin size={13} className="text-accent" />
                Active area
              </div>
              <div className="text-sm font-medium mt-2">Phoenix, AZ</div>
              <div className="text-xs text-text-muted mt-1">Buy should eventually drill down to exact zip polygons.</div>
            </div>
          </div>

          <nav className="px-3 py-4 flex-1 overflow-auto">
            <div className="text-[11px] uppercase tracking-[0.18em] text-text-faint font-semibold px-3 pb-2">
              Navigation
            </div>

            <div className="space-y-1.5">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = tab === n.id;

                return (
                  <button
                    key={n.id}
                    onClick={() => setTab(n.id)}
                    className={`tap w-full rounded-[22px] px-3.5 py-3 text-left transition ${
                      active
                        ? 'bg-accent text-accent-ink shadow-soft'
                        : 'text-text-muted hover:bg-surface hover:text-text'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                          active ? 'bg-accent-ink/10 text-accent-ink' : 'bg-surface-2 text-text-faint'
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm">{n.label}</span>
                          <ChevronRight size={15} className={active ? 'text-accent-ink/70' : 'text-text-faint'} />
                        </div>
                        <div className={`text-xs mt-1 leading-relaxed ${active ? 'text-accent-ink/80' : 'text-text-faint'}`}>
                          {n.blurb}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="px-4 py-4 border-t border-border">
            <div className="rounded-[22px] border border-border bg-surface p-4">
              <div className="text-sm font-semibold">Website mode</div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                The screenshots show a strong mobile product language. Desktop should keep the same brand feel but open
                it into a real workspace, especially for Buy, Price, and Crowd.
              </p>

              <button
                onClick={() => setTab('buy')}
                className="tap mt-4 w-full rounded-[18px] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink flex items-center justify-center gap-2"
              >
                <MapPin size={15} />
                Open local market
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur">
            <div className="h-16 px-4 lg:px-8 flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="lg:hidden tap w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text"
              >
                {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <button onClick={() => setTab('buy')} className="tap flex items-center gap-2.5 shrink-0 lg:hidden">
                <img src="smol.png" alt="Lion Market" className="w-8 h-8 object-contain" />
                <span className="font-bold text-[15px] tracking-tight">Lion Market</span>
              </button>

              <div className="hidden lg:flex min-w-0 flex-1 items-center gap-6">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-semibold">
                    {current.eyebrow}
                  </div>
                  <div className="text-lg font-semibold tracking-tight truncate">{current.title}</div>
                </div>

                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-2.5 rounded-[20px] border border-border bg-surface px-3.5 py-2.5">
                    <Search size={16} className="text-text-faint shrink-0" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search cards, sets, sellers, zip codes"
                      className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
                    />
                    <button
                      onClick={() => setScanOpen(true)}
                      className="tap rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent shrink-0"
                    >
                      Scan
                    </button>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-xs text-text-muted">
                  <MapPin size={13} className="text-accent" />
                  Phoenix, AZ
                </div>

                <button className="tap hidden sm:flex w-10 h-10 rounded-full border border-border bg-surface items-center justify-center text-text-muted hover:text-text">
                  <Bell size={17} />
                </button>

                <button
                  onClick={() => setTab('sell')}
                  className="tap hidden sm:flex rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink items-center gap-2"
                >
                  <Plus size={15} />
                  New listing
                </button>

                <div className="w-10 h-10 rounded-full border border-border bg-surface-3 text-accent font-semibold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                  <img src="smol.png" alt="Profile" className="w-5 h-5 object-contain" />
                </div>
              </div>
            </div>

            <div className="lg:hidden px-4 pb-3">
              <div className="flex items-center gap-2.5 rounded-[20px] border border-border bg-surface px-3.5 py-2.5">
                <Search size={16} className="text-text-faint shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cards, sellers, zip codes"
                  className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
                />
                <button
                  onClick={() => setScanOpen(true)}
                  className="tap rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent shrink-0"
                >
                  Scan
                </button>
              </div>
            </div>

            {mobileNavOpen && (
              <div className="lg:hidden border-t border-border px-3 py-3 bg-bg">
                <div className="grid grid-cols-2 gap-2">
                  {NAV.map((n) => {
                    const Icon = n.icon;
                    const active = tab === n.id;

                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          setTab(n.id);
                          setMobileNavOpen(false);
                        }}
                        className={`tap rounded-[20px] px-3 py-3 text-left ${
                          active ? 'bg-accent text-accent-ink' : 'bg-surface text-text-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={16} />
                          <span className="text-sm font-medium">{n.label}</span>
                        </div>
                        <div className={`text-xs mt-1 ${active ? 'text-accent-ink/80' : 'text-text-faint'}`}>
                          {n.blurb}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 min-w-0">
            <section className="hidden lg:block px-8 pt-6">
              <div className="rounded-[28px] border border-border bg-surface px-6 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-text-faint font-semibold">
                      {current.eyebrow}
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight mt-1">{current.title}</h1>
                    <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">{current.sub}</p>
                  </div>

                  {tab === 'buy' ? (
                    <div className="hidden xl:flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-2 text-xs text-text-muted shrink-0">
                      <MapPin size={13} className="text-accent" />
                      Zip boundary map belongs here
                    </div>
                  ) : (
                    <div className="hidden xl:flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-2 text-xs text-text-muted shrink-0">
                      Desktop workspace
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="px-4 lg:px-8 py-4 lg:py-6 pb-24 lg:pb-8">
              <div className="mx-auto w-full max-w-[1600px]">{children}</div>
            </section>
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-bg via-bg/95 to-transparent">
        <div className="mx-auto max-w-xl rounded-[28px] border border-border bg-[#151410]/95 backdrop-blur px-2 py-1.5 shadow-soft">
          <div className="flex items-center justify-between gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = tab === n.id;

              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className={`tap flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-[22px] px-2 py-2 ${
                    active ? 'bg-accent/18 text-accent' : 'text-text-faint'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[11px] font-medium truncate">{n.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onResult={onScan} />
    </div>
  );
}