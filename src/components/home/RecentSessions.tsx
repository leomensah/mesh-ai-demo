import { Link } from 'react-router';
import { ArrowRight, Folder } from 'lucide-react';
import type { Session } from '@/api/types';
import { resultsPath } from '@/hooks/useSessionActions';
import { daysAgo, whenLong } from '@/lib/dates';
import { filterValues } from '@/lib/filters';
import { cn, plural } from '@/lib/utils';

/** The three most recent sessions, each opening at its latest query. */
export function RecentSessions({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) return null;
  return (
    <section aria-labelledby="recent-title">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1">
        <h2 id="recent-title" className="m-0 text-[17px] font-bold">
          Your recent sessions
        </h2>
        <Link
          to="/sessions"
          className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border-[1.5px] border-field bg-surface px-3.5 text-[15px] font-semibold text-ink no-underline hover:bg-[#f7f9f8] hover:text-ink"
        >
          <Folder className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          View all sessions
        </Link>
      </div>
      <ul className="mt-3 grid list-none grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 p-0">
        {sessions.slice(0, 3).map((s) => {
          const first = s.queries[0];
          const last = s.queries[s.queries.length - 1];
          const n = s.queries.length;
          const latest = n === 1 ? 'One query, no follow-ups yet' : last.text !== first.text ? `Latest: ${last.text}` : 'Latest: filters changed';
          return (
            <li key={s.id} className="flex">
              <Link
                to={resultsPath(s.id, last.n)}
                aria-label={`Open session: ${first.text}. ${plural(n, 'query', 'queries')}, ${whenLong(last.at)}`}
                className="flex min-h-[156px] flex-1 flex-col gap-2 rounded-[14px] border border-line bg-surface px-4 py-3.5 text-ink no-underline hover:border-tint-line hover:text-ink"
              >
                <span className="flex items-center justify-between gap-2 text-[13px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className={cn('size-[7px] rounded-full', daysAgo(last.at) === 0 ? 'bg-primary' : 'bg-[#b6c2bc]')} />
                    {whenLong(last.at)}
                  </span>
                  <span className="rounded-full bg-soft px-2 py-px text-xs font-semibold text-[#3d4f48]">{plural(n, 'query', 'queries')}</span>
                </span>
                <span className="line-clamp-2 text-base font-semibold leading-snug">{first.text}</span>
                <span className="line-clamp-1 text-sm text-muted">{latest}</span>
                <span className="mt-auto flex items-center justify-between gap-2 border-t border-line-2 pt-2 text-[13px] text-[#62736c]">
                  <span className="min-w-0 truncate">{filterValues(last.filters)}</span>
                  <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary">
                    Open
                    <ArrowRight className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
