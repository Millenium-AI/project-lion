import { useState } from 'react';
import { Sparkles, Send, MessageSquare, Bot } from 'lucide-react';
import { conversations, Conversation } from '@/data';
import { Pill, Card, Chip, Avatar, EmptyState, PageHeader } from '@/components/ui';

const SUGGESTED = ['Sounds good, see you there.', 'Can you do $5 less?', 'I can meet tomorrow instead.', 'Is it still available?'];

export function MsgTab() {
  const [seg, setSeg] = useState<'autopilot' | 'yours'>('autopilot');
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling' | 'archive'>('all');
  const [active, setActive] = useState<Conversation | null>(conversations[0]);
  const [draft, setDraft] = useState('');

  const filtered = conversations.filter((c) => {
    if (seg === 'autopilot' && !c.autopilot) return false;
    if (filter === 'buying') return c.role === 'buying';
    if (filter === 'selling') return c.role === 'selling';
    if (filter === 'archive') return c.status === 'sold';
    return true;
  });

  const send = () => {
    if (!draft.trim() || !active) return;
    setActive({ ...active, messages: [...active.messages, { from: 'me', text: draft, time: 'now' }] });
    setDraft('');
  };

  return (
    <div className="animate-fade">
      <PageHeader title="Messages" sub="Chat and AI autopilot for your deals" />

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-0 border-b border-border">
          {(['autopilot', 'yours'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeg(s)}
              className={`tap px-4 py-2.5 text-sm font-medium capitalize flex items-center gap-1.5 relative ${seg === s ? 'text-text' : 'text-text-faint hover:text-text-muted'}`}
            >
              {s === 'autopilot' && <Sparkles size={14} />} {s}
              {seg === s && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(['all', 'buying', 'selling', 'archive'] as const).map((f) => (
            <Pill key={f} size="sm" active={filter === f} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</Pill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<MessageSquare size={26} />} title="No conversations" sub="When buyers or sellers message you, chats show up here." />
      ) : (
        <div className="grid lg:grid-cols-[300px_1fr] gap-px bg-border rounded-card overflow-hidden h-[600px]">
          {/* List */}
          <div className="bg-surface overflow-y-auto no-scrollbar">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className={`tap w-full text-left p-3 border-b border-border ${active?.id === c.id ? 'bg-surface-2' : 'hover:bg-surface-2/50'}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar letter={c.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm truncate">{c.name}</div>
                      <div className="text-[11px] text-text-faint shrink-0">{c.time}</div>
                    </div>
                    <div className="text-xs text-text-muted truncate mt-0.5">{c.last}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusChip status={c.status} />
                      {c.autopilot && <Chip tone="gold">Autopilot</Chip>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Chat panel */}
          {active && (
            <div className="bg-surface flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 p-3 border-b border-border">
                <Avatar letter={active.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{active.name}</div>
                  <div className="text-[11px] text-text-muted capitalize">{active.role} · {active.status.replace('_', ' ')}</div>
                </div>
                <button
                  onClick={() => setActive({ ...active, autopilot: !active.autopilot })}
                  className={`tap px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded ${
                    active.autopilot ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-text-muted'
                  }`}
                >
                  <Bot size={13} /> {active.autopilot ? 'Autopilot on' : 'Autopilot off'}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                {active.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {m.from === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <Sparkles size={11} />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-3.5 py-2.5 text-sm ${
                      m.from === 'me' ? 'bg-surface-3 text-text' :
                      m.from === 'ai' ? 'bg-accent/10 text-text border border-accent/20' :
                      'bg-surface-2 text-text'
                    }`}>
                      {m.from === 'ai' && <div className="text-[10px] font-semibold uppercase tracking-wide text-accent mb-1">AI Autopilot</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested replies */}
              <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar border-t border-border">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => setDraft(s)} className="tap shrink-0 bg-surface-2 border border-border px-3 py-1.5 text-xs text-text-muted">{s}</button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 flex items-center gap-2 border-t border-border">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Message…"
                  className="flex-1 bg-surface-2 border border-border px-3.5 py-2 text-sm outline-none placeholder:text-text-faint"
                />
                <button onClick={send} className="tap w-9 h-9 rounded bg-accent text-accent-ink flex items-center justify-center shrink-0">
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button className="tap w-full mt-5 rounded-card border border-border py-2.5 text-sm font-medium text-text-muted hover:text-text">
        Take over all conversations manually
      </button>
    </div>
  );
}

function StatusChip({ status }: { status: Conversation['status'] }) {
  const map: Record<string, 'gold' | 'positive' | 'negative' | 'default'> = {
    negotiating: 'gold', awaiting: 'default', meetup: 'positive', sold: 'negative',
  };
  return <Chip tone={map[status]}>{status.replace('_', ' ')}</Chip>;
}
