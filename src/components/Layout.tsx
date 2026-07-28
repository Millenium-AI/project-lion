import { ReactNode, useState } from 'react';
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
} from 'lucide-react';
import { Tab } from '@/data';
import { ScanModal } from './Modal';

const SIDEBAR_WIDTH = 248;
const ACTIVE_AREA = 'Miami, FL';

type NavItem = { id: Tab; label: string; short: string; icon: typeof Search; blurb: string };

const NAV: NavItem[] = [
  { id: 'buy', label: 'Buy', short: 'Buy', icon: ShoppingBag, blurb: 'Local market and zip discovery' },
  { id: 'sell', label: 'Sell', short: 'Sell', icon: Tag, blurb: 'Storefront and listing workflow' },
  { id: 'msg', label: 'Messages', short: 'Msg', icon: MessageSquare, blurb: 'Buyer and seller conversations' },
  { id: 'price', label: 'Price', short: 'Price', icon: BarChart3, blurb: 'Market movers and tracking' },
  { id: 'oracle', label: 'Oracle', short: 'Oracle', icon: Sparkles, blurb: 'Forecasts and AI signals' },
  { id: 'crowd', label: 'Crowd', short: 'Crowd', icon: Users, blurb: 'Collector feed and discussion' },
];

interface LayoutProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  children: ReactNode;
  onScan: (name: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export function Layout({ tab, setTab, children, onScan, search, setSearch }: LayoutProps) {
  const [scanOpen, setScanOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <DesktopSidebar
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
        onOpenScan={() => setScanOpen(true)}
      />

      <div className="lg:pl-[248px] flex flex-col min-h-screen">
        <MobileHeader
          tab={tab}
          setTab={setTab}
          search={search}
          setSearch={setSearch}
          navOpen={mobileNavOpen}
          setNavOpen={setMobileNavOpen}
          onOpenScan={() => setScanOpen(true)}
        />

        <main className="flex-1 min-w-0">
          <section className="px-3 lg:px-5 py-3 lg:py-4 pb-20 lg:pb-6">
            <div className="mx-auto w-full max-w-[1360px]">{children}</div>
          </section>
        </main>
      </div>

      <MobileTabBar tab={tab} setTab={setTab} />
      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onResult={onScan} />
    </div>
  );
}

function DesktopSidebar({
  tab,
  setTab,
  search,
  setSearch,
  onOpenScan,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  search: string;
  setSearch: (v: string) => void;
  onOpenScan: () => void;
}) {
  return (
    <aside
      className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-30 border-r border-border bg-[#171612]"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="h-16 px-4 border-b border-border flex items-center">
        <button onClick={() => setTab('buy')} className="tap flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl border border-accent/20 bg-accent/10 flex items-center justify-center shrink-0">
            <img src="smol.png" alt="Lion Market" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-semibold text-base tracking-tight truncate">Lion Market</span>
        </button>
      </div>

      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <button
          onClick={onOpenScan}
          className="tap flex-1 flex items-center justify-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent"
        >
          <ScanLine size={14} />
          Scan
        </button>

        <button className="tap w-9 h-9 shrink-0 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text">
          <Bell size={15} />
        </button>

        <button
          onClick={() => setTab('buy')}
          className="tap w-9 h-9 shrink-0 rounded-full border border-border bg-surface-3 flex items-center justify-center overflow-hidden"
        >
          <img src="smol.png" alt="Profile" className="w-4 h-4 object-contain" />
        </button>
      </div>

      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
          <Search size={15} className="text-text-faint shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards, sets, sellers, zip codes"
            className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
          />
        </div>

        <div className="mt-3 rounded-xl border border-border bg-surface px-3.5 py-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-text-faint font-medium">
            <MapPin size={12} className="text-accent" />
            Active area
          </div>
          <div className="text-sm font-medium mt-1.5">{ACTIVE_AREA}</div>
          <div className="text-[11px] text-text-muted mt-1">Showing listings within 15 miles. Change area anytime.</div>
        </div>
      </div>

      <nav className="px-4 py-4 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[0.16em] text-text-faint font-semibold pb-2">
          Navigation
        </div>

        <div className="space-y-1">
          {NAV.map((n) => (
            <NavButton key={n.id} item={n} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="rounded-xl border border-border bg-surface p-3.5">
          <div className="text-sm font-semibold">Quick scan</div>
          <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
            Scan a card to check local listings, live pricing, and Oracle forecasts in one pass.
          </p>

          <button
            onClick={onOpenScan}
            className="tap mt-3 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-ink flex items-center justify-center gap-2"
          >
            <ScanLine size={14} />
            Scan a card
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`tap w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150 ${
        active ? 'bg-accent text-accent-ink' : 'text-text-muted hover:bg-surface hover:text-text'
      }`}
    >
      <Icon size={16} className={active ? 'text-accent-ink' : 'text-text-faint'} />
      {item.label}
    </button>
  );
}

function MobileHeader({
  tab,
  setTab,
  search,
  setSearch,
  navOpen,
  setNavOpen,
  onOpenScan,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  search: string;
  setSearch: (v: string) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  onOpenScan: () => void;
}) {
  return (
    <header className="lg:hidden sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur">
      <div className="h-14 px-3 flex items-center gap-3">
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="tap w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text"
        >
          {navOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        <button onClick={() => setTab('buy')} className="tap flex items-center gap-2 shrink-0">
          <img src="smol.png" alt="Lion Market" className="w-7 h-7 object-contain" />
          <span className="font-bold text-sm tracking-tight">Lion Market</span>
        </button>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[11px] text-text-muted">
            <MapPin size={12} className="text-accent" />
            {ACTIVE_AREA}
          </div>

          <button className="tap w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text">
            <Bell size={16} />
          </button>
        </div>
      </div>

      <div className="px-3 pb-2.5">
        <div className="flex items-center gap-2 rounded-[16px] border border-border bg-surface px-3 py-2.5">
          <Search size={15} className="text-text-faint shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards, sellers, zip codes"
            className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
          />
          <button
            onClick={onOpenScan}
            className="tap rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1.5 text-[11px] font-semibold text-accent shrink-0"
          >
            Scan
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="border-t border-border px-3 py-3 bg-bg">
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = tab === n.id;

              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setTab(n.id);
                    setNavOpen(false);
                  }}
                  className={`tap rounded-[16px] px-3 py-2.5 text-left ${
                    active ? 'bg-accent text-accent-ink' : 'bg-surface text-text-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={15} />
                    <span className="text-sm font-medium">{n.label}</span>
                  </div>
                  <div className={`text-[11px] mt-1 ${active ? 'text-accent-ink/80' : 'text-text-faint'}`}>
                    {n.blurb}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileTabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-bg via-bg/95 to-transparent">
      <div className="mx-auto max-w-lg rounded-[22px] border border-border bg-[#151410]/95 backdrop-blur px-2 py-1.5 shadow-soft">
        <div className="flex items-center justify-between gap-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;

            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`tap flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-[16px] px-2 py-1.5 ${
                  active ? 'bg-accent/18 text-accent' : 'text-text-faint'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium truncate">{n.short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
