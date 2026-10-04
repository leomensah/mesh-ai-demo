import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import type { Session } from '@/api/types';
import { resultsPath } from '@/hooks/useSessionActions';
import { clock, whenLong, whenShort } from '@/lib/dates';
import { describeFilters } from '@/lib/filters';
import { TRIGGER_LABEL, formatLabel, shownFormat } from '@/lib/format';
import { cn, plural } from '@/lib/utils';

export function SessionRow({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const first = session.queries[0];
  const last = session.queries[session.queries.length - 1];
  const n = session.queries.length;
  const listId = `queries-${session.id}`;

  return (
    <li className="border-b border-line-2 px-4 py-3.5 last:border-b-0">
      <div className="flex items-start gap-4 max-[640px]:flex-col max-[640px]:gap-2">
        <Link
          to={resultsPath(session.id, last.n)}
          aria-label={`Open session: ${first.text}. ${plural(n, 'query', 'queries')}, last active ${whenLong(last.at)}`}
          className="group flex min-w-0 flex-1 flex-col gap-[3px] text-ink no-underline hover:text-ink"
        >
          <span className="line-clamp-2 text-[15.5px] font-semibold leading-[1.4] group-hover:underline group-hover:underline-offset-[3px]">{first.text}</span>
          {n > 1 && last.text !== first.text && <span className="truncate text-sm text-muted">Latest: {last.text}</span>}
          <span className="text-[13px] text-muted-2">
            {formatLabel(shownFormat(last))} · {describeFilters(last.filters)}
          </span>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1.5 max-[640px]:w-full max-[640px]:flex-row max-[640px]:items-center max-[640px]:justify-between">
          <span className="whitespace-nowrap text-[13px] text-muted">{whenShort(last.at)}</span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen(!open)}
            className="inline-flex min-h-7 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-[#f7f9f8] pl-2.5 pr-2 text-[12.5px] font-semibold text-ink-2"
          >
            {plural(n, 'query', 'queries')}
            <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && (
        <ol id={listId} aria-label="Queries in this session" className="m-0 mt-3 list-none border-t border-dashed border-line p-0 pt-1">
          {session.queries.map((q) => (
            <li key={q.id}>
              <Link
                to={resultsPath(session.id, q.n)}
                className="group flex min-h-9 items-baseline gap-2.5 px-0.5 py-1.5 text-ink no-underline hover:text-ink max-[640px]:flex-wrap max-[640px]:gap-y-0.5"
              >
                <span className="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md bg-soft px-[5px] text-[11.5px] font-bold text-[#46574f]">Q{q.n}</span>
                <span className="min-w-0 flex-1 text-sm leading-[1.45] group-hover:underline group-hover:underline-offset-[3px]">{q.text}</span>
                <span className="shrink-0 whitespace-nowrap text-[12.5px] text-muted-2 max-[640px]:w-full max-[640px]:pl-[38px]">
                  {TRIGGER_LABEL[q.trigger]} · {clock(q.at)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}
