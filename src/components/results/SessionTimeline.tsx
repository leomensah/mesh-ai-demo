import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import type { Session } from '@/api/types';
import { resultsPath } from '@/hooks/useSessionActions';
import { clock, daysAgo, shortDate } from '@/lib/dates';
import { TRIGGER_LABEL } from '@/lib/format';
import { cn, plural } from '@/lib/utils';

/*
  The session's queries in order, in the left margin. On screens narrower than 900px it
  folds into a "This session" bar above the question, which says which query is on screen.
*/
export function SessionTimeline({ session, current }: { session: Session; current: number }) {
  const [open, setOpen] = useState(false);
  const n = session.queries.length;
  const latest = session.queries[n - 1].n;
  const position = session.queries.findIndex((q) => q.n === current) + 1;
  const started = daysAgo(session.startedAt) === 0 ? clock(session.startedAt) : shortDate(session.startedAt);

  return (
    <nav aria-labelledby="session-title" className="sticky top-[84px] max-[900px]:static">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="hidden min-h-[42px] w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3 text-sm font-semibold text-ink-2 max-[900px]:flex"
      >
        This session
        <span className="font-normal text-muted-2">
          Query {position} of {n}
        </span>
        <ChevronDown className={cn('ml-auto size-3.5 transition-transform', open && 'rotate-180')} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <div className={cn('max-[900px]:mt-2 max-[900px]:rounded-xl max-[900px]:border max-[900px]:border-line max-[900px]:bg-surface max-[900px]:px-3.5 max-[900px]:pb-2 max-[900px]:pt-3', !open && 'max-[900px]:hidden')}>
        <h2 id="session-title" className="m-0 text-[13px] font-semibold text-ink-2 max-[900px]:sr-only">
          This session
        </h2>
        <p className="mb-3 mt-0.5 text-xs text-muted-2">
          {plural(n, 'query', 'queries')}, started {started}
        </p>
        <ol className="timeline-line relative m-0 list-none p-0">
          {session.queries.map((q) => {
            const on = q.n === current;
            return (
              <li key={q.id} className="relative mb-0.5 pl-[22px]">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute rounded-full',
                    on ? 'left-0 top-[13px] size-[11px] bg-primary shadow-[0_0_0_3px_var(--color-tint)]' : 'left-px top-[14px] size-[9px] border-[1.5px] border-[#aebbb4] bg-bg'
                  )}
                />
                <Link
                  to={resultsPath(session.id, q.n)}
                  onClick={() => setOpen(false)}
                  aria-current={on ? 'true' : undefined}
                  className={cn(
                    '-ml-2 block w-[calc(100%+8px)] rounded-lg px-2 py-[7px] no-underline',
                    on ? 'bg-surface shadow-[inset_0_0_0_1px_var(--color-line)]' : 'hover:bg-[#ecf1ee]'
                  )}
                >
                  <span className={cn('line-clamp-2 text-[13.5px] leading-[1.4]', on ? 'font-semibold text-ink' : 'text-ink-2')}>{q.text}</span>
                  <span className="mt-px block text-xs text-muted-2">
                    {TRIGGER_LABEL[q.trigger]} · {clock(q.at)}
                    {q.n === latest ? ' · Latest' : ''}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {current !== latest && (
          <Link
            to={resultsPath(session.id, latest)}
            className="ml-[22px] mt-2 inline-flex min-h-[30px] items-center text-[13px] font-semibold underline underline-offset-[3px]"
          >
            Back to latest
          </Link>
        )}
      </div>
    </nav>
  );
}
