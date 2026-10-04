import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { ListFilter } from 'lucide-react';
import type { AnswerFormat, Filters } from '@/api/types';
import { Button } from '@/components/ui/button';
import { AppliedFilters } from '@/components/results/AppliedFilters';
import { FilterDialog } from '@/components/filters/FilterDialog';
import { FORMATS } from '@/lib/format';
import { countFilters, emptyFilters } from '@/lib/filters';
import { cn } from '@/lib/utils';

interface Props {
  initialText?: string;
  initialFormat?: AnswerFormat | 'auto';
  initialFilters?: Filters;
  onSearch: (text: string, filters: Filters, format: AnswerFormat | 'auto') => Promise<void>;
}

export function Composer({ initialText = '', initialFormat = 'auto', initialFilters, onSearch }: Props) {
  const [text, setText] = useState(initialText);
  const [format, setFormat] = useState<AnswerFormat | 'auto'>(initialFormat);
  const [filters, setFilters] = useState<Filters>(initialFilters ?? emptyFilters());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const n = countFilters(filters);

  async function run(nextFilters = filters) {
    if (busy) return;
    setBusy(true);
    try {
      await onSearch(text, nextFilters, format);
    } finally {
      setBusy(false);
    }
  }
  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run();
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void run();
    }
  };

  return (
    <section aria-label="Search" className="rounded-2xl border border-line bg-surface">
      <form onSubmit={submit} className="flex flex-col gap-3.5 px-5 pb-4 pt-5">
        <label htmlFor="home-query" className="sr-only">
          Your question or search
        </label>
        <textarea
          id="home-query"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask a question or describe what you need. For example: outline engagement activities for a malaria vaccine trial in coastal Kenya"
          className="min-h-24 w-full resize-y rounded-xl border-[1.5px] border-[#9aaaa3] bg-[#f8faf9] px-4 py-3.5 text-lg leading-normal text-ink placeholder:text-muted-2"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            aria-haspopup="dialog"
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-[10px] border px-3.5 text-sm font-semibold',
              n ? 'border-tint-line bg-tint text-primary-ink' : 'border-field bg-surface text-ink'
            )}
          >
            <ListFilter className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
            {n ? `Filters (${n})` : 'Filters'}
          </button>
          <label htmlFor="home-format" className="text-[15px] text-[#3d4f48]">
            Answer format
          </label>
          <select
            id="home-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as AnswerFormat | 'auto')}
            className="min-h-10 rounded-lg border border-field bg-surface px-2 text-sm"
          >
            <option value="auto">Automatic</option>
            {FORMATS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
          <span className="flex-1 max-[640px]:hidden" />
          <Button type="submit" size="lg" disabled={busy}>
            Search
          </Button>
        </div>
        <p className="m-0 text-sm text-muted">
          Mesh-AI decides from your words whether to list resources or write an answer. You can also say what you want, such as “in one paragraph” or “write a
          report”. Each search starts a new session.
        </p>
      </form>
      {n > 0 && (
        <div className="border-t border-line-2 px-5 pb-4 pt-3">
          <AppliedFilters
            filters={filters}
            onRemove={(k, v) => setFilters({ ...filters, [k]: filters[k].filter((x) => x !== v) })}
            onClear={() => setFilters(emptyFilters())}
          />
        </div>
      )}
      <FilterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={filters}
        context="home"
        onApply={(next, search) => {
          setFilters(next);
          setDialogOpen(false);
          if (search) void run(next);
        }}
      />
    </section>
  );
}
