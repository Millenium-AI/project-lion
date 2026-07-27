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
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Tab } from '@/data';
import { ScanModal } from './Modal';

const SIDEBAR_WIDTH = 280;
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

      <div className="lg:pl-[280px] flex flex-col min-h-screen">
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
          <section className="px-4 lg:px-8 py-4 lg:py-6 pb-24 lg:pb-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </section>
        </main>
      </div>

      <MobileTabBar tab={tab} setTab={setTab} />
      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onResult={onScan} />
    </div>
  );
}

/**
 * Persistent left sidebar for desktop. Fixed (not scrolled or sticky-in-grid) so it
 * never shifts, jumps, or scrolls out of view as page content changes height.
 * Owns search, active-area context, primary navigation, and the account/utility
 * actions that used to live in a separate top header bar.
 */
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
      <div className="h-20 px-6 border-b border-border flex items-center justify-between">
        <button onClick={() => setTab('buy')} className="tap flex items-center gap-3 text-left min-w-0">
          <div className="w-11 h-11 rounded-2xl border border-accent/20 bg-accent/10 flex items-center justify-center shrink-0">
            <img src="smol.png" alt="Lion Market" className="w-6 h-6 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-lg tracking-tight truncate">Lion Market</div>
            <div className="text-xs text-text-faint truncate">Marketplace, pricing, community</div>
          </div>
        </button>
      </div>

      <div className="px-4 py-4 border-b border-border flex items-center gap-2">
        <button
          onClick={onOpenScan}
          className="tap flex-1 flex items-center justify-center gap-2 rounded-[16px] border border-accent/20 bg-accent/10 px-3 py-2.5 text-xs font-semibold text-accent"
        >
          <ScanLine size={15} />
          Scan
        </button>

        <button className="tap w-10 h-10 shrink-0 rounded-[16px] border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text">
          <Bell size={16} />
        </button>

        <button
          onClick={() => setTab('sell')}
          className="tap w-10 h-10 shrink-0 rounded-[16px] bg-accent flex items-center justify-center text-accent-ink"
        >
          <Plus size={16} />
        </button>

        <div className="w-10 h-10 shrink-0 rounded-[16px] border border-border bg-surface-3 flex items-center justify-center overflow-hidden">
          <img src="smol.png" alt="Profile" className="w-5 h-5 object-contain" />
        </div>
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
          <div className="text-sm font-medium mt-2">{ACTIVE_AREA}</div>
          <div className="text-xs text-text-muted mt-1">Showing listings within 15 miles. Change area anytime.</div>
        </div>
      </div>

      <nav className="px-3 py-4 flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-text-faint font-semibold px-3 pb-2">
          Navigation
        </div>

        <div className="space-y-1.5">
          {NAV.map((n) => (
            <NavButton key={n.id} item={n} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="rounded-[22px] border border-border bg-surface p-4">
          <div className="text-sm font-semibold">Quick scan</div>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            Scan a card to check local listings, live pricing, and Oracle forecasts in one pass.
          </p>

          <button
            onClick={onOpenScan}
            className="tap mt-4 w-full rounded-[18px] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink flex items-center justify-center gap-2"
          >
            <ScanLine size={15} />
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
      className={`tap w-full rounded-[22px] px-3.5 py-3 text-left transition-colors duration-150 ${
        active ? 'bg-accent text-accent-ink shadow-soft' : 'text-text-muted hover:bg-surface hover:text-text'
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
            <span className="font-medium text-sm">{item.label}</span>
            <ChevronRight size={15} className={active ? 'text-accent-ink/70' : 'text-text-faint'} />
          </div>
          <div className={`text-xs mt-1 leading-relaxed ${active ? 'text-accent-ink/80' : 'text-text-faint'}`}>
            {item.blurb}
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * Mobile-only top bar. Desktop has no equivalent — the sidebar already owns
 * search, navigation, and account actions, so a second top bar on desktop
 * would just duplicate it and waste vertical space.
 */
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
      <div className="h-16 px-4 flex items-center gap-3">
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="tap w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text"
        >
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <button onClick={() => setTab('buy')} className="tap flex items-center gap-2.5 shrink-0">
          <img src="smol.png" alt="Lion Market" className="w-8 h-8 object-contain" />
          <span className="font-bold text-[15px] tracking-tight">Lion Market</span>
        </button>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-xs text-text-muted">
            <MapPin size={13} className="text-accent" />
            {ACTIVE_AREA}
          </div>

          <button className="tap w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text">
            <Bell size={17} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 rounded-[20px] border border-border bg-surface px-3.5 py-2.5">
          <Search size={16} className="text-text-faint shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards, sellers, zip codes"
            className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
          />
          <button
            onClick={onOpenScan}
            className="tap rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent shrink-0"
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
  );
}

function MobileTabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
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
  );
}
