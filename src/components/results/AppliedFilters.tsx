import type { Filters } from '@/api/types';
import { FilterChip } from '@/components/ui/chip';
import { FILTERS, countFilters } from '@/lib/filters';

interface Props {
  filters: Filters;
  onRemove: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  emptyText?: string;
}

/** "Filters applied: [Country: Kenya ×] … Clear all". Shown below the answer on results, and under the composer on home. */
export function AppliedFilters({ filters, onRemove, onClear, emptyText }: Props) {
  const n = countFilters(filters);
  if (!n && !emptyText) return null;
  return (
    <div className="flex min-h-8 flex-wrap items-center gap-1.5">
      {n ? (
        <>
          <span className="mr-0.5 text-[13px] text-muted">Filters applied:</span>
          {FILTERS.flatMap((d) =>
            filters[d.key].map((v) => <FilterChip key={d.key + v} name={d.short} value={v} onRemove={() => onRemove(d.key, v)} />)
          )}
          <button type="button" onClick={onClear} className="ml-1 min-h-[30px] px-1 text-[13px] font-semibold text-primary underline underline-offset-[3px]">
            Clear all
          </button>
        </>
      ) : (
        <span className="text-[13px] text-muted">{emptyText}</span>
      )}
    </div>
  );
}
