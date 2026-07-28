import { useMemo, useState } from 'react';
import {
  Plus,
  Copy,
  Pencil,
  Check,
  TrendingUp,
  Store,
  MapPin,
  Package2,
  Sparkles,
} from 'lucide-react';
import { myListings, MyListing, shopStats, profile } from '@/data';
import { SearchBar, Card, Tag, StatCard, PageHeader, EmptyState } from '@/components/ui';

export function SellTab() {
  const [seg, setSeg] = useState<'live' | 'hidden' | 'sold'>('live');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(myListings);

  const counts = {
    live: items.filter((i) => i.status === 'live').length,
    hidden: items.filter((i) => i.status === 'hidden').length,
    sold: items.filter((i) => i.status === 'sold').length,
  };

  const filtered = useMemo(() => {
    return items.filter(
      (i) => i.status === seg && (!search || i.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [items, seg, search]);

  const markSold = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: 'sold' } : i)));

  const hideListing = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: 'hidden' } : i)));

  const relist = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: 'live' } : i)));

  const liveItems = items.filter((i) => i.status === 'live');
  const liveValue = liveItems.reduce((sum, i) => sum + i.price, 0);
  const avgPrice = liveItems.length ? liveValue / liveItems.length : 0;

  return (
    <div className="animate-fade space-y-6">
      <PageHeader
        title="Seller HQ"
        sub="Manage your storefront, tune live listings, and convert local demand into quick card sales."
        action={
          <button className="tap rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 text-sm flex items-center gap-2">
            <Plus size={16} />
            New listing
          </button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-2">
              Storefront
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Your local card shop profile</h2>
                <p className="text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
                  Track live inventory, listing velocity, buyer views, and meetup readiness in one place.
                </p>
              </div>

              <button className="tap rounded-card border border-border px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text flex items-center gap-2">
                <Pencil size={15} />
                Edit shop
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <MetricCard
                icon={<Store size={15} />}
                label="Live listings"
                value={String(counts.live)}
                sub="Actively visible"
              />
              <MetricCard
                icon={<TrendingUp size={15} />}
                label="Live value"
                value={`$${liveValue.toLocaleString()}`}
                sub="Current ask total"
              />
              <MetricCard
                icon={<MapPin size={15} />}
                label="Avg listing"
                value={`$${avgPrice.toFixed(0)}`}
                sub="Median-ready pricing"
              />
            </div>
          </div>

          <div className="p-5 lg:p-6 bg-surface/40">
            <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-3">
              Seller signals
            </div>
            <div className="space-y-3">
              <SignalRow
                title="Local demand"
                sub="Buyers are responding best to clear pickup zones and condition-first titles."
                tone="gold"
              />
              <SignalRow
                title="Visibility"
                sub="Listings with recent price edits tend to stay higher in buyer consideration."
              />
              <SignalRow
                title="Conversion"
                sub="Bundled listings and meetup-ready inventory are converting fastest this week."
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="inline-flex rounded-card border border-border bg-surface p-1">
                {(['live', 'hidden', 'sold'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeg(s)}
                    className={`tap rounded-[10px] px-4 py-2 text-sm font-medium capitalize ${
                      seg === s ? 'bg-accent text-accent-ink shadow-soft' : 'text-text-faint hover:text-text'
                    }`}
                  >
                    {s} <span className="opacity-75 ml-1">{counts[s]}</span>
                  </button>
                ))}
              </div>

              <div className="w-full lg:w-[380px]">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search your listings"
                  size="md"
                />
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="hidden md:grid grid-cols-[72px_minmax(0,1.3fr)_120px_120px_120px_150px] gap-3 px-4 py-3 border-b border-border bg-surface-2 text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">
              <div>Card</div>
              <div>Listing</div>
              <div className="text-right">Price</div>
              <div className="text-right">Views</div>
              <div className="text-right">Saves</div>
              <div className="text-right">Actions</div>
            </div>

            {filtered.length ? (
              <div className="divide-y divide-border">
                {filtered.map((item) => (
                  <SellerRow
                    key={item.id}
                    item={item}
                    seg={seg}
                    onMarkSold={() => markSold(item.id)}
                    onHide={() => hideListing(item.id)}
                    onRelist={() => relist(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-10">
                <EmptyState
                  icon={<Package2 size={28} />}
                  title={seg === 'live' ? 'No live listings yet' : seg === 'hidden' ? 'No hidden listings' : 'No sold history yet'}
                  sub={
                    seg === 'live'
                      ? 'List your first card to start building your storefront.'
                      : 'When listing states change, they will show up here.'
                  }
                  action={
                    seg === 'live' ? (
                      <button className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-2.5 text-sm">
                        Create first listing
                      </button>
                    ) : undefined
                  }
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Shop performance</div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Profile views" value={String(shopStats?.views ?? 0)} />
              <StatCard label="Saved shop" value={String(shopStats?.saves ?? 0)} />
              <StatCard label="Sold this month" value={String(shopStats?.sold ?? 0)} tone="positive" />
              <StatCard label="Followers" value={String(profile?.followers ?? 0)} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-accent" />
              <div className="text-sm font-semibold">Website upgrades to build next</div>
            </div>
            <ul className="space-y-2 text-sm text-text-muted leading-relaxed">
              <li>- Public seller storefront page with reviews and meet zones.</li>
              <li>- Bulk list uploader for cards, grades, and pricing rules.</li>
              <li>- Local meetup scheduling block tied to Messages.</li>
              <li>- Bundles and featured inventory modules on desktop.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface px-4 py-3.5">
      <div className="flex items-center gap-2 text-text-faint text-[11px] uppercase tracking-[0.16em] font-medium">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      <div className="text-xs text-text-muted mt-1">{sub}</div>
    </div>
  );
}

function SignalRow({
  title,
  sub,
  tone = 'default',
}: {
  title: string;
  sub: string;
  tone?: 'default' | 'gold';
}) {
  return (
    <div className={`rounded-card border border-border px-3.5 py-3 ${tone === 'gold' ? 'bg-accent/10' : 'bg-surface'}`}>
      <div className={`text-sm font-medium ${tone === 'gold' ? 'text-accent' : 'text-text'}`}>{title}</div>
      <div className="text-xs text-text-muted mt-1 leading-relaxed">{sub}</div>
    </div>
  );
}

function SellerRow({
  item,
  seg,
  onMarkSold,
  onHide,
  onRelist,
}: {
  item: MyListing;
  seg: 'live' | 'hidden' | 'sold';
  onMarkSold: () => void;
  onHide: () => void;
  onRelist: () => void;
}) {
  return (
    <div className="px-4 py-4 hover:bg-surface/40 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-[72px_minmax(0,1.3fr)_120px_120px_120px_150px] gap-4 items-center">
        <div>
          <img src={item.image} alt={item.name} className="w-[72px] h-[72px] rounded object-cover bg-surface-2" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-sm truncate">{item.name}</div>
            <Tag>{item.condition}</Tag>
          </div>
          <div className="text-xs text-text-faint mt-1 truncate">{item.set}</div>
        </div>

        <div className="md:text-right">
          <div className="text-lg font-semibold">${item.price}</div>
          <div className="text-[11px] text-text-faint mt-0.5">Ask</div>
        </div>

        <div className="md:text-right">
          <div className="text-sm font-medium">{item.views ?? 0}</div>
          <div className="text-[11px] text-text-faint mt-0.5">Views</div>
        </div>

        <div className="md:text-right">
          <div className="text-sm font-medium">{item.saves ?? 0}</div>
          <div className="text-[11px] text-text-faint mt-0.5">Saves</div>
        </div>

        <div className="flex md:justify-end gap-2 flex-wrap">
          {seg === 'live' && (
            <>
              <button className="tap rounded-card border border-border px-3 py-2 text-xs font-medium text-text-muted hover:text-text flex items-center gap-1.5">
                <Copy size={13} />
                Duplicate
              </button>
              <button
                onClick={onHide}
                className="tap rounded-card border border-border px-3 py-2 text-xs font-medium text-text-muted hover:text-text"
              >
                Hide
              </button>
              <button
                onClick={onMarkSold}
                className="tap rounded-card bg-accent px-3 py-2 text-xs font-semibold text-accent-ink flex items-center gap-1.5"
              >
                <Check size={13} />
                Mark sold
              </button>
            </>
          )}

          {seg === 'hidden' && (
            <button
              onClick={onRelist}
              className="tap rounded-card bg-accent px-3 py-2 text-xs font-semibold text-accent-ink"
            >
              Relist
            </button>
          )}

          {seg === 'sold' && (
            <button className="tap rounded-card border border-border px-3 py-2 text-xs font-medium text-text-muted hover:text-text">
              View sale
            </button>
          )}
        </div>
      </div>
    </div>
  );
}