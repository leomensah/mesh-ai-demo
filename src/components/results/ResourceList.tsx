import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { RankedResource } from '@/api/types';
import { cn } from '@/lib/utils';

interface Props {
  resources: RankedResource[] | undefined;
  resourcesOnly: boolean;
  highlighted: number | null;
  onClearFilters: () => void;
}

const time = (r: RankedResource) => {
  const t = Date.parse(r.date);
  return Number.isNaN(t) ? 0 : t;
};

export function ResourceList({ resources, resourcesOnly, highlighted, onClearFilters }: Props) {
  const [sort, setSort] = useState<'relevant' | 'newest'>('relevant');
  const sorted = useMemo(
    () => (resources ? (sort === 'newest' ? [...resources].sort((a, b) => time(b) - time(a)) : resources) : undefined),
    [resources, sort]
  );

  return (
    <section aria-labelledby="resources-title" className="flex flex-col gap-2">
      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <div>
          <h2 id="resources-title" className="m-0 inline text-base font-semibold">
            {resourcesOnly ? 'Resources' : 'Sources and related resources'}
          </h2>
          {sorted && (
            <span className="ml-2.5 text-[13px] text-muted-2">
              {sorted.length} shown.{sorted.length ? (resourcesOnly ? ' No written answer for this format.' : ' Numbers match the citations above.') : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="resource-sort" className="text-[13px] text-muted">
            Sort
          </label>
          <select
            id="resource-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'relevant' | 'newest')}
            className="min-h-8 rounded-lg border border-field bg-surface px-1.5 text-[13px]"
          >
            <option value="relevant">Most relevant</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {!sorted ? (
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface" aria-busy="true" aria-label="Finding resources">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3.5 border-b border-line-2 px-[18px] py-4 last:border-b-0">
              <div className="skeleton size-[22px] shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-4 w-[70%]" />
                <div className="skeleton h-3 w-[40%]" />
                <div className="skeleton h-3 w-[90%]" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2.5 rounded-[14px] border border-dashed border-[#b9c5bf] bg-surface px-[18px] py-4 text-sm">
          <span>No resources match these filters. Remove a filter or rephrase your question.</span>
          <button type="button" onClick={onClearFilters} className="min-h-[34px] rounded-lg border border-field bg-surface px-3 text-[13px] font-semibold">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <ol className="m-0 list-none overflow-hidden rounded-[14px] border border-line bg-surface p-0">
            {sorted.map((r) => (
              <li
                key={r.id}
                id={`res-${r.n}`}
                className={cn('flex gap-3.5 border-b border-line-2 px-[18px] py-4 transition-colors duration-700 last:border-b-0', highlighted === r.n && 'bg-[#f1f8f4]')}
              >
                <span aria-hidden="true" className="mt-px flex size-[22px] shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                  {r.n}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="m-0 text-[15px] font-semibold leading-[1.4] text-pretty">
                    <span className="sr-only">Source {r.n}: </span>
                    <a href={r.url} target="_blank" rel="noopener" className="text-ink no-underline hover:text-ink hover:underline hover:underline-offset-[3px]">
                      {r.title}
                    </a>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted">
                    <span className="rounded-[5px] bg-tint px-[7px] py-px text-xs font-semibold text-primary-ink">{r.typeLabel}</span>
                    <span>{r.where}</span>
                    <span>{r.date}</span>
                  </div>
                  <p className="mb-0 mt-0.5 text-sm leading-normal text-ink-2">{r.summary}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px]">
                    <a href={r.url} target="_blank" rel="noopener" className="inline-flex min-h-[30px] items-center gap-[5px] font-semibold">
                      Open on TGHN
                      <ExternalLink className="size-3" strokeWidth={2.2} aria-hidden="true" />
                    </a>
                    <span className="text-muted-2">{r.authors}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => toast('More results are not loaded in this prototype')}
            className="mt-2.5 self-center rounded-[10px] border border-field bg-surface px-[18px] py-2 text-sm font-semibold hover:bg-[#f7f9f8]"
          >
            Show more resources
          </button>
        </>
      )}
    </section>
  );
}
