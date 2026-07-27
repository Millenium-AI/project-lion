import { useState } from 'react';
import { MapPin, Star, Plus, PackageOpen, Navigation, SlidersHorizontal } from 'lucide-react';
import { listings, Listing } from '@/data';
import { Pill, SearchBar, Card, Chip, Tag, EmptyState, PageHeader, SectionTitle, FilterBar, FilterLabel } from '@/components/ui';

const DISTANCES = ['1 mi', '5 mi', '15 mi', '50 mi'];
const GAMES = ['All', 'Pokemon', 'Magic', 'Yu-Gi-Oh', 'One Piece'];
const CONDITIONS = ['Any', 'NM', 'LP', 'MP'];
const SORTS = ['Nearest', 'Price ↑', 'Price ↓', 'Newest'];

export function BuyTab({ search }: { search: string }) {
  const [view, setView] = useState<'list' | 'map' | 'saved'>('list');
  const [distance, setDistance] = useState('5 mi');
  const [game, setGame] = useState('All');
  const [cond, setCond] = useState('Any');
  const [sort, setSort] = useState('Nearest');
  const [localSearch, setLocalSearch] = useState('');

  const q = (search || localSearch).toLowerCase();
  const filtered = listings.filter((l) => {
    if (q && !l.name.toLowerCase().includes(q) && !l.set.toLowerCase().includes(q)) return false;
    if (game !== 'All' && l.game !== game) return false;
    if (cond !== 'Any' && !l.condition.includes(cond)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'Nearest') return a.distance - b.distance;
    if (sort === 'Price ↑') return a.price - b.price;
    if (sort === 'Price ↓') return b.price - a.price;
    return 0;
  });

  return (
    <div className="animate-fade">
      <PageHeader
        title="Buy"
        sub="Find local deals from collectors near you"
        action={
          <button className="tap hidden sm:flex items-center gap-2 text-sm text-text-muted hover:text-text">
            <SlidersHorizontal size={15} /> Filters
          </button>
        }
      />

      <div className="mb-5">
        <SearchBar value={localSearch} onChange={setLocalSearch} placeholder="Search card name or set" />
      </div>

      {/* View toggle + result count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 border-b border-border">
          {(['list', 'map', 'saved'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`tap px-3.5 py-2 text-sm font-medium capitalize relative ${
                view === v ? 'text-text' : 'text-text-faint hover:text-text-muted'
              }`}
            >
              {v}
              {view === v && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
        <div className="text-xs text-text-faint">{filtered.length} results</div>
      </div>

      {/* Filters */}
      <div className="mb-6 pb-4 border-b border-border">
        <div className="space-y-2">
          <FilterRow label="Distance" options={DISTANCES} value={distance} onChange={setDistance} />
          <FilterRow label="Game" options={GAMES} value={game} onChange={setGame} />
          <div className="flex items-center gap-2 flex-wrap">
            <FilterLabel>Condition</FilterLabel>
            {CONDITIONS.map((c) => <Pill key={c} size="sm" active={cond === c} onClick={() => setCond(c)}>{c}</Pill>)}
            <span className="w-px h-4 bg-border mx-1.5" />
            <FilterLabel>Sort</FilterLabel>
            {SORTS.map((s) => <Pill key={s} size="sm" active={sort === s} onClick={() => setSort(s)}>{s}</Pill>)}
          </div>
        </div>
      </div>

      {view === 'map' && <MapView />}
      {view === 'list' && (
        filtered.length === 0 ? (
          <EmptyState
            icon={<PackageOpen size={26} />}
            title="No listings nearby"
            sub="Try widening your distance or clearing filters. You can also post a wanted ad."
            action={<button className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-2.5 text-sm">Post wanted ad</button>}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        )
      )}
      {view === 'saved' && (
        <EmptyState
          icon={<PackageOpen size={26} />}
          title="No saved listings"
          sub="Tap the bookmark on any listing to save it here for later."
        />
      )}

      {/* Nearby signals */}
      {view === 'list' && filtered.length > 0 && (
        <div className="mt-8">
          <SectionTitle>Local market signals</SectionTitle>
          <Card className="divide-y divide-border">
            <Signal text="Charizard ex demand up 18% in Phoenix this week" tag="Trending" />
            <Signal text="3 new sellers listed within 5 miles today" tag="Supply" />
            <Signal text="MesaCards posted 4 cards in the last hour" tag="Activity" />
          </Card>
        </div>
      )}

      <button className="lg:hidden fixed right-4 bottom-20 z-30 tap rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 shadow-soft flex items-center gap-2 text-sm">
        <Plus size={16} /> Wanted ad
      </button>
    </div>
  );
}

function FilterRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <FilterLabel>{label}</FilterLabel>
      {options.map((o) => <Pill key={o} size="sm" active={value === o} onClick={() => onChange(o)}>{o}</Pill>)}
    </div>
  );
}

function ListingCard({ l }: { l: Listing }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-2 relative">
          <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{l.name}</div>
              <div className="text-xs text-text-faint truncate mt-0.5">{l.set} · {l.number}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-text">${l.price}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
            {l.grade && <Tag tone="gold">{l.grade}</Tag>}
            <span className="text-text-faint">{l.condition}</span>
            <span className="flex items-center gap-1"><Star size={11} className="text-accent" />{l.seller} · {l.rating}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-text-faint">
            <span className="flex items-center gap-1"><MapPin size={11} />{l.distance} mi · {l.area}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MapView() {
  return (
    <Card className="relative h-80 overflow-hidden mb-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#1f201a_0%,#0d0d0b_70%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(214,191,120,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(214,191,120,0.06) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
      {listings.slice(0, 5).map((l, i) => (
        <div
          key={l.id}
          className="absolute px-2 py-1 rounded bg-accent text-accent-ink text-[10px] font-bold shadow-soft"
          style={{ left: `${20 + i * 16}%`, top: `${30 + (i % 3) * 22}%` }}
        >
          ${l.price}
        </div>
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface/90 rounded px-3 py-1.5 border border-border">
          <Navigation size={12} className="text-accent" /> Phoenix, AZ
        </div>
        <div className="text-xs text-text-faint bg-surface/90 rounded px-3 py-1.5 border border-border">{listings.length} pins</div>
      </div>
    </Card>
  );
}

function Signal({ text, tag }: { text: string; tag: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5">
      <div className="text-sm text-text-muted">{text}</div>
      <Tag>{tag}</Tag>
    </div>
  );
}
