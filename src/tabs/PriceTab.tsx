import { useState } from 'react';
import { TrendingUp, TrendingDown, Flame, Waves, Wallet, ScanLine, Search } from 'lucide-react';
import { priceCards, ownedCards, PriceCard, OwnedCard } from '@/data';
import { Pill, SearchBar, Card, Chip, Tag, Trend, PageHeader, SectionTitle, EmptyState, FilterLabel } from '@/components/ui';

const FEEDS = ['Gainers', 'Drops', 'Trending', 'Whale alerts'];
const LANGS = ['EN', 'JP'];
const TIMES = ['7D', '30D'];

export function PriceTab({ search, onScan }: { search: string; onScan: () => void }) {
  const [feed, setFeed] = useState('Gainers');
  const [lang, setLang] = useState('EN');
  const [time, setTime] = useState('7D');
  const [localSearch, setLocalSearch] = useState('');

  const q = (search || localSearch).toLowerCase();
  const filtered = priceCards.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !p.set.toLowerCase().includes(q)) return false;
    if (lang !== 'All' && p.lang !== lang) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (feed === 'Gainers') return b.change - a.change;
    if (feed === 'Drops') return a.change - b.change;
    if (feed === 'Trending') return b.volume - a.volume;
    return b.price - a.price;
  });

  const totalValue = ownedCards.reduce((s, o) => s + o.value * o.copies, 0);
  const totalCost = ownedCards.reduce((s, o) => s + o.avgCost * o.copies, 0);
  const gain = totalValue - totalCost;
  const gainPct = (gain / totalCost) * 100;

  return (
    <div className="animate-fade">
      <PageHeader title="Price Intelligence" sub="Universal price search, market movers, and collection tracking" />

      {/* Entry points */}
      <div className="grid grid-cols-2 gap-px bg-border rounded-card overflow-hidden mb-6">
        <button className="tap bg-surface p-4 text-left hover:bg-surface-2">
          <div className="flex items-center gap-2 text-accent mb-1"><Search size={16} /> <span className="font-medium text-sm text-text">By name</span></div>
          <div className="text-xs text-text-muted">Search any card across sets</div>
        </button>
        <button onClick={onScan} className="tap bg-surface p-4 text-left hover:bg-surface-2">
          <div className="flex items-center gap-2 text-accent mb-1"><ScanLine size={16} /> <span className="font-medium text-sm text-text">Scan card</span></div>
          <div className="text-xs text-text-muted">Point your camera at a card</div>
        </button>
      </div>

      <div className="mb-6">
        <SearchBar value={localSearch} onChange={setLocalSearch} placeholder="Search card or set" />
      </div>

      {/* My Collection */}
      <div className="mb-8">
        <SectionTitle action={<Tag tone="gold">7 cards</Tag>}>My Collection</SectionTitle>
        <div className="grid grid-cols-3 gap-px bg-border rounded-card overflow-hidden mb-3">
          <div className="bg-surface px-4 py-3.5">
            <div className="text-[11px] text-text-faint uppercase tracking-wider font-medium">Est. value</div>
            <div className="text-xl font-bold text-accent mt-1.5">${totalValue.toLocaleString()}</div>
          </div>
          <div className="bg-surface px-4 py-3.5">
            <div className="text-[11px] text-text-faint uppercase tracking-wider font-medium">Avg cost</div>
            <div className="text-xl font-bold mt-1.5">${totalCost.toLocaleString()}</div>
          </div>
          <div className="bg-surface px-4 py-3.5">
            <div className="text-[11px] text-text-faint uppercase tracking-wider font-medium">Gain / loss</div>
            <div className={`text-xl font-bold mt-1.5 ${gain >= 0 ? 'text-positive' : 'text-negative'}`}>+${gain} <span className="text-xs">({gainPct.toFixed(1)}%)</span></div>
          </div>
        </div>
        <div className="rounded-card border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_100px_100px_120px_80px] gap-3 px-4 py-2.5 bg-surface-2 text-[11px] uppercase tracking-wider text-text-faint font-medium border-b border-border">
            <div>Card</div>
            <div className="text-right">Copies</div>
            <div className="text-right">Avg cost</div>
            <div className="text-right">Value</div>
            <div className="text-right">P/L</div>
          </div>
          {ownedCards.map((o) => <OwnedRow key={o.id} o={o} />)}
        </div>
      </div>

      {/* Market Insights */}
      <div>
        <SectionTitle>Market Insights</SectionTitle>

        {/* Feed tabs */}
        <div className="flex items-center gap-0 border-b border-border mb-4">
          {FEEDS.map((f) => {
            const icon = f === 'Gainers' ? <TrendingUp size={13} /> : f === 'Drops' ? <TrendingDown size={13} /> : f === 'Trending' ? <Flame size={13} /> : <Waves size={13} />;
            return (
              <button
                key={f}
                onClick={() => setFeed(f)}
                className={`tap px-3.5 py-2.5 text-sm font-medium flex items-center gap-1.5 relative ${feed === f ? 'text-text' : 'text-text-faint hover:text-text-muted'}`}
              >
                {icon} {f}
                {feed === f && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
              </button>
            );
          })}
        </div>

        {/* Secondary filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <FilterLabel>Lang</FilterLabel>
            {LANGS.map((l) => <Pill key={l} size="sm" tone="muted" active={lang === l} onClick={() => setLang(l)}>{l}</Pill>)}
          </div>
          <div className="flex items-center gap-1">
            <FilterLabel>Time</FilterLabel>
            {TIMES.map((t) => <Pill key={t} size="sm" tone="muted" active={time === t} onClick={() => setTime(t)}>{t}</Pill>)}
          </div>
        </div>

        {sorted.length === 0 ? (
          <EmptyState icon={<Wallet size={26} />} title="No matches" sub="Try a different search or language filter." />
        ) : (
          <div className="rounded-card border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-[40px_1fr_100px_100px_120px_100px] gap-3 px-4 py-2.5 bg-surface-2 text-[11px] uppercase tracking-wider text-text-faint font-medium border-b border-border">
              <div>#</div>
              <div>Card</div>
              <div className="text-right">Price</div>
              <div className="text-right">Change</div>
              <div className="text-right">Volume</div>
              <div className="text-right">Trend</div>
            </div>
            {sorted.map((p, i) => <PriceRow key={p.id} p={p} rank={i + 1} />)}
          </div>
        )}

        {/* Insight card */}
        <Card className="p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center"><Flame size={14} /></div>
            <div className="font-medium text-sm">Charizard ex SIR — AI note</div>
          </div>
          <div className="text-sm text-text-muted leading-relaxed">Local demand outpacing supply for 6 weeks. Confidence 78% that price holds above $300 through Q3. Comparable: Umbreon VMAX alt (+4.1%), Lugia V alt (+12.5%).</div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <Chip tone="gold">Confidence 78%</Chip>
            <Chip>3 comps</Chip>
            <Chip tone="positive">Bullish</Chip>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PriceRow({ p, rank }: { p: PriceCard; rank: number }) {
  const up = p.change >= 0;
  return (
    <div className="border-b border-border last:border-b-0 hover:bg-surface-2/30 tap cursor-pointer">
      <div className="md:grid md:grid-cols-[40px_1fr_100px_100px_120px_100px] md:gap-3 md:px-4 md:py-3 p-3 items-center">
        <div className="hidden md:block text-xs text-text-faint font-medium">{rank}</div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded overflow-hidden bg-surface-2">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{p.name}</div>
            <div className="text-xs text-text-faint mt-0.5">{p.set} · {p.grade || 'Raw'} · {p.lang}</div>
          </div>
        </div>
        <div className="hidden md:block text-right font-semibold text-sm">${p.price}</div>
        <div className={`hidden md:flex items-center justify-end gap-1 text-sm font-medium ${up ? 'text-positive' : 'text-negative'}`}>
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {up ? '+' : ''}{p.change}%
        </div>
        <div className="hidden md:block text-right text-sm text-text-muted">{p.volume}</div>
        <div className="hidden md:flex justify-end"><Trend data={p.trend} positive={up} height={28} /></div>

        {/* Mobile compact */}
        <div className="md:hidden flex items-center justify-between mt-2">
          <div className="text-lg font-bold">${p.price}</div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${up ? 'text-positive' : 'text-negative'}`}>{up ? '+' : ''}{p.change}%</span>
            <Trend data={p.trend} positive={up} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnedRow({ o }: { o: OwnedCard }) {
  const gain = (o.value - o.avgCost) * o.copies;
  const pct = ((o.value - o.avgCost) / o.avgCost) * 100;
  const up = gain >= 0;
  return (
    <div className="border-b border-border last:border-b-0 hover:bg-surface-2/30">
      <div className="md:grid md:grid-cols-[1fr_100px_100px_120px_80px] md:gap-3 md:px-4 md:py-3 p-3 items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-surface-2">
            <img src={o.image} alt={o.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{o.name}</div>
            <div className="text-xs text-text-faint mt-0.5">{o.set} · {o.grade || 'Raw'}</div>
          </div>
        </div>
        <div className="hidden md:block text-right text-sm text-text-muted">{o.copies}×</div>
        <div className="hidden md:block text-right text-sm text-text-muted">${o.avgCost}</div>
        <div className="hidden md:block text-right text-sm font-semibold">${o.value}</div>
        <div className={`hidden md:block text-right text-sm font-medium ${up ? 'text-positive' : 'text-negative'}`}>{up ? '+' : ''}{pct.toFixed(1)}%</div>

        <div className="md:hidden flex items-center justify-between mt-2">
          <div className="text-xs text-text-muted">{o.copies}× · avg ${o.avgCost}</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${o.value}</span>
            <span className={`text-xs font-medium ${up ? 'text-positive' : 'text-negative'}`}>{up ? '+' : ''}{pct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
