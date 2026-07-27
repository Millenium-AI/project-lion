import { useMemo, useState } from 'react';
import {
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  Search,
  Archive,
  MapPin,
  ShieldCheck,
  Clock3,
} from 'lucide-react';
import { conversations, Conversation } from '@/data';
import { Pill, Card, Avatar, EmptyState, Tag } from '@/components/ui';

const SUGGESTED = [
  'Sounds good, see you there.',
  'Can you do $5 less?',
  'I can meet tomorrow instead.',
  'Is it still available?',
];

export function MsgTab() {
  const [seg, setSeg] = useState<'autopilot' | 'yours'>('yours');
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling' | 'archive'>('all');
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (seg === 'autopilot' && !c.autopilot) return false;
      if (filter === 'buying') return c.role === 'buying';
      if (filter === 'selling') return c.role === 'selling';
      if (filter === 'archive') return c.status === 'sold';
      return true;
    });
  }, [seg, filter]);

  const active = filtered.find((c) => c.id === activeId) ?? filtered[0] ?? null;

  const send = () => {
    if (!draft.trim() || !active) return;
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-text-faint font-semibold">Inbox mode</div>
                <div className="text-lg font-semibold mt-1">Conversation routing</div>
              </div>
              <Tag tone="gold">{filtered.length} active</Tag>
            </div>

            <div className="inline-flex rounded-card border border-border bg-surface p-1 w-full">
              {(['autopilot', 'yours'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeg(s)}
                  className={`tap flex-1 rounded-[10px] px-4 py-2.5 text-sm font-medium capitalize ${
                    seg === s ? 'bg-accent text-accent-ink shadow-soft' : 'text-text-faint hover:text-text'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {s === 'autopilot' && <Bot size={14} />}
                    {s}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2.5 rounded-card border border-border bg-surface px-3.5 py-2.5">
              <Search size={16} className="text-text-faint shrink-0" />
              <input
                placeholder="Search people, cards, or deals"
                className="bg-transparent outline-none text-sm text-text placeholder:text-text-faint flex-1 min-w-0"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(['all', 'buying', 'selling', 'archive'] as const).map((f) => (
                <Pill
                  key={f}
                  size="sm"
                  tone="muted"
                  active={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </Pill>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <div className="text-sm font-semibold">Inbox</div>
              <div className="text-xs text-text-faint mt-1">
                Website version should feel like a real deal desk, not just a mobile message list.
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<MessageSquare size={24} />}
                  title="No conversations"
                  sub="When buyers or sellers message you, chats show up here."
                />
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[620px] overflow-auto">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`tap w-full text-left px-4 py-4 transition-colors ${
                      active?.id === c.id ? 'bg-surface-2' : 'hover:bg-surface/45'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar letter={c.name?.[0]?.toUpperCase?.() || 'C'} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-sm truncate">{c.name}</div>
                          <div className="text-[11px] text-text-faint shrink-0">{c.time}</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <StatusChip status={c.status} />
                          <Tag>{c.role}</Tag>
                          {c.autopilot && <Tag tone="gold">Autopilot</Tag>}
                        </div>

                        <div className="text-xs text-text-muted mt-2 truncate">{c.last}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </aside>

        <div className="min-w-0">
          {!active ? (
            <Card className="p-10">
              <EmptyState
                icon={<MessageSquare size={26} />}
                title="Select a conversation"
                sub="Choose a buyer or seller thread to open the full chat workspace."
              />
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
                  <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <Avatar letter={active.name?.[0]?.toUpperCase?.() || 'C'} size="lg" />
                        <div className="min-w-0">
                          <div className="text-lg font-semibold truncate">{active.name}</div>
                          <div className="text-sm text-text-muted mt-0.5">
                            {active.role} · {active.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`tap rounded-card px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 ${
                        active.autopilot
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-surface border border-border text-text-muted'
                      }`}
                    >
                      <Sparkles size={13} />
                      {active.autopilot ? 'Autopilot on' : 'Autopilot off'}
                    </button>
                  </div>

                  <div className="px-5 py-4 space-y-3 max-h-[620px] overflow-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0))]">
                    {active.messages.map((m, i) => {
                      const isMe = m.from === 'me';
                      const isAI = m.from === 'ai';

                      return (
                        <div
                          key={i}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-[18px] px-4 py-3 ${
                              isMe
                                ? 'bg-accent text-accent-ink'
                                : isAI
                                ? 'bg-accent/10 border border-accent/20 text-text'
                                : 'bg-surface border border-border text-text'
                            }`}
                          >
                            {isAI && (
                              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-accent font-semibold mb-1.5">
                                <Sparkles size={11} />
                                AI Autopilot
                              </div>
                            )}

                            <div className="text-sm leading-relaxed">{m.text}</div>
                            <div
                              className={`text-[11px] mt-2 ${
                                isMe ? 'text-accent-ink/75' : 'text-text-faint'
                              }`}
                            >
                              {m.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-5 py-4 border-t border-border">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          onClick={() => setDraft(s)}
                          className="tap rounded-full bg-surface border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder="Message…"
                        className="flex-1 rounded-card bg-surface border border-border px-3.5 py-3 text-sm outline-none placeholder:text-text-faint"
                      />
                      <button
                        onClick={send}
                        className="tap rounded-card bg-accent px-4 py-3 text-accent-ink font-semibold flex items-center gap-2"
                      >
                        <Send size={15} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface/35 space-y-4">
                  <div>
                    <div className="text-sm font-semibold">Deal context</div>
                    <div className="text-xs text-text-faint mt-1">
                      This sidebar is the kind of website-only utility the mobile layout cannot really show well.
                    </div>
                  </div>

                  <InfoCard
                    icon={<ShieldCheck size={14} className="text-accent" />}
                    title="Trust signal"
                    sub="Conversation tied to an active marketplace identity."
                  />
                  <InfoCard
                    icon={<MapPin size={14} className="text-accent" />}
                    title="Meetup area"
                    sub="Phoenix metro pickup zones should surface here next."
                  />
                  <InfoCard
                    icon={<Clock3 size={14} className="text-accent" />}
                    title="Response speed"
                    sub="Autopilot helps keep low-friction buyer replies moving."
                  />

                  <div className="rounded-card border border-border bg-bg px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-text-faint font-semibold mb-2">
                      Manual override
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Take over all conversations manually when a deal becomes high-value, time-sensitive, or
                      location-specific.
                    </p>
                    <button className="tap mt-4 w-full rounded-card border border-border px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text">
                      Take over manually
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
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

function StatusChip({ status }: { status: Conversation['status'] }) {
  const map: Record<Conversation['status'], 'default' | 'gold' | 'positive' | 'negative'> = {
    negotiating: 'gold',
    awaiting: 'default',
    meetup: 'positive',
    sold: 'negative',
  };

  return <Tag tone={map[status]}>{status.replace('_', ' ')}</Tag>;
}