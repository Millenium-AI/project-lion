import { useMemo, useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Search,
  Plus,
  MapPin,
  Sparkles,
  Flame,
  Clock3,
  Trophy,
  Users,
} from 'lucide-react';
import { threads, profile } from '@/data';
import { Card, Tag, Avatar, PageHeader, Pill } from '@/components/ui';

const FEEDS = ['Hot', 'New', 'Top', 'Local', 'Shared Oracles'] as const;
const SIDEBAR_TAGS = ['Pokemon', 'Modern', 'Playables', 'High End', 'Miami', 'One Piece'];

export function CrowdTab() {
  const [feed, setFeed] = useState<(typeof FEEDS)[number]>('Hot');
  const [search, setSearch] = useState('');
  const [seg, setSeg] = useState<'all' | 'following'>('all');

  const featured = threads.find((t) => t.featured) ?? threads[0];

  const filtered = useMemo(() => {
    let base = threads;

    if (feed === 'Shared Oracles') base = base.filter((t) => t.type === 'oracle');
    if (feed === 'Local') base = base.filter((t) => t.type === 'local');

    if (search) {
      const q = search.toLowerCase();
      base = base.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (seg === 'following') base = base.filter((_, i) => i % 2 === 0);

    if (feed === 'Top') return [...base].sort((a, b) => b.upvotes - a.upvotes);
    if (feed === 'New') return [...base].reverse();

    return base;
  }, [feed, search, seg]);

  return (
    <div className="animate-fade space-y-6">
      <PageHeader
        title="Crowd"
        sub="A card-first discussion feed for local finds, market calls, buy/sell questions, and shared strategy."
        action={
          <button className="tap rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 text-sm flex items-center gap-2">
            <Plus size={15} />
            New post
          </button>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold mb-2">
              Featured thread
            </div>
            <h2 className="text-2xl font-semibold tracking-tight max-w-2xl">{featured.title}</h2>
            <p className="text-sm text-text-muted mt-3 max-w-2xl leading-relaxed">
              The top thread from local collectors right now, based on upvotes and reply activity.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {featured.tags.slice(0, 4).map((tag) => (
                <Tag key={tag} tone="gold">
                  {tag}
                </Tag>
              ))}
              {featured.type === 'local' && <Tag>Local</Tag>}
              {featured.type === 'oracle' && <Tag>Shared Oracle</Tag>}
            </div>
          </div>

          <div className="p-5 lg:p-6 bg-surface/40">
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Threads" value={String(threads.length)} />
              <MiniStat label="Active today" value="84" />
              <MiniStat label="Miami local" value="19" />
            </div>

            <div className="mt-5 pt-5 border-t border-border space-y-2.5">
              <SidebarSignal icon={<Flame size={14} />} text="Hot topic: local pickup etiquette" />
              <SidebarSignal icon={<Sparkles size={14} />} text="Shared Oracle posts are drawing highest replies" />
              <SidebarSignal icon={<Users size={14} />} text="Collectors want richer post sorting and clearer tags" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="p-3.5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-0 overflow-auto border-b border-border">
                {FEEDS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFeed(f)}
                    className={`tap relative px-4 py-2.5 text-sm font-medium whitespace-nowrap ${
                      feed === f ? 'text-text' : 'text-text-faint hover:text-text-muted'
                    }`}
                  >
                    {f}
                    {feed === f && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex items-center gap-2.5 bg-surface border border-border px-3.5 py-2.5 rounded-card">
                  <Search size={16} className="text-text-faint shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search posts, tags, sets, or local topics"
                    className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-text-faint"
                  />
                </div>

                <div className="inline-flex rounded-card border border-border bg-surface p-1">
                  {(['all', 'following'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeg(s)}
                      className={`tap rounded-[10px] px-3 py-2 text-sm font-medium capitalize ${
                        seg === s ? 'bg-bg text-text shadow-soft' : 'text-text-faint hover:text-text'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-0 overflow-hidden rounded-card border border-border bg-surface">
            {filtered.map((thread, idx) => (
              <ThreadRow key={thread.id ?? idx} thread={thread} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Avatar letter={(profile?.name?.[0] || 'L').toUpperCase()} size="lg" />
              <div className="min-w-0">
                <div className="font-semibold text-sm">{profile?.name || 'Lion Collector'}</div>
                <div className="text-xs text-text-faint mt-0.5">Post market takes, local pickups, and card debates.</div>
              </div>
            </div>

            <button className="tap w-full mt-4 rounded-card bg-accent text-accent-ink font-semibold px-4 py-2.5 text-sm">
              Create post
            </button>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Trending tags</div>
            <div className="flex flex-wrap gap-2">
              {SIDEBAR_TAGS.map((tag) => (
                <Pill key={tag} size="sm" tone="muted">
                  {tag}
                </Pill>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Community pulse</div>
            <div className="space-y-3">
              <PulseRow icon={<MapPin size={14} className="text-accent" />} title="Local pickups" sub="South Beach and Hialeah most active tonight" />
              <PulseRow icon={<Clock3 size={14} className="text-accent" />} title="Fastest threads" sub="Questions with images are getting the quickest replies" />
              <PulseRow icon={<Trophy size={14} className="text-accent" />} title="Best engagement" sub="Market calls with receipts outperform generic opinions" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ThreadRow({ thread }: { thread: any }) {
  const comments = thread.comments ?? thread.replyCount ?? 0;
  const score = thread.upvotes ?? thread.votes ?? 0;
  const author = thread.author ?? 'collector';
  const isOracle = thread.type === 'oracle';
  const isLocal = thread.type === 'local';

  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] border-b border-border last:border-b-0 hover:bg-surface-2/60 transition-colors">
      <div className="flex flex-col items-center justify-start gap-0.5 py-4 px-2 bg-surface-2/60">
        <button className="tap text-text-faint hover:text-text">
          <ArrowBigUp size={18} />
        </button>
        <div className="text-xs font-semibold text-text-muted">{score}</div>
        <button className="tap text-text-faint hover:text-text">
          <ArrowBigDown size={18} />
        </button>
      </div>

      <div className="px-4 py-4 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {isOracle && <Tag tone="gold">Shared Oracle</Tag>}
          {isLocal && <Tag>Local</Tag>}
          {(thread.tags || []).slice(0, 3).map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="font-semibold text-[15px] leading-snug text-text">
          {thread.title}
        </div>

        {thread.body && (
          <p className="text-sm text-text-muted mt-2 line-clamp-2 leading-relaxed">
            {thread.body}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-xs text-text-faint">
          <span>posted by u/{author}</span>
          <span>{thread.area || 'Miami metro'}</span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {comments} comments
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button className="tap rounded-card bg-surface-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-text">
            Open thread
          </button>
          <button className="tap rounded-card bg-surface-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-text">
            Save
          </button>
          <button className="tap rounded-card bg-surface-2 px-3 py-2 text-xs font-medium text-text-muted hover:text-text">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface px-3.5 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint font-medium">{label}</div>
      <div className="text-xl font-semibold mt-1.5">{value}</div>
    </div>
  );
}

function SidebarSignal({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-card border border-border bg-surface px-3 py-3 text-sm text-text-muted">
      <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function PulseRow({
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
      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-text-faint mt-1">{sub}</div>
      </div>
    </div>
  );
}