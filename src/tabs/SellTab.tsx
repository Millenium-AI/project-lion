import { useState } from 'react';
import { Plus, Copy, Pencil, Check, TrendingUp, Store, Eye, Bookmark, Tag as TagIcon, MoreHorizontal } from 'lucide-react';
import { myListings, MyListing, shopStats } from '@/data';
import { Pill, SearchBar, Card, Tag, StatCard, PageHeader, EmptyState } from '@/components/ui';

export function SellTab() {
  const [seg, setSeg] = useState<'live' | 'hidden' | 'sold'>('live');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(myListings);

  const counts = {
    live: items.filter((i) => i.status === 'live').length,
    hidden: items.filter((i) => i.status === 'hidden').length,
    sold: items.filter((i) => i.status === 'sold').length,
  };
  const filtered = items.filter((i) => i.status === seg && (!search || i.name.toLowerCase().includes(search.toLowerCase())));
  const markSold = (id: string) => setItems((p) => p.map((i) => i.id === id ? { ...i, status: 'sold' } : i));

  return (
    <div className="animate-fade">
      <PageHeader
        title="Your Shop"
        sub="Manage your inventory and shop profile"
        action={<button className="tap text-sm text-text-muted hover:text-text flex items-center gap-1.5"><Store size={15} /> Edit shop</button>}
      />

      {/* Shop header bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-surface-3 text-accent font-semibold flex items-center justify-center">
            <Store size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Lion Collector</div>
            <div className="text-xs text-text-muted">@lionphx · {shopStats.rating}★ · {shopStats.sales} sales</div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <Metric label="Rating" value={`${shopStats.rating}★`} />
            <Metric label="Total sales" value={`${shopStats.sales}`} />
            <Metric label="Revenue" value={`$${shopStats.revenue.toLocaleString()}`} />
          </div>
        </div>
      </Card>

      {/* Dashboard stats */}
      <div className="grid grid-cols-3 gap-px bg-border rounded-card overflow-hidden mb-6">
        <StatCard label="Views" value="4,288" sub="+12% this week" tone="gold" />
        <StatCard label="Saves" value="95" sub="+8 this week" />
        <StatCard label="Offers" value="11" sub="3 pending" tone="positive" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-0 border-b border-border">
          {(['live', 'hidden', 'sold'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className={`tap px-4 py-2.5 text-sm font-medium capitalize relative ${seg === s ? 'text-text' : 'text-text-faint hover:text-text-muted'}`}
            >
              {s}
              <span className="ml-1.5 text-xs text-text-faint">{counts[s]}</span>
              {seg === s && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search your listings" size="sm" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<TagIcon size={26} />}
          title={`No ${seg} listings`}
          sub={seg === 'live' ? 'Create a new listing to start selling.' : `You have no ${seg} listings right now.`}
          action={seg === 'live' ? <button className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-2.5 text-sm">New listing</button> : undefined}
        />
      ) : (
        <div className="rounded-card border border-border overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_100px_80px_80px_80px_40px] gap-3 px-4 py-2.5 bg-surface-2 text-[11px] uppercase tracking-wider text-text-faint font-medium border-b border-border">
            <div>Card</div>
            <div className="text-right">Price</div>
            <div className="text-right">Views</div>
            <div className="text-right">Saves</div>
            <div className="text-right">Offers</div>
            <div></div>
          </div>
          {filtered.map((m) => <MyListingRow key={m.id} m={m} onSold={() => markSold(m.id)} />)}
        </div>
      )}

      {/* Meetup prefs */}
      <Card className="p-4 mt-6">
        <div className="text-sm font-semibold mb-3">Meetup preferences</div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Tag tone="gold">Tempe Marketplace</Tag>
          <Tag tone="gold">Scottsdale Fashion Square</Tag>
          <button className="tap text-xs text-text-faint hover:text-text-muted">+ Add spot</button>
        </div>
        <div className="text-xs text-text-faint pt-3 border-t border-border">Cash, Venmo, Zelle · Weekends after 12pm</div>
      </Card>

      <button className="fixed right-4 bottom-20 lg:bottom-8 lg:right-8 z-30 tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-3 shadow-soft flex items-center gap-2 text-sm">
        <Plus size={18} /> New listing
      </button>
    </div>
  );
}

function MyListingRow({ m, onSold }: { m: MyListing; onSold: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <div className="md:grid md:grid-cols-[1fr_100px_80px_80px_80px_40px] md:gap-3 p-3 md:px-4 md:py-3 items-center">
        {/* Card info */}
        <div className="flex gap-3 min-w-0">
          <div className="w-14 h-14 shrink-0 rounded overflow-hidden bg-surface-2">
            <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{m.name}</div>
            <div className="text-xs text-text-faint mt-0.5">{m.set} · {m.condition}</div>
            {m.aiHint && (
              <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-accent">
                <TrendingUp size={12} className="shrink-0 mt-0.5" /> {m.aiHint}
              </div>
            )}
          </div>
        </div>

        {/* Desktop columns */}
        <div className="hidden md:block text-right text-sm font-semibold">${m.price}</div>
        <div className="hidden md:flex items-center justify-end gap-1 text-xs text-text-muted"><Eye size={12} />{m.views}</div>
        <div className="hidden md:flex items-center justify-end gap-1 text-xs text-text-muted"><Bookmark size={12} />{m.saves}</div>
        <div className="hidden md:flex items-center justify-end gap-1 text-xs text-text-muted"><TagIcon size={12} />{m.offers}</div>
        <div className="hidden md:flex justify-end">
          <button className="tap text-text-faint hover:text-text"><MoreHorizontal size={16} /></button>
        </div>

        {/* Mobile actions */}
        <div className="flex gap-2 mt-3 md:hidden">
          <ActionBtn icon={<Pencil size={13} />} label="Edit" />
          <ActionBtn icon={<Copy size={13} />} label="Copy" />
          <ActionBtn icon={<TrendingUp size={13} />} label="Boost" />
          {m.status === 'live' && <ActionBtn icon={<Check size={13} />} label="Sold" onClick={onSold} primary />}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, primary }: { icon: React.ReactNode; label: string; onClick?: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`tap flex-1 flex items-center justify-center gap-1.5 rounded py-2 text-xs font-medium ${
        primary ? 'bg-positive/10 text-positive' : 'bg-surface-2 text-text-muted'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[11px] text-text-faint">{label}</div>
    </div>
  );
}
