import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { AppBar } from '@/components/layout/AppBar';
import { Button, buttonVariants } from '@/components/ui/button';
import { SessionRow } from '@/components/sessions/SessionRow';
import { DATE_GROUPS, dateGroup } from '@/lib/dates';
import { plural } from '@/lib/utils';
import { lastActive, useSessions, useSortedSessions } from '@/store/sessions';

export function SessionsPage() {
  const sessions = useSortedSessions();
  const clearAll = useSessions((s) => s.clearAll);
  const [needle, setNeedle] = useState('');
  const [sort, setSort] = useState<'recent' | 'queries'>('recent');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    document.title = 'All sessions · Mesh-AI';
  }, []);

  const shown = useMemo(() => {
    const q = needle.trim().toLowerCase();
    return q ? sessions.filter((s) => s.queries.some((x) => x.text.toLowerCase().includes(q))) : sessions;
  }, [sessions, needle]);

  const groups = useMemo(() => {
    if (sort === 'queries') return [{ label: 'Most queries first', items: [...shown].sort((a, b) => b.queries.length - a.queries.length) }];
    return DATE_GROUPS.map((label) => ({ label, items: shown.filter((s) => dateGroup(lastActive(s)) === label) })).filter((g) => g.items.length);
  }, [shown, sort]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar variant="sessions" />
      <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col gap-5 px-6 pb-14 pt-8">
        <div>
          <h1 className="m-0 text-[26px] font-bold leading-tight tracking-[-0.01em]">All sessions</h1>
          <p className="mb-0 mt-1 text-[15px] text-muted">
            Each search from the home page starts a session, and its follow-ups stay inside it. Open one to pick up where you left off.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div role="status" className="flex flex-col items-start gap-3 rounded-[14px] border border-dashed border-[#b9c5bf] bg-surface px-6 py-7">
            <p className="m-0 text-base font-semibold">No sessions yet</p>
            <p className="m-0 text-[15px] text-muted">Each search you make starts a session, and it will appear here.</p>
            <Link to="/" className={buttonVariants()}>
              Start a search
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <div className="flex min-h-[42px] min-w-0 flex-[1_1_320px] items-center gap-2 rounded-[10px] border border-field bg-surface px-3 text-muted">
                <Search className="size-4" aria-hidden="true" />
                <label htmlFor="session-search" className="sr-only">
                  Search your sessions
                </label>
                <input
                  id="session-search"
                  type="search"
                  value={needle}
                  onChange={(e) => setNeedle(e.target.value)}
                  placeholder="Search your sessions"
                  className="h-10 min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <label htmlFor="session-sort">Sort</label>
                <select
                  id="session-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'recent' | 'queries')}
                  className="min-h-[42px] rounded-[10px] border border-field bg-surface px-2.5 text-sm text-ink"
                >
                  <option value="recent">Most recent</option>
                  <option value="queries">Most queries</option>
                </select>
              </div>
            </div>
            <p role="status" className="-mt-2 mb-0 ml-0.5 text-[13px] text-muted-2">
              {needle.trim() ? `${shown.length} of ${plural(sessions.length, 'session', 'sessions')} match` : plural(sessions.length, 'session', 'sessions')}
            </p>

            {shown.length === 0 ? (
              <div role="status" className="rounded-[14px] border border-dashed border-[#b9c5bf] bg-surface px-[18px] py-4 text-sm">
                No sessions match “{needle.trim()}”. Try other words, or start a new search.
              </div>
            ) : (
              groups.map((g) => (
                <section key={g.label} aria-label={g.label} className="flex flex-col gap-2">
                  <h2 className="m-0 ml-0.5 text-xs font-bold uppercase tracking-[0.05em] text-muted">{g.label}</h2>
                  <ul className="m-0 list-none overflow-hidden rounded-[14px] border border-line bg-surface p-0">
                    {g.items.map((s) => (
                      <SessionRow key={s.id} session={s} />
                    ))}
                  </ul>
                </section>
              ))
            )}

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-0.5 pt-1 text-[13px] text-muted-2">
              {confirming ? (
                <>
                  <span>Clear every session saved in this browser? This cannot be undone.</span>
                  <span className="flex items-center gap-2.5">
                    <Button
                      variant="danger"
                      size="inline"
                      onClick={() => {
                        clearAll();
                        setConfirming(false);
                        toast('All sessions cleared');
                      }}
                    >
                      Clear all sessions
                    </Button>
                    <Button variant="link" size="inline" onClick={() => setConfirming(false)}>
                      Cancel
                    </Button>
                  </span>
                </>
              ) : (
                <>
                  <span>Sessions are saved in this browser only, so they do not follow you to another device.</span>
                  <Button variant="danger" size="inline" onClick={() => setConfirming(true)}>
                    Clear all sessions
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
