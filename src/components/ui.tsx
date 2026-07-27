import { ReactNode } from 'react';

type Tone = 'default' | 'gold' | 'positive' | 'negative' | 'muted';

export function Pill({
  active,
  children,
  onClick,
  size = 'md',
  tone = 'default',
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md';
  tone?: Tone;
}) {
  const base =
    'tap inline-flex items-center justify-center rounded-full border transition-colors whitespace-nowrap';
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs font-medium' : 'px-4 py-2 text-sm font-medium';

  const tones: Record<Tone, string> = {
    default: active
      ? 'border-text bg-text text-bg shadow-soft'
      : 'border-border bg-surface text-text-muted hover:text-text hover:bg-surface-2',
    gold: active
      ? 'border-accent bg-accent text-accent-ink shadow-soft'
      : 'border-accent/25 bg-accent/8 text-accent hover:bg-accent/14',
    positive: active
      ? 'border-positive/30 bg-positive text-white shadow-soft'
      : 'border-positive/20 bg-positive/10 text-positive hover:bg-positive/15',
    negative: active
      ? 'border-negative/30 bg-negative text-white shadow-soft'
      : 'border-negative/20 bg-negative/10 text-negative hover:bg-negative/15',
    muted: active
      ? 'border-border bg-surface-3 text-text shadow-soft'
      : 'border-border bg-surface text-text-faint hover:text-text hover:bg-surface-2',
  };

  return (
    <button onClick={onClick} className={`${base} ${sizeClass} ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; icon?: ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-[18px] border border-border bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`tap inline-flex items-center gap-1.5 rounded-[14px] px-4 py-2.5 text-sm font-medium transition-colors ${
            value === o.value
              ? 'bg-accent text-accent-ink shadow-soft'
              : 'text-text-faint hover:text-text hover:bg-surface-2'
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  onScan,
  size = 'md',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onScan?: () => void;
  size?: 'sm' | 'md';
}) {
  const py = size === 'sm' ? 'py-2' : 'py-3';

  return (
    <div className={`flex items-center gap-2.5 rounded-[20px] border border-border bg-surface px-3.5 ${py}`}>
      <SearchIcon />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search cards, sets, sellers'}
        className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
      />
      {onScan && (
        <button
          onClick={onScan}
          className="tap rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/15 shrink-0"
        >
          Scan
        </button>
      )}
    </div>
  );
}

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';

  return (
    <Comp
      onClick={onClick}
      className={`rounded-[24px] border border-border bg-surface shadow-soft text-left ${onClick ? 'tap hover:bg-surface-2 transition-colors' : ''} ${className}`}
    >
      {children}
    </Comp>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'positive' | 'negative' | 'gold';
}) {
  const toneClass =
    tone === 'positive'
      ? 'text-positive'
      : tone === 'negative'
      ? 'text-negative'
      : tone === 'gold'
      ? 'text-accent'
      : 'text-text';

  return (
    <div className="rounded-[20px] border border-border bg-bg px-4 py-3.5">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className={`text-2xl font-semibold mt-1.5 ${toneClass}`}>{value}</div>
      {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
    </div>
  );
}

export function Chip({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'gold' | 'positive' | 'negative';
}) {
  const tones: Record<'default' | 'gold' | 'positive' | 'negative', string> = {
    default: 'text-text-muted',
    gold: 'text-accent',
    positive: 'text-positive',
    negative: 'text-negative',
  };

  return <span className={`inline-flex items-center gap-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Tag({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'gold' | 'positive' | 'negative';
}) {
  const tones: Record<'default' | 'gold' | 'positive' | 'negative', string> = {
    default: 'border-border bg-surface-3 text-text-muted',
    gold: 'border-accent/25 bg-accent/10 text-accent',
    positive: 'border-positive/20 bg-positive/10 text-positive',
    negative: 'border-negative/20 bg-negative/10 text-negative',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Avatar({
  letter,
  size = 'md',
}: {
  letter: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const s =
    size === 'lg'
      ? 'w-11 h-11 text-base'
      : size === 'sm'
      ? 'w-7 h-7 text-xs'
      : 'w-9 h-9 text-sm';

  return (
    <div
      className={`${s} rounded-full border border-border bg-surface-3 text-accent font-semibold flex items-center justify-center shrink-0`}
    >
      {letter}
    </div>
  );
}

export function Trend({
  data,
  className = '',
  positive,
  height = 32,
}: {
  data: number[];
  className?: string;
  positive?: boolean;
  height?: number;
}) {
  const w = 96;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * (h - 4) - 2}`)
    .join(' ');
  const color = positive === false ? '#d06d62' : '#e8b24c';

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
      <StarIcon />
      {rating.toFixed(1)}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  sub,
  action,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-14 h-14 rounded-full border border-border bg-surface-2 text-text-faint flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{title}</div>
      {sub && <div className="text-sm text-text-muted mt-2 max-w-md leading-relaxed">{sub}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-sm text-text-muted mt-2 max-w-3xl leading-relaxed">{sub}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-border bg-surface px-3 py-3">
      {children}
    </div>
  );
}

export function FilterLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-semibold">
      {children}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-faint shrink-0">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z" />
    </svg>
  );
}