import { useMemo, useState } from 'react';
import {
  MapPin,
  Star,
  Plus,
  PackageOpen,
  Navigation,
  SlidersHorizontal,
  Layers3,
  Bookmark,
  Search as SearchIcon,
  Crosshair,
  Store,
  ChevronDown,
} from 'lucide-react';
import { listings, Listing } from '@/data';
import {
  Pill,
  SearchBar,
  Card,
  Tag,
  EmptyState,
  SectionTitle,
  FilterLabel,
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
  polygon: string;
  cx: string;
  cy: string;
};

const ZIPS: ZipRegion[] = [
  { id: '85004', zip: '85004', city: 'Phoenix', state: 'AZ', polygon: '16,22 29,20 31,31 20,35 12,30', cx: '22', cy: '27' },
  { id: '85013', zip: '85013', city: 'Phoenix', state: 'AZ', polygon: '29,20 42,18 44,30 31,31', cx: '36', cy: '25' },
  { id: '85016', zip: '85016', city: 'Phoenix', state: 'AZ', polygon: '44,19 58,21 58,31 44,30', cx: '51', cy: '25' },
  { id: '85281', zip: '85281', city: 'Tempe', state: 'AZ', polygon: '41,31 55,31 57,41 45,45 36,40', cx: '48', cy: '37' },
  { id: '85282', zip: '85282', city: 'Tempe', state: 'AZ', polygon: '36,40 45,45 44,57 31,57 28,47', cx: '38', cy: '49' },
  { id: '85202', zip: '85202', city: 'Mesa', state: 'AZ', polygon: '45,45 58,41 66,49 63,60 44,57', cx: '55', cy: '51' },
  { id: '85257', zip: '85257', city: 'Scottsdale', state: 'AZ', polygon: '58,21 72,22 74,38 57,41 55,31', cx: '66', cy: '31' },
  { id: '85301', zip: '85301', city: 'Glendale', state: 'AZ', polygon: '7,18 16,22 12,30 5,28 3,22', cx: '10', cy: '24' },
  { id: '85302', zip: '85302', city: 'Glendale', state: 'AZ', polygon: '12,30 20,35 18,46 8,43 5,28', cx: '13', cy: '37' },
  { id: '85224', zip: '85224', city: 'Chandler', state: 'AZ', polygon: '31,57 44,57 48,68 32,71 24,64', cx: '37', cy: '64' },
];

export function BuyTab({ search }: { search: string }) {
  const [view, setView] = useState<View>('map');
  const [distance, setDistance] = useState<(typeof DISTANCES)[number]>('25 mi');
  const [game, setGame] = useState<(typeof GAMES)[number]>('All');
  const [cond, setCond] = useState<(typeof CONDITIONS)[number]>('Any');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Nearest');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedZip, setSelectedZip] = useState('85281');
  const [hoverZip, setHoverZip] = useState<string | null>(null);

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
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-[104px] xl:self-start">
          <Card className="p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-3">
              Market search
            </div>

            <SearchBar
              value={localSearch}
              onChange={setLocalSearch}
              placeholder="Search cards, sets, sellers, zip"
            />

            <div className="mt-4 space-y-4">
              <FilterGroup label="View">
                <ViewToggle value={view} onChange={setView} />
              </FilterGroup>

              <FilterGroup label="Distance">
                <div className="flex flex-wrap gap-2">
                  {DISTANCES.map((d) => (
                    <Pill key={d} size="sm" tone="muted" active={distance === d} onClick={() => setDistance(d)}>
                      {d}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Game">
                <div className="flex flex-wrap gap-2">
                  {GAMES.map((g) => (
                    <Pill key={g} size="sm" tone="muted" active={game === g} onClick={() => setGame(g)}>
                      {g}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Condition">
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <Pill key={c} size="sm" tone="muted" active={cond === c} onClick={() => setCond(c)}>
                      {c}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Sort">
                <div className="flex flex-wrap gap-2">
                  {SORTS.map((s) => (
                    <Pill key={s} size="sm" tone="muted" active={sort === s} onClick={() => setSort(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>
            </div>
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
              Every zip is outlined so the map becomes the product. Hover should preview the area, and clicking a zip
              should fully sync the results rail.
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
                  <div
                    className="absolute inset-0 opacity-[0.16]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,210,113,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,210,113,0.08) 1px, transparent 1px)',
                      backgroundSize: '36px 36px',
                    }}
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_28%,rgba(240,181,73,0.10),transparent_22%),radial-gradient(circle_at_25%_55%,rgba(240,181,73,0.08),transparent_18%),radial-gradient(circle_at_75%_72%,rgba(240,181,73,0.08),transparent_24%)]" />

                  <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
                    {zipRegions.map((region) => {
                      const active = activeRegion.zip === region.zip;
                      const selected = selectedRegion.zip === region.zip;
                      const density = region.listings.length;

                      return (
                        <g key={region.id}>
                          <polygon
                            points={region.polygon}
                            onMouseEnter={() => setHoverZip(region.zip)}
                            onMouseLeave={() => setHoverZip(null)}
                            onClick={() => setSelectedZip(region.zip)}
                            className="cursor-pointer transition-all duration-150"
                            fill={
                              selected
                                ? 'rgba(247, 190, 83, 0.38)'
                                : active
                                ? 'rgba(247, 190, 83, 0.24)'
                                : density
                                ? 'rgba(247, 190, 83, 0.10)'
                                : 'rgba(255,255,255,0.03)'
                            }
                            stroke={selected ? '#f7be53' : active ? '#ddb15b' : 'rgba(255,255,255,0.18)'}
                            strokeWidth={selected ? 0.7 : 0.45}
                          />

                          <circle
                            cx={region.cx}
                            cy={region.cy}
                            r={selected ? '2.2' : '1.7'}
                            fill={selected ? '#f7be53' : '#b9a98a'}
                          />

                          <text
                            x={region.cx}
                            y={region.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            dy="-3"
                            fontSize="2.3"
                            fill={selected ? '#fff1cb' : '#bcb29d'}
                            className="pointer-events-none select-none"
                          >
                            {region.zip}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

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
                <div className="text-sm font-semibold">Why this works better as a website</div>
                <div className="text-sm text-text-muted mt-1 leading-relaxed">
                  The mobile screenshot has the right dark/gold tone, but desktop Buy should let the map own the page.
                  A zip-outlined canvas plus a fixed results rail makes Lion Market feel like a real local marketplace,
                  not just a card search app.
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