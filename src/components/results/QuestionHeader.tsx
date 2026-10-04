import { useId, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, History, Pencil } from 'lucide-react';
import type { Query } from '@/api/types';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const chip =
  'inline-flex h-8 items-center gap-1.5 rounded-full border text-[13px] font-semibold no-underline transition-colors';

/** "query 1", "queries 1 and 2", "queries 1 to 4": the queries before this one. */
function earlierQueries(n: number) {
  const before = n - 1;
  if (before <= 1) return 'query 1';
  if (before === 2) return 'queries 1 and 2';
  return `queries 1 to ${before}`;
}

/*
  The question on screen, with two small actions under it:
  - "Used earlier queries" (follow-ups only) opens a panel showing what Mesh-AI actually
    searched for after reading the follow-up with the earlier queries in the session.
  - "Edit question" opens the home page with the question filled in; searching starts a new session.
  Render with key={query.id} so the panel closes when another query is shown.
*/
export function QuestionHeader({ query }: { query: Query }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const searchedAs = query.searchedAs ? query.searchedAs.charAt(0).toUpperCase() + query.searchedAs.slice(1) : '';

  return (
    <div className="border-b border-line pb-4">
      <h1 className="m-0 text-[22px] font-[650] leading-[1.35] tracking-[-0.012em] text-pretty max-[640px]:text-xl">{query.text}</h1>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {searchedAs && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            className={cn(
              chip,
              'pl-[9px] pr-2.5',
              open ? 'border-[#c5ddd2] bg-tint text-primary-ink' : 'border-line bg-surface text-ink-2 hover:bg-[#f7f9f8] hover:text-ink'
            )}
          >
            <History className="size-[15px]" strokeWidth={2} aria-hidden="true" />
            Used earlier queries
            <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}
        <Tooltip label="Opens a new search with this question">
          <Link
            to="/"
            state={{ text: query.text, format: query.formatChosen ?? 'auto', filters: query.filters }}
            className={cn(chip, 'border-line bg-surface pl-2.5 pr-3 text-ink-2 hover:bg-[#f7f9f8] hover:text-ink')}
          >
            <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Edit question
          </Link>
        </Tooltip>
      </div>

      {searchedAs && open && (
        <div id={panelId} className="mt-2.5 rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-sm leading-normal text-ink-2">
          <span className="mb-0.5 block text-xs font-semibold text-muted">Mesh-AI searched for</span>
          <span className="block">{searchedAs}</span>
          <span className="mt-1.5 block text-[12.5px] text-muted-2">Your follow-up, read together with {earlierQueries(query.n)}.</span>
        </div>
      )}

      {query.fallback && (
        <p role="note" className="mb-0 mt-3 rounded-[10px] border border-[#f0d7b4] bg-[#fff7ec] px-3.5 py-2.5 text-sm text-[#5e3a0f]">
          {query.fallback === 'sample'
            ? 'This prototype has sample answers for a few questions, so it is showing the malaria vaccine example.'
            : 'This prototype has no sample answer for this follow-up, so it repeats the answer for this session’s topic. The live product answers it using the earlier queries in the session as context.'}
        </p>
      )}
    </div>
  );
}
