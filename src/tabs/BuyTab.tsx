import { useMemo, useState } from 'react';
import {
  MapPin,
  Star,
  Plus,
  PackageOpen,
  Navigation,
  Layers3,
  Bookmark,
  Search as SearchIcon,
  Crosshair,
  Store,
  ChevronDown,
} from 'lucide-react';
import { listings, Listing } from '@/data';
import { ZipMap } from '@/components/ZipMap';
import {
  Pill,
  SearchBar,
  Card,
  Tag,
  EmptyState,
  SectionTitle,
  FilterLabel,
  PageHeader,
} from '@/components/ui';

const DISTANCES = ['5 mi', '15 mi', '25 mi', '50 mi'] as const;
const GAMES = ['All', 'Pokemon', 'Magic', 'Yu-Gi-Oh', 'One Piece'] as const;
const CONDITIONS = ['Any', 'NM', 'LP', 'MP'] as const;
const SORTS = ['Nearest', 'Price ↑', 'Price ↓', 'Newest'] as const;

type View = 'map' | 'list' | 'saved';

type ZipRegion = {
  id: string;
  zip: string;
  city: string;
  state: string;
  lng: number;
  lat: number;
};

const ZIPS: ZipRegion[] = [
  { id: '33133', zip: '33133', city: 'Coconut Grove', state: 'FL', lng: -80.2371, lat: 25.733 },
  { id: '33139', zip: '33139', city: 'South Beach', state: 'FL', lng: -80.147, lat: 25.7889 },
  { id: '33130', zip: '33130', city: 'Downtown Miami', state: 'FL', lng: -80.2027, lat: 25.7691 },
  { id: '33125', zip: '33125', city: 'Flagami', state: 'FL', lng: -80.2389, lat: 25.7821 },
  { id: '33127', zip: '33127', city: 'Wynwood', state: 'FL', lng: -80.204, lat: 25.8169 },
  { id: '33150', zip: '33150', city: 'Little River', state: 'FL', lng: -80.2097, lat: 25.8503 },
  { id: '33141', zip: '33141', city: 'North Beach', state: 'FL', lng: -80.1334, lat: 25.8463 },
  { id: '33012', zip: '33012', city: 'Hialeah', state: 'FL', lng: -80.2978, lat: 25.8622 },
  { id: '33134', zip: '33134', city: 'Coral Gables', state: 'FL', lng: -80.2689, lat: 25.7573 },
  { id: '33101', zip: '33101', city: 'Downtown Miami', state: 'FL', lng: -80.1986, lat: 25.7792 },
];

export function BuyTab({ search }: { search: string }) {
  const [view, setView] = useState<View>('map');
  const [distance, setDistance] = useState<(typeof DISTANCES)[number]>('25 mi');
  const [game, setGame] = useState<(typeof GAMES)[number]>('All');
  const [cond, setCond] = useState<(typeof CONDITIONS)[number]>('Any');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Nearest');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedZip, setSelectedZip] = useState('33130');
  const [hoverZip, setHoverZip] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const q = (search || localSearch).toLowerCase();

  const filtered = useMemo(() => {
    return listings
      .filter((l) => {
        if (q && !l.name.toLowerCase().includes(q) && !l.set.toLowerCase().includes(q)) return false;
        if (game !== 'All' && l.game !== game) return false;
        if (cond !== 'Any' && !l.condition.includes(cond)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'Nearest') return a.distance - b.distance;
        if (sort === 'Price ↑') return a.price - b.price;
        if (sort === 'Price ↓') return b.price - a.price;
        return 0;
      });
  }, [q, game, cond, sort]);

  const zipRegions = useMemo(() => {
    return ZIPS.map((z, i) => ({
      ...z,
      listings: filtered.filter((_, idx) => idx % ZIPS.length === i),
    }));
  }, [filtered]);

  const selectedRegion = zipRegions.find((z) => z.zip === selectedZip) ?? zipRegions[0];
  const hoveredRegion = hoverZip ? zipRegions.find((z) => z.zip === hoverZip) : null;
  const activeRegion = hoveredRegion ?? selectedRegion;

  const saved = filtered.slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Map-first card discovery"
        sub="Browse listings by zip, compare nearby sellers, and explore the local market visually."
      />

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-[104px] xl:self-start">
          <Card className="p-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between gap-2 hover:opacity-75 transition-opacity"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold">
                Market search
              </div>
              <ChevronDown size={16} className={`text-text-faint transition-transform ${filtersOpen ? '' : '-rotate-90'}`} />
            </button>

            <div className="mt-3">
              <SearchBar
                value={localSearch}
                onChange={setLocalSearch}
                placeholder="Search cards, sets, sellers, zip"
              />
            </div>

            {filtersOpen && (
              <div className="mt-4 space-y-4">
                <FilterGroup label="View">
                  <ViewToggle value={view} onChange={setView} />
                </FilterGroup>

                <PillFilter label="Distance" value={distance} options={DISTANCES} onChange={setDistance} />
                <PillFilter label="Game" value={game} options={GAMES} onChange={setGame} />
                <PillFilter label="Condition" value={cond} options={CONDITIONS} onChange={setCond} />
                <PillFilter label="Sort" value={sort} options={SORTS} onChange={setSort} />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-accent" />
              <div className="text-sm font-semibold">Selected zip</div>
            </div>

            <div className="rounded-card border border-border bg-surface px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">Active region</div>
              <div className="text-2xl font-semibold mt-1.5">{selectedRegion.zip}</div>
              <div className="text-sm text-text-muted mt-1">
                {selectedRegion.city}, {selectedRegion.state}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <MiniMetric label="Listings" value={String(selectedRegion.listings.length)} />
                <MiniMetric label="Nearest" value={selectedRegion.listings[0] ? `${selectedRegion.listings[0].distance} mi` : '—'} />
              </div>
            </div>

            <div className="mt-4 text-xs text-text-muted leading-relaxed">
              Hover a zip to preview it, or click to sync the results list to that area.
            </div>
          </Card>
        </aside>

        <div className="space-y-6 min-w-0">
          <Card className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="border-b lg:border-b-0 lg:border-r border-border">
                <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold">
                      Interactive market map
                    </div>
                    <div className="text-lg font-semibold mt-1">Zip-outlined local discovery</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Crosshair size={13} className="text-accent" />
                    Hover a region, then click to lock results
                  </div>
                </div>

                <div className="relative h-[560px] bg-[#12110e]">
                  <ZipMap
                    selectedZip={selectedZip}
                    onHoverZip={setHoverZip}
                    onSelectZip={setSelectedZip}
                  />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <MapLegendItem label="Selected zip" tone="selected" />
                    <MapLegendItem label="Hovered zip" tone="hovered" />
                    <MapLegendItem label="Has listings" tone="active" />
                    <MapLegendItem label="No listings" tone="empty" />
                  </div>

                  <div className="absolute left-4 bottom-4 right-4 rounded-[20px] border border-border bg-bg/88 backdrop-blur px-4 py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-semibold">
                          Region overview
                        </div>
                        <div className="text-sm font-medium mt-1">
                          {activeRegion.zip} · {activeRegion.city}, {activeRegion.state}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {activeRegion.listings.length
                            ? `${activeRegion.listings.length} matching listings in this outlined zip region`
                            : 'No active listings here yet — try another zip or widen your distance'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Tag tone="gold">{activeRegion.listings.length} listings</Tag>
                        <button className="tap rounded-card border border-border px-3 py-2 text-xs font-medium text-text-muted hover:text-text flex items-center gap-1.5">
                          <Navigation size={13} />
                          Center map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 bg-surface/35">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold">Results rail</div>
                    <div className="text-lg font-semibold mt-1">{selectedRegion.zip} listings</div>
                  </div>
                  <Tag tone="gold">{selectedRegion.listings.length}</Tag>
                </div>

                <div className="max-h-[560px] overflow-auto">
                  {selectedRegion.listings.length ? (
                    <div className="divide-y divide-border">
                      {selectedRegion.listings.map((l) => (
                        <MapListingRow key={l.id} l={l} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8">
                      <EmptyState
                        icon={<PackageOpen size={28} />}
                        title="No listings here yet"
                        sub="Try a wider area, a different ZIP, or switch to all matching listings."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {view === 'list' && (
            <div className="space-y-3">
              <SectionTitle action={<Tag tone="gold">{filtered.length} results</Tag>}>All matching listings</SectionTitle>

              {filtered.length ? (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filtered.map((l) => (
                    <MarketplaceCard key={l.id} l={l} />
                  ))}
                </div>
              ) : (
                <Card className="p-10">
                  <EmptyState
                    icon={<SearchIcon size={26} />}
                    title="Nothing matches this search"
                    sub="Try another card, condition, or wider search radius."
                  />
                </Card>
              )}
            </div>
          )}

          {view === 'saved' && (
            <div className="space-y-3">
              <SectionTitle action={<Tag tone="gold">{saved.length} saved</Tag>}>Saved listings</SectionTitle>

              <div className="grid gap-4 md:grid-cols-2">
                {saved.map((l) => (
                  <MarketplaceCard key={l.id} l={l} />
                ))}
              </div>
            </div>
          )}

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Store size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold">Can't find what you're looking for?</div>
                <div className="text-sm text-text-muted mt-1 leading-relaxed">
                  Post a wanted ad and nearby sellers will get notified when they list a match.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <button className="lg:hidden fixed right-4 bottom-20 z-30 tap rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 shadow-soft flex items-center gap-2 text-sm">
        <Plus size={16} />
        Wanted ad
      </button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FilterLabel>{label}</FilterLabel>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function PillFilter<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <FilterGroup label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Pill key={opt} size="sm" tone="muted" active={value === opt} onClick={() => onChange(opt)}>
            {opt}
          </Pill>
        ))}
      </div>
    </FilterGroup>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (v: View) => void;
}) {
  const views: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'map', label: 'Map', icon: <Navigation size={14} /> },
    { id: 'list', label: 'List', icon: <Layers3 size={14} /> },
    { id: 'saved', label: 'Saved', icon: <Bookmark size={14} /> },
  ];

  return (
    <div className="inline-flex rounded-card border border-border bg-surface p-1 w-full">
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={`tap inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-3 py-2 text-sm font-medium ${
            value === v.id ? 'bg-bg text-text shadow-soft' : 'text-text-faint hover:text-text'
          }`}
        >
          {v.icon}
          {v.label}
        </button>
      ))}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-bg px-3 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className="text-sm font-semibold mt-1.5">{value}</div>
    </div>
  );
}

function MapLegendItem({
  label,
  tone,
}: {
  label: string;
  tone: 'selected' | 'hovered' | 'active' | 'empty';
}) {
  const styles = {
    selected: 'bg-accent border-accent',
    hovered: 'bg-accent/35 border-accent/70',
    active: 'bg-accent/15 border-accent/40',
    empty: 'bg-white/5 border-white/20',
  };

  return (
    <div className="rounded-full border bg-bg/80 backdrop-blur px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-text-muted">
      <span className={`w-2.5 h-2.5 rounded-full border ${styles[tone]}`} />
      {label}
    </div>
  );
}

function MarketplaceCard({ l }: { l: Listing }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 sm:grid-cols-[112px_1fr]">
        <div className="bg-surface-2">
          <img src={l.image} alt={l.name} className="w-full h-full min-h-[112px] object-cover" />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-base truncate">{l.name}</div>
              <div className="text-sm text-text-faint mt-1 truncate">
                {l.set} · {l.number}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-2xl font-semibold">${l.price}</div>
              <div className="text-xs text-text-faint mt-1">Ask price</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {l.grade && <Tag tone="gold">{l.grade}</Tag>}
            <Tag>{l.condition}</Tag>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Star size={11} className="text-accent" />
              {l.seller} · {l.rating}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-faint">
              <MapPin size={11} />
              {l.distance} mi · {l.area}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button className="tap rounded-card bg-accent px-3.5 py-2 text-sm font-semibold text-accent-ink">
              View listing
            </button>
            <button className="tap rounded-card border border-border px-3.5 py-2 text-sm font-medium text-text-muted hover:text-text">
              Save
            </button>
            <button className="tap rounded-card border border-border px-3.5 py-2 text-sm font-medium text-text-muted hover:text-text">
              Message
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MapListingRow({ l }: { l: Listing }) {
  return (
    <button className="tap w-full text-left px-4 py-4 hover:bg-surface/45 transition-colors">
      <div className="flex items-start gap-3">
        <img src={l.image} alt={l.name} className="w-14 h-14 rounded object-cover bg-surface-2 shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{l.name}</div>
              <div className="text-xs text-text-faint mt-0.5 truncate">
                {l.set} · {l.condition}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-base font-semibold">${l.price}</div>
              <div className="text-[11px] text-text-faint mt-0.5">{l.distance} mi</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {l.grade && <Tag tone="gold">{l.grade}</Tag>}
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Star size={11} className="text-accent" />
              {l.rating}
            </span>
            <span className="text-xs text-text-faint flex items-center gap-1">
              <MapPin size={11} />
              {l.area}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}