import { ReactNode } from 'react';

export function Pill({
  active, children, onClick, size = 'md', tone = 'default',
}: {
  active?: boolean; children: ReactNode; onClick?: () => void;
  size?: 'sm' | 'md'; tone?: 'default' | 'gold' | 'positive' | 'negative' | 'muted';
}) {
  const tones: Record<string, string> = {
    default: active
      ? 'bg-text text-bg font-semibold'
      : 'text-text-muted hover:text-text',
    gold: active
      ? 'bg-accent text-accent-ink font-semibold'
      : 'text-accent/70 hover:text-accent',
    positive: active ? 'bg-positive/15 text-positive font-semibold' : 'text-positive/70',
    negative: active ? 'bg-negative/15 text-negative font-semibold' : 'text-negative/70',
    muted: active ? 'bg-surface-3 text-text' : 'text-text-faint hover:text-text-muted',
  };
  return (
    <button
      onClick={onClick}
      className={`tap whitespace-nowrap ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'} ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Segmented({
  options, value, onChange,
}: {
  options: { label: string; value: string; icon?: ReactNode }[];
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0 border-b border-border">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`tap flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium relative ${
            value === o.value ? 'text-text' : 'text-text-faint hover:text-text-muted'
          }`}
        >
          {o.icon}
          {o.label}
          {value === o.value && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({
  value, onChange, placeholder, onScan, size = 'md',
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; onScan?: () => void; size?: 'sm' | 'md';
}) {
  return (
    <div className={`flex items-center gap-2.5 bg-surface border border-border px-3.5 ${size === 'sm' ? 'py-2' : 'py-2.5'}`}>
      <SearchIcon />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search cards, sets, sellers'}
        className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
      />
      {onScan && (
        <button onClick={onScan} className="tap text-accent hover:text-accent-strong text-xs font-medium shrink-0">
          Scan
        </button>
      )}
    </div>
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-card bg-surface border border-border ${onClick ? 'tap cursor-pointer hover:border-accent/25' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'positive' | 'negative' | 'gold' }) {
  const toneClass = tone === 'positive' ? 'text-positive' : tone === 'negative' ? 'text-negative' : tone === 'gold' ? 'text-accent' : 'text-text';
  return (
    <div className="px-4 py-3.5">
      <div className="text-[11px] text-text-faint uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-2xl font-bold mt-1.5 tracking-tight ${toneClass}`}>{value}</div>
      {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'gold' | 'positive' | 'negative' }) {
  const tones: Record<string, string> = {
    default: 'text-text-muted',
    gold: 'text-accent',
    positive: 'text-positive',
    negative: 'text-negative',
  };
  return <span className={`text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'gold' | 'positive' | 'negative' }) {
  const tones: Record<string, string> = {
    default: 'bg-surface-3 text-text-muted',
    gold: 'bg-accent/10 text-accent',
    positive: 'bg-positive/10 text-positive',
    negative: 'bg-negative/10 text-negative',
  };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${tones[tone]}`}>{children}</span>;
}

export function Avatar({ letter, size = 'md' }: { letter: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'w-11 h-11 text-base' : size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${s} rounded-full bg-surface-3 text-accent font-semibold flex items-center justify-center shrink-0`}>
      {letter}
    </div>
  );
}

export function Trend({ data, className = '', positive, height = 32 }: { data: number[]; className?: string; positive?: boolean; height?: number }) {
  const w = 96, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * (h - 4) - 2}`).join(' ');
  const color = positive === false ? '#d06d62' : '#e8b24c';
  return (
    <svg width={w} height={h} className={className} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <StarIcon />
      <span className="text-text-muted">{rating.toFixed(1)}</span>
    </span>
  );
}

export function EmptyState({ icon, title, sub, action }: { icon: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade">
      <div className="w-14 h-14 rounded-card bg-surface-2 border border-border flex items-center justify-center text-text-faint mb-4">
        {icon}
      </div>
      <div className="text-base font-semibold text-text">{title}</div>
      {sub && <div className="text-sm text-text-muted mt-1 max-w-sm">{sub}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-text-faint">{children}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="text-sm text-text-muted mt-1">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 flex-wrap mb-5">
      {children}
    </div>
  );
}

export function FilterLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] uppercase tracking-wider text-text-faint font-medium mr-1.5">{children}</span>;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-faint shrink-0">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.7 21.2 7 14.2 2 9.4l7-.9z" /></svg>
  );
}
