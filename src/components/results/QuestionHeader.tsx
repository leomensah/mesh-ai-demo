import { Link } from 'react-router';
import type { Query } from '@/api/types';

export function QuestionHeader({ query }: { query: Query }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="m-0 text-lg font-semibold leading-[1.45] text-pretty">{query.text}</h1>
        <Link
          to="/"
          state={{ text: query.text, format: query.formatChosen ?? 'auto', filters: query.filters }}
          title="Edit this question and start a new search"
          className="shrink-0 text-sm font-semibold leading-[1.8]"
          aria-label={`Edit "${query.text}" and start a new search`}
        >
          Edit
        </Link>
      </div>
      {query.searchedAs && (
        <p className="mb-0 mt-1.5 text-[13px] text-muted">
          Searched with session context: <q className="italic text-ink-2">{query.searchedAs}</q>
        </p>
      )}
      {query.fallback && (
        <p role="note" className="mb-0 mt-2.5 rounded-[10px] border border-[#f0d7b4] bg-[#fff7ec] px-3.5 py-2.5 text-sm text-[#5e3a0f]">
          {query.fallback === 'sample'
            ? 'This prototype has sample answers for a few questions, so it is showing the malaria vaccine example.'
            : 'This prototype has no sample answer for this follow-up, so it repeats the answer for this session’s topic. The live product answers it using the earlier queries in the session as context.'}
        </p>
      )}
    </div>
  );
}
