import { useState } from 'react';
import { Sparkles, Search, ScanLine, Zap, TrendingUp, TrendingDown, AlertTriangle, Users, ChevronRight } from 'lucide-react';
import { oracles, Oracle } from '@/data';
import { Pill, Card, Chip, Tag, Trend, Avatar, PageHeader, SectionTitle, EmptyState } from '@/components/ui';
import { Modal, ScanModal } from '@/components/Modal';

export function OracleTab() {
  const [group, setGroup] = useState<'mine' | 'shared'>('mine');
  const [askOpen, setAskOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [list, setList] = useState(oracles);

  const shown = group === 'mine' ? list.filter((o) => !o.author || o.author === 'you') : list.filter((o) => o.shared);
  const filtered = shown.filter((o) => !search || o.name.toLowerCase().includes(search.toLowerCase()));

  const addOracle = (name: string) => {
    const o: Oracle = {
      id: 'or' + Date.now(), name, set: 'Paldean Fates', grade: 'PSA 10', current: 300,
      forecast: [{ label: 'Current', value: 300, delta: 0 }, { label: '3M', value: 340, delta: 13.3 }, { label: '1Y', value: 410, delta: 36.7 }],
      confidence: 72, horizon: '12 months',
      reasoning: 'Simulated prediction based on local supply trends and recent comparable sales.',
      catalysts: ['Set out of print', 'Local demand rising'],
      risks: ['Market pullback'],
      trend: [28,30,32,31,34,36,35,38,40,41,44,48],
    };
    setList([o, ...list]);
    setAskOpen(false);
  };

  return (
    <div className="animate-fade">
      <PageHeader title="Oracle" sub="AI price forecasts and market intelligence" />

      {/* Ask card */}
      <Card className="p-5 mb-6 border-accent/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={18} className="text-accent" />
              <span className="font-semibold">Ask the Oracle</span>
            </div>
            <div className="text-sm text-text-muted">Generate an AI price forecast for any card.</div>
            <div className="flex items-center gap-3 mt-3">
              <Tag tone="gold">5 asks left</Tag>
              <span className="text-xs text-text-faint">+2 bonus</span>
            </div>
          </div>
          <button onClick={() => setAskOpen(true)} className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-2.5 text-sm flex items-center gap-2 shrink-0">
            <Zap size={15} /> Ask Oracle
          </button>
        </div>
      </Card>

      {/* Group tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-5">
        {(['mine', 'shared'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`tap px-4 py-2.5 text-sm font-medium relative ${group === g ? 'text-text' : 'text-text-faint hover:text-text-muted'}`}
          >
            {g === 'mine' ? 'My Oracle' : 'Shared'}
            {group === g && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2.5 bg-surface border border-border px-3.5 py-2.5">
          <Search size={16} className="text-text-faint shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search previous oracle requests" className="bg-transparent outline-none text-sm flex-1 placeholder:text-text-faint" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={26} />}
          title={group === 'mine' ? 'No oracle requests yet' : 'No shared oracles'}
          sub={group === 'mine' ? 'Ask the Oracle to predict a card\'s price direction.' : 'Shared community forecasts will appear here.'}
          action={group === 'mine' ? <button onClick={() => setAskOpen(true)} className="tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-2.5 text-sm">Ask Oracle</button> : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => <OracleCard key={o.id} o={o} />)}
        </div>
      )}

      <Modal open={askOpen} onClose={() => setAskOpen(false)} title="Ask the Oracle">
        <p className="text-sm text-text-muted mb-4">Search or scan a card to generate an AI price forecast.</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="tap rounded-card bg-surface-2 border border-border p-4 text-left" onClick={() => { setAskOpen(false); setScanOpen(true); }}>
            <ScanLine size={20} className="text-accent mb-2" />
            <div className="font-medium text-sm">Scan card</div>
            <div className="text-xs text-text-muted">Use your camera</div>
          </button>
          <button className="tap rounded-card bg-surface-2 border border-border p-4 text-left" onClick={() => addOracle('Rayquaza VMAX - Alt Art')}>
            <Search size={20} className="text-accent mb-2" />
            <div className="font-medium text-sm">Search by name</div>
            <div className="text-xs text-text-muted">Type a card name</div>
          </button>
        </div>
        <div className="text-[11px] uppercase tracking-wider text-text-faint font-medium mb-2">Recent searches</div>
        <div className="flex flex-wrap gap-2">
          {['Charizard ex SIR', 'Umbreon VMAX alt', 'Lugia V alt'].map((s) => (
            <Pill key={s} size="sm" onClick={() => addOracle(s)}>{s}</Pill>
          ))}
        </div>
      </Modal>

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} onResult={addOracle} />
    </div>
  );
}

function OracleCard({ o }: { o: Oracle }) {
  const [open, setOpen] = useState(false);
  const up = o.forecast[2].delta >= 0;
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded bg-surface-3 text-accent flex items-center justify-center font-bold text-lg shrink-0">{o.name[0]}</div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{o.name}</div>
              <div className="text-xs text-text-faint mt-0.5">{o.set} · {o.grade || 'Raw'}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Chip tone="gold">Confidence {o.confidence}%</Chip>
            {o.shared && <Chip>Shared</Chip>}
          </div>
        </div>
      </div>

      {/* Forecast modules */}
      <div className="grid grid-cols-3 gap-px bg-border">
        {o.forecast.map((f, i) => (
          <div key={f.label} className={`p-3.5 ${i === 2 ? 'bg-accent/5' : 'bg-surface'}`}>
            <div className="text-[11px] text-text-faint uppercase tracking-wider font-medium">{f.label}</div>
            <div className={`text-xl font-bold mt-1 ${i === 2 ? 'text-accent' : 'text-text'}`}>${f.value}</div>
            <div className={`text-xs font-medium mt-0.5 ${f.delta > 0 ? 'text-positive' : f.delta < 0 ? 'text-negative' : 'text-text-faint'}`}>
              {f.delta > 0 ? '+' : ''}{f.delta}%
            </div>
          </div>
        ))}
      </div>

      {/* Trend + horizon */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="text-xs text-text-muted">Horizon: <span className="text-text">{o.horizon}</span></div>
        <Trend data={o.trend} positive={up} height={32} />
      </div>

      {/* Expandable reasoning */}
      <button onClick={() => setOpen(!open)} className="tap w-full flex items-center justify-between px-4 py-2.5 text-sm text-accent font-medium border-t border-border hover:bg-surface-2/50">
        {open ? 'Hide analysis' : 'View analysis'}
        <ChevronRight size={15} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 animate-fade border-t border-border pt-4">
          <div>
            <div className="text-[11px] font-semibold text-text-faint uppercase tracking-wider mb-1.5">Reasoning</div>
            <div className="text-sm text-text-muted leading-relaxed">{o.reasoning}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-positive uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp size={12} /> Catalysts</div>
            <div className="space-y-1.5">
              {o.catalysts.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="w-1 h-1 rounded-full bg-positive" /> {c}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-negative uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Risk factors</div>
            <div className="space-y-1.5">
              {o.risks.map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="w-1 h-1 rounded-full bg-negative" /> {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {o.shared && o.author && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-surface-2/30">
          <Avatar letter={o.author[0].toUpperCase()} size="sm" />
          <span className="text-xs text-text-muted">Shared by {o.author}</span>
          <span className="text-xs text-text-faint ml-auto flex items-center gap-1"><Users size={11} /> {o.votes} upvotes</span>
        </div>
      )}
    </Card>
  );
}
