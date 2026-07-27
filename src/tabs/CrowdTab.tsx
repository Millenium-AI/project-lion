import { useState } from 'react';
import { MessageCircle, ArrowUp, Plus, Search, Sparkles, MapPin } from 'lucide-react';
import { threads, Thread, profile } from '@/data';
import { Pill, Card, Chip, Tag, Avatar, PageHeader, SectionTitle } from '@/components/ui';

const FEEDS = ['Trending', 'Shared Oracles', 'General', 'Local'];

export function CrowdTab() {
  const [seg, setSeg] = useState<'all' | 'following'>('all');
  const [feed, setFeed] = useState('Trending');
  const [search, setSearch] = useState('');

  let filtered = threads;
  if (feed === 'Shared Oracles') filtered = threads.filter((t) => t.type === 'oracle');
  if (feed === 'General') filtered = threads.filter((t) => t.type === 'general');
  if (feed === 'Local') filtered = threads.filter((t) => t.type === 'local');
  if (search) filtered = filtered.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

  const featured = threads.find((t) => t.featured);

  return (
    <div className="animate-fade">
      <PageHeader title="Crowd" sub="Community intelligence and discussion" />

      {/* Profile summary */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center overflow-hidden">
            <img src="/smol.png" alt="Lion Collector" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{profile.name}</div>
            <div className="text-xs text-text-muted">{profile.handle} · {profile.reputation}★ reputation</div>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Followers" value={profile.followers} />
            <Stat label="Following" value={profile.following} />
            <Stat label="Oracles" value={profile.oracles} />
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 bg-surface border border-border px-3.5 py-2.5">
          <Search size={16} className="text-text-faint shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search threads and tags" className="bg-transparent outline-none text-sm flex-1 placeholder:text-text-faint" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-0 border-b border-border">
          {(['all', 'following'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className={`tap px-4 py-2.5 text-sm font-medium capitalize relative ${seg === s ? 'text-text' : 'text-text-faint hover:text-text-muted'}`}
            >
              {s}
              {seg === s && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {FEEDS.map((f) => <Pill key={f} size="sm" active={feed === f} onClick={() => setFeed(f)}>{f}</Pill>)}
        </div>
      </div>

      {/* Featured block */}
      {featured && feed === 'Trending' && (
        <Card className="p-5 mb-5 border-accent/25 bg-gradient-to-br from-accent/8 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={15} className="text-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">Featured Oracle</span>
          </div>
          <div className="text-lg font-semibold mb-1">{featured.title}</div>
          <div className="text-sm text-text-muted mb-3 leading-relaxed">{featured.preview}</div>
          <div className="flex items-center gap-4 text-xs text-text-muted pt-3 border-t border-border">
            <span className="flex items-center gap-1"><ArrowUp size={12} className="text-accent" />{featured.votes}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} />{featured.comments}</span>
            <span className="flex items-center gap-1.5"><Avatar letter={featured.avatar} size="sm" />{featured.author}</span>
          </div>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-px bg-border rounded-card overflow-hidden">
        {filtered.map((t) => <ThreadCard key={t.id} t={t} />)}
      </div>

      <button className="fixed right-4 bottom-20 lg:bottom-8 lg:right-8 z-30 tap rounded-card bg-accent text-accent-ink font-semibold px-5 py-3 shadow-soft flex items-center gap-2 text-sm">
        <Plus size={18} /> Post
      </button>
    </div>
  );
}

function ThreadCard({ t }: { t: Thread }) {
  return (
    <div className="bg-surface p-4 tap cursor-pointer hover:bg-surface-2/50">
      <div className="flex items-start gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 w-10">
          <button className="tap text-text-faint hover:text-accent"><ArrowUp size={16} /></button>
          <span className="text-sm font-semibold text-text">{t.votes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {t.type === 'oracle' && <Tag tone="gold">Oracle</Tag>}
            {t.type === 'local' && <Tag><span className="flex items-center gap-1"><MapPin size={10} />Local</span></Tag>}
            {t.tags.filter((tag) => tag !== 'Oracle' && tag !== 'Local').map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <div className="font-medium text-sm mb-1">{t.title}</div>
          <div className="text-sm text-text-muted leading-relaxed">{t.preview}</div>
          <div className="flex items-center gap-3 mt-2.5 text-xs text-text-faint">
            <span className="flex items-center gap-1.5"><Avatar letter={t.avatar} size="sm" />{t.author}</span>
            <span>· {t.time}</span>
            <span className="flex items-center gap-1 ml-auto"><MessageCircle size={12} />{t.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-right">
      <div className="text-base font-semibold">{value}</div>
      <div className="text-[11px] text-text-faint">{label}</div>
    </div>
  );
}
