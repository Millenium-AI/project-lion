import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Wallet,
  ScanLine,
  Activity,
  Radar,
  BarChart3,
} from 'lucide-react';
import { priceCards, ownedCards, PriceCard, OwnedCard } from '@/data';
import {
  Pill,
  SearchBar,
  Card,
  Tag,
  Trend,
  PageHeader,
  SectionTitle,
  EmptyState,
  FilterLabel,
} from '@/components/ui';

const FEEDS = ['Gainers', 'Drops', 'Trending', 'Whale alerts'] as const;
const LANGS = ['EN', 'JP'] as const;
const TIMES = ['7D', '30D'] as const;

export function PriceTab({ search, onScan }: { search: string; onScan: () => void }) {
  const [feed, setFeed] = useState<(typeof FEEDS)[number]>('Gainers');
  const [lang, setLang] = useState<(typeof LANGS)[number]>('EN');
  const [time, setTime] = useState<(typeof TIMES)[number]>('7D');
  const [localSearch, setLocalSearch] = useState('');

  const q = (search || localSearch).toLowerCase();

  const filtered = useMemo(() => {
    return priceCards.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.set.toLowerCase().includes(q)) return false;
      if (p.lang !== lang) return false;
      return true;
    });
  }, [q, lang]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (feed === 'Gainers') return b.change - a.change;
      if (feed === 'Drops') return a.change - b.change;
      if (feed === 'Trending') return b.volume - a.volume;
      return b.price - a.price;
    });
  }, [filtered, feed]);

  const totalValue = ownedCards.reduce((s, o) => s + o.value * o.copies, 0);
  const totalCost = ownedCards.reduce((s, o) => s + o.avgCost * o.copies, 0);
  const gain = totalValue - totalCost;
  const gainPct = (gain / totalCost) * 100;

  const strongest = sorted[0];
  const weakest = [...sorted].sort((a, b) => a.change - b.change)[0];
  const highestVolume = [...filtered].sort((a, b) => b.volume - a.volume)[0];

  return (
    <div className="animate-fade space-y-6">
      <PageHeader
        title="Market Intelligence"
        sub="Track movers, scan local demand, and see what your collection is doing in the market right now."
        action={
          <button
            onClick={onScan}
            className="tap rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 text-sm flex items-center gap-2"
          >
            <ScanLine size={15} />
            Scan card
          </button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-2">
              Market pulse
            </div>
            <h2 className="text-2xl font-semibold tracking-tight max-w-2xl">
              Live pricing across the sets and cards you're tracking, updated as the market moves.
            </h2>
            <p className="text-sm text-text-muted mt-3 max-w-2xl leading-relaxed">
              Lion Market is strongest when pricing, demand, and collector movement all feel connected to actual
              decisions: buy, hold, list, or message a seller.
            </p>

            <div className="mt-5">
              <SearchBar
                value={localSearch}
                onChange={setLocalSearch}
                placeholder="Search card name or set"
                onScan={onScan}
              />
            </div>
          </div>

          <div className="p-5 lg:p-6 bg-surface/40">
            <div className="grid grid-cols-2 gap-3">
              <PulseStat label="Top gainer" value={strongest ? strongest.name : '—'} sub={strongest ? `${strongest.change}%` : 'No data'} tone="positive" />
              <PulseStat label="Biggest drop" value={weakest ? weakest.name : '—'} sub={weakest ? `${weakest.change}%` : 'No data'} tone="negative" />
              <PulseStat label="Most watched" value={highestVolume ? highestVolume.name : '—'} sub={highestVolume ? `${highestVolume.volume} vol` : 'No data'} tone="gold" />
              <PulseStat label="Cards tracked" value={String(filtered.length)} sub={`${lang} market`} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold">Market board</div>
                  <div className="text-lg font-semibold mt-1">What is moving right now</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {FEEDS.map((f) => (
                    <Pill
                      key={f}
                      size="sm"
                      tone="muted"
                      active={feed === f}
                      onClick={() => setFeed(f)}
                    >
                      {f}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FilterLabel>Language</FilterLabel>
                  {LANGS.map((l) => (
                    <Pill
                      key={l}
                      size="sm"
                      tone="muted"
                      active={lang === l}
                      onClick={() => setLang(l)}
                    >
                      {l}
                    </Pill>
                  ))}
                </div>

                <span className="hidden sm:block w-px h-4 bg-border" />

                <div className="flex items-center gap-2">
                  <FilterLabel>Window</FilterLabel>
                  {TIMES.map((t) => (
                    <Pill
                      key={t}
                      size="sm"
                      tone="muted"
                      active={time === t}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Wallet size={26} />}
                  title="No matches"
                  sub="Try a different search or language filter."
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {sorted.map((p, i) => (
                  <MarketRow key={p.id} p={p} rank={i + 1} feed={feed} />
                ))}
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
              <SectionTitle action={<Tag tone="gold">{ownedCards.length} cards</Tag>}>
                Collection snapshot
              </SectionTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-b border-border">
              <ValueTile label="Est. value" value={`$${totalValue.toLocaleString()}`} tone="gold" />
              <ValueTile label="Avg cost" value={`$${totalCost.toLocaleString()}`} />
              <ValueTile
                label="Gain / loss"
                value={`${gain >= 0 ? '+' : ''}$${gain.toFixed(0)}`}
                sub={`${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(1)}%`}
                tone={gain >= 0 ? 'positive' : 'negative'}
              />
            </div>

            <div className="divide-y divide-border">
              {ownedCards.map((o) => (
                <OwnedRow key={o.id} o={o} />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Flame size={15} />
              </div>
              <div className="text-sm font-semibold">Signal stack</div>
            </div>

            <div className="space-y-3">
              <InsightRow
                icon={<TrendingUp size={14} className="text-positive" />}
                title="Momentum leaders"
                sub="Modern chase cards are still leading demand in your tracked market."
              />
              <InsightRow
                icon={<Radar size={14} className="text-accent" />}
                title="Local demand"
                sub="Higher listing turnover suggests buyers are still active in nearby zones."
              />
              <InsightRow
                icon={<BarChart3 size={14} className="text-text-muted" />}
                title="Spread watch"
                sub="Best opportunities are where asking prices are lagging recent sale movement."
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">AI note</div>
            <div className="rounded-card border border-border bg-surface px-3.5 py-3.5">
              <div className="flex items-center gap-2 text-accent mb-2">
                <Activity size={14} />
                <span className="text-xs uppercase tracking-[0.16em] font-semibold">Oracle assist</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {strongest ? `${strongest.name} is leading today's movers, up ${strongest.change.toFixed(1)}%.` : 'No standout movers match your current filters.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PulseStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'positive' | 'negative' | 'gold';
}) {
  const valueTone =
    tone === 'positive'
      ? 'text-positive'
      : tone === 'negative'
      ? 'text-negative'
      : tone === 'gold'
      ? 'text-accent'
      : 'text-text';

  return (
    <div className="rounded-card border border-border bg-surface px-4 py-3.5">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className={`text-lg font-semibold mt-1.5 truncate ${valueTone}`}>{value}</div>
      <div className="text-xs text-text-muted mt-1">{sub}</div>
    </div>
  );
}

function ValueTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'gold' | 'positive' | 'negative';
}) {
  const valueTone =
    tone === 'gold'
      ? 'text-accent'
      : tone === 'positive'
      ? 'text-positive'
      : tone === 'negative'
      ? 'text-negative'
      : 'text-text';

  return (
    <div className="bg-surface px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className={`text-2xl font-semibold mt-1.5 ${valueTone}`}>{value}</div>
      {sub && <div className="text-xs mt-1 text-text-muted">{sub}</div>}
    </div>
  );
}

function MarketRow({
  p,
  rank,
  feed,
}: {
  p: PriceCard;
  rank: number;
  feed: string;
}) {
  const up = p.change >= 0;
  const trendPositive = feed === 'Drops' ? false : up;

  return (
    <button className="tap w-full text-left px-4 py-4 hover:bg-surface/40 transition-colors">
      <div className="grid grid-cols-[32px_56px_minmax(0,1fr)_88px] sm:grid-cols-[32px_56px_minmax(0,1fr)_110px_110px_96px] gap-3 items-center">
        <div className="text-xs text-text-faint font-semibold">{rank}</div>

        <img
          src={p.image}
          alt={p.name}
          className="w-14 h-14 rounded object-cover bg-surface-2"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-sm truncate">{p.name}</div>
            {p.grade && <Tag tone="gold">{p.grade}</Tag>}
          </div>

          <div className="text-xs text-text-faint mt-1 truncate">
            {p.set} · {p.lang} · {p.grade || 'Raw'}
          </div>

          <div className="sm:hidden flex items-center gap-3 mt-2">
            <div className="text-base font-semibold">${p.price}</div>
            <div className={`text-xs font-medium ${up ? 'text-positive' : 'text-negative'}`}>
              {up ? '+' : ''}
              {p.change}%
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <div className="text-lg font-semibold">${p.price}</div>
          <div className="text-[11px] text-text-faint mt-0.5">Current</div>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-1 text-sm font-medium">
          {up ? (
            <TrendingUp size={13} className="text-positive" />
          ) : (
            <TrendingDown size={13} className="text-negative" />
          )}
          <span className={up ? 'text-positive' : 'text-negative'}>
            {up ? '+' : ''}
            {p.change}%
          </span>
        </div>

        <div className="text-right">
          <div className="hidden sm:block text-sm text-text-muted">{p.volume} vol</div>
          <div className="mt-1 sm:mt-0 flex justify-end">
            <Trend data={p.trend} positive={trendPositive} height={26} />
          </div>
        </div>
      </div>
    </button>
  );
}

function OwnedRow({ o }: { o: OwnedCard }) {
  const gain = o.value - o.avgCost * o.copies;
  const pct = ((o.value - o.avgCost * o.copies) / (o.avgCost * o.copies)) * 100;
  const up = gain >= 0;

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3 items-center">
        <img src={o.image} alt={o.name} className="w-12 h-12 rounded object-cover bg-surface-2" />

        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{o.name}</div>
          <div className="text-xs text-text-faint mt-1 truncate">
            {o.set} · {o.grade || 'Raw'} · {o.copies} copies
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold">${o.value}</div>
          <div className={`text-xs mt-1 font-medium ${up ? 'text-positive' : 'text-negative'}`}>
            {up ? '+' : ''}
            {pct.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-text-faint mt-1 leading-relaxed">{sub}</div>
      </div>
    </div>
  );
}