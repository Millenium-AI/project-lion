import { useMemo, useState } from 'react';
import {
  Sparkles,
  Search,
  ScanLine,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Radar,
} from 'lucide-react';
import { oracles, Oracle } from '@/data';
import { Card, Chip, Tag, Trend, EmptyState, PageHeader } from '@/components/ui';
import { Modal, ScanModal } from '@/components/Modal';

export function OracleTab() {
  const [group, setGroup] = useState<'mine' | 'shared'>('mine');
  const [askOpen, setAskOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [list, setList] = useState(oracles);

  const shown = useMemo(() => {
    return group === 'mine'
      ? list.filter((o) => !o.author || o.author === 'you')
      : list.filter((o) => o.shared);
  }, [group, list]);

  const filtered = useMemo(() => {
    return shown.filter((o) => !search || o.name.toLowerCase().includes(search.toLowerCase()));
  }, [shown, search]);

  const addOracle = (name: string) => {
    const o: Oracle = {
      id: 'or' + Date.now(),
      name,
      set: 'Paldean Fates',
      grade: 'PSA 10',
      current: 300,
      forecast: [
        { label: 'Current', value: 300, delta: 0 },
        { label: '3M', value: 340, delta: 13.3 },
        { label: '1Y', value: 410, delta: 36.7 },
      ],
      confidence: 72,
      horizon: '12 months',
      reasoning:
        'Simulated prediction based on local supply trends and recent comparable sales.',
      catalysts: ['Set out of print', 'Local demand rising'],
      risks: ['Market pullback'],
      trend: [28, 30, 32, 31, 34, 36, 35, 38, 40, 41, 44, 48],
    };
    setList([o, ...list]);
    setAskOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Forecast with context"
          sub="Use Oracle as a research companion layered on top of real price and listing data."
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-2">
                    Oracle layer
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight max-w-2xl">
                    Your personal card forecasts, ranked by confidence.
                  </h2>
                  <p className="text-sm text-text-muted mt-3 max-w-2xl leading-relaxed">
                    Ask Oracle about a card and get a forecast grounded in current listings and price history.
                  </p>

                  <div className="mt-5 inline-flex rounded-card border border-border bg-surface p-1 w-full max-w-[420px]">
                    {(['mine', 'shared'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGroup(g)}
                        className={`tap flex-1 rounded-[10px] px-4 py-2.5 text-sm font-medium capitalize ${
                          group === g ? 'bg-accent text-accent-ink shadow-soft' : 'text-text-faint hover:text-text'
                        }`}
                      >
                        {g === 'mine' ? 'My Oracle' : 'Shared'}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Tag>1 ask left today</Tag>
                    <Tag tone="gold">3 bonus asks</Tag>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setAskOpen(true)}
                      className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-3.5 text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      Ask Oracle
                    </button>

                    <button
                      onClick={() => setScanOpen(true)}
                      className="tap rounded-card border border-border px-5 py-3.5 text-sm font-medium text-text-muted hover:text-text flex items-center justify-center gap-2"
                    >
                      <ScanLine size={16} />
                      Scan a card
                    </button>
                  </div>
                </div>

                <div className="p-5 lg:p-6 bg-surface/35">
                  <div className="text-sm font-semibold mb-3">How to use Oracle well</div>
                  <div className="space-y-3">
                    <InsightBlock
                      icon={<Radar size={14} className="text-accent" />}
                      title="Use it after pricing"
                      sub="Best when it summarizes movement that already exists in listings and market data."
                    />
                    <InsightBlock
                      icon={<TrendingUp size={14} className="text-positive" />}
                      title="Use it for conviction"
                      sub="Helpful for deciding whether a card is worth tracking, buying, or listing."
                    />
                    <InsightBlock
                      icon={<AlertTriangle size={14} className="text-negative" />}
                      title="Treat as a signal, not a guarantee"
                      sub="Forecasts reflect current trends and can shift as new listings come in."
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2.5 rounded-card border border-border bg-surface px-3.5 py-2.5">
                <Search size={16} className="text-text-faint shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your Oracle cards"
                  className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
                />
              </div>
            </Card>

            {filtered.length === 0 ? (
              <Card className="p-10">
                <EmptyState
                  icon={<Sparkles size={26} />}
                  title="No Oracle cards found"
                  sub="Search or scan a card to generate an AI price forecast."
                />
              </Card>
            ) : (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filtered.map((o) => (
                  <OracleCard key={o.id} o={o} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-sm font-semibold mb-3">Oracle signals</div>
              <div className="space-y-3">
                <SignalCard label="Tracked cards" value={String(filtered.length)} sub="Current visible forecasts" />
                <SignalCard label="Shared ideas" value={String(list.filter((o) => o.shared).length)} sub="Community-visible forecasts" />
                <SignalCard label="High confidence" value={String(filtered.filter((o) => o.confidence >= 75).length)} sub="75% confidence or higher" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-semibold mb-3">How forecasts are built</div>
              <p className="text-sm text-text-muted leading-relaxed">
                Each forecast references live listings, recent price movement, and local demand for that card.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Modal open={askOpen} onClose={() => setAskOpen(false)} title="Ask Oracle">
        <AskOracleForm
          onSubmit={(name) => addOracle(name)}
          onScan={() => {
            setAskOpen(false);
            setScanOpen(true);
          }}
        />
      </Modal>

      <ScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onResult={(name) => {
          addOracle(name);
          setScanOpen(false);
        }}
      />
    </>
  );
}

function AskOracleForm({
  onSubmit,
  onScan,
}: {
  onSubmit: (name: string) => void;
  onScan: () => void;
}) {
  const [name, setName] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Card name</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Charizard ex SIR"
          className="w-full rounded-card bg-surface border border-border px-3.5 py-3 text-sm outline-none placeholder:text-text-faint"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => name.trim() && onSubmit(name)}
          className="tap rounded-card bg-accent px-4 py-3 text-sm font-semibold text-accent-ink"
        >
          Generate forecast
        </button>
        <button
          onClick={onScan}
          className="tap rounded-card border border-border px-4 py-3 text-sm font-medium text-text-muted hover:text-text"
        >
          Scan instead
        </button>
      </div>
    </div>
  );
}

function OracleCard({ o }: { o: Oracle }) {
  const up = o.forecast?.[o.forecast.length - 1]?.value >= o.current;

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-4">
          <img src="smol.png" alt={o.name} className="w-20 h-28 rounded object-cover bg-surface-2 shrink-0" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="font-semibold text-xl tracking-tight">{o.name}</div>
              {o.shared && <Tag tone="gold">Shared</Tag>}
            </div>

            <div className="text-sm text-text-muted">{o.set}</div>
            <div className="text-sm text-text-faint mt-1">{o.grade || 'Raw'} · {o.horizon}</div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Tag tone={up ? 'positive' : 'negative'}>
                {up ? <span className="inline-flex items-center gap-1"><TrendingUp size={12} /> UP</span> : <span className="inline-flex items-center gap-1"><TrendingDown size={12} /> DOWN</span>}
              </Tag>
              <Chip tone="gold">Confidence {o.confidence}</Chip>
            </div>

            <div className="mt-3 text-sm">
              <span className="text-text-faint">Current price · </span>
              <span className="font-semibold text-accent">${o.current.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {o.forecast.map((f) => (
            <div key={f.label} className="rounded-card border border-border bg-surface px-3.5 py-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{f.label}</div>
              <div className="text-lg font-semibold mt-1.5">${f.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-border bg-surface px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="text-sm font-medium">Trend signal</div>
            <Chip tone={up ? 'positive' : 'negative'}>{up ? 'Bullish lean' : 'Risk flagged'}</Chip>
          </div>
          <Trend data={o.trend} positive={up} height={46} />
        </div>

        <div className="text-sm text-text-muted leading-relaxed">{o.reasoning}</div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-card border border-border bg-bg px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-text-faint font-semibold mb-2">Catalysts</div>
            <div className="flex flex-wrap gap-2">
              {o.catalysts.map((c) => (
                <Tag key={c} tone="gold">{c}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-bg px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-text-faint font-semibold mb-2">Risks</div>
            <div className="flex flex-wrap gap-2">
              {o.risks.map((r) => (
                <Tag key={r}>{r}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function InsightBlock({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="rounded-card border border-border bg-bg px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      <div className="text-xs text-text-muted mt-2 leading-relaxed">{sub}</div>
    </div>
  );
}

function SignalCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface px-4 py-3.5">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className="text-2xl font-semibold mt-1.5">{value}</div>
      <div className="text-xs text-text-muted mt-1">{sub}</div>
    </div>
  );
}