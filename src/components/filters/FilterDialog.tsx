import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X } from 'lucide-react';
import type { FilterKey, Filters } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FILTERS, copyFilters, countFilters, emptyFilters, filtersInUse, filterDef } from '@/lib/filters';
import { cn, plural } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Filters;
  /** On home the dialog offers Done or Search; on results, Cancel or Apply and search. */
  context: 'home' | 'results';
  onApply: (filters: Filters, search: boolean) => void;
}

export function FilterDialog({ open, onOpenChange, initial, context, onApply }: Props) {
  const [draft, setDraft] = useState<Filters>(() => copyFilters(initial));
  const [active, setActive] = useState<FilterKey>('type');
  const [needle, setNeedle] = useState('');

  useEffect(() => {
    if (!open) return;
    const start = copyFilters(initial);
    setDraft(start);
    setActive(FILTERS.find((d) => start[d.key].length)?.key ?? 'type');
    setNeedle('');
    // Reset only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const def = filterDef(active);
  const chosen = draft[active];
  const total = countFilters(draft);
  const used = filtersInUse(draft);
  const options = def.options.filter((o) => !needle.trim() || o.toLowerCase().includes(needle.trim().toLowerCase()));

  const toggle = (key: FilterKey, value: string) =>
    setDraft((d) => ({ ...d, [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value] }));
  const clearKey = (key: FilterKey) => setDraft((d) => ({ ...d, [key]: [] }));

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(18,32,27,0.52)]" />
        <Dialog.Content
          aria-describedby="filters-help"
          className="fixed left-1/2 top-1/2 z-50 flex h-[620px] max-h-[calc(100vh-48px)] w-[calc(100%-48px)] max-w-[880px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[18px] bg-surface shadow-[0_30px_80px_rgba(12,28,22,0.32),0_2px_6px_rgba(12,28,22,0.10)] focus:outline-none max-[640px]:h-[calc(100vh-32px)] max-[640px]:w-[calc(100%-32px)]"
        >
          <div className="flex flex-col gap-3.5 border-b border-[#e6ebe8] px-6 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="m-0 text-xl font-bold tracking-[-0.01em]">Filters</Dialog.Title>
                <Dialog.Description id="filters-help" className="mt-0.5 text-sm text-muted">
                  Pick as many as you like. Results match any choice within a filter, and every filter you use.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="Close filters" className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f1f4f2] text-[#2f403a]">
                <X className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="flex min-h-[30px] flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[13px] font-semibold text-[#46574f]">Your selection</span>
              {total === 0 && <span className="text-[13px] text-muted-2">Nothing yet, so every public TGHN resource is included.</span>}
              {FILTERS.flatMap((d) =>
                draft[d.key].map((v) => (
                  <button
                    key={d.key + v}
                    type="button"
                    onClick={() => toggle(d.key, v)}
                    aria-label={`Remove ${v} from ${d.label}`}
                    className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-primary pl-2.5 pr-2 text-[13px] font-medium text-white hover:bg-primary-hover"
                  >
                    {v}
                    <X className="size-3" strokeWidth={2.8} aria-hidden="true" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 max-[640px]:flex-col">
            <nav
              aria-label="Filter categories"
              className="flex w-[220px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-[#e6ebe8] bg-[#f5f7f6] p-3 max-[640px]:w-auto max-[640px]:flex-row max-[640px]:overflow-x-auto max-[640px]:overflow-y-hidden max-[640px]:border-b max-[640px]:border-r-0 max-[640px]:p-2"
            >
              {FILTERS.map((d) => {
                const on = d.key === active;
                const n = draft[d.key].length;
                return (
                  <button
                    key={d.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setActive(d.key);
                      setNeedle('');
                    }}
                    className={cn(
                      'flex min-h-10 w-full items-center justify-between gap-2 whitespace-nowrap rounded-[10px] px-3 text-left text-sm max-[640px]:w-auto',
                      on ? 'bg-surface font-semibold text-ink shadow-[0_1px_3px_rgba(21,36,31,0.12)]' : 'font-medium text-[#3b4c45] hover:bg-[#ecf0ee]'
                    )}
                  >
                    <span>{d.label}</span>
                    {n > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">{n}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <section aria-labelledby="pane-title" className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-y-auto px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 id="pane-title" className="m-0 text-[17px] font-semibold">
                    {def.label}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-muted-2">
                    {def.hint}
                    {chosen.length ? ` ${chosen.length} selected.` : ''}
                  </p>
                </div>
                {chosen.length > 0 && (
                  <button type="button" onClick={() => clearKey(active)} className="shrink-0 text-[13px] font-semibold text-primary">
                    Clear {def.label.toLowerCase()}
                  </button>
                )}
              </div>
              {def.options.length > 7 && (
                <div className="flex min-h-10 items-center gap-2 rounded-[10px] border border-field bg-surface px-3 text-muted-2">
                  <Search className="size-4" aria-hidden="true" />
                  <label htmlFor="option-search" className="sr-only">
                    Search {def.label.toLowerCase()}
                  </label>
                  <input
                    id="option-search"
                    type="search"
                    value={needle}
                    onChange={(e) => setNeedle(e.target.value)}
                    placeholder={`Search ${def.label.toLowerCase()}`}
                    className="h-[38px] min-w-0 flex-1 border-none bg-transparent text-sm text-ink outline-none"
                  />
                </div>
              )}
              <fieldset className="m-0 min-w-0 border-none p-0">
                <legend className="sr-only">{def.label}</legend>
                {options.length === 0 ? (
                  <p className="m-0 text-sm text-muted">No {def.label.toLowerCase()} matches that search.</p>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-x-3 gap-y-1">
                    {options.map((o) => {
                      const on = chosen.includes(o);
                      return (
                        <label
                          key={o}
                          className={cn(
                            'flex min-h-[42px] cursor-pointer items-center gap-2.5 rounded-[10px] px-3 text-[15px]',
                            on ? 'bg-[#eaf4ef] font-semibold text-primary-ink shadow-[inset_0_0_0_1px_#b9d7ca]' : 'bg-surface text-[#22332d] shadow-[inset_0_0_0_1px_#e3e8e5] hover:shadow-[inset_0_0_0_1px_#c9d2cd]'
                          )}
                        >
                          <Checkbox checked={on} onCheckedChange={() => toggle(active, o)} />
                          <span>{o}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t border-[#e6ebe8] px-6 py-3.5">
            <div className="flex items-center gap-3.5">
              <button type="button" onClick={() => setDraft(emptyFilters())} className="min-h-[38px] px-0.5 text-sm font-semibold text-ink underline underline-offset-[3px]">
                Clear all
              </button>
              <span role="status" className="text-sm text-muted">
                {total ? `${plural(total, 'choice', 'choices')} in ${plural(used, 'filter', 'filters')}` : 'No filters selected'}
              </span>
            </div>
            <div className="flex gap-2">
              {context === 'home' ? (
                <>
                  <Button variant="secondary" className="min-h-[42px]" onClick={() => onApply(draft, false)}>
                    Done
                  </Button>
                  <Button className="min-h-[42px]" onClick={() => onApply(draft, true)}>
                    Search
                  </Button>
                </>
              ) : (
                <>
                  <Dialog.Close asChild>
                    <Button variant="secondary" className="min-h-[42px]">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button className="min-h-[42px]" onClick={() => onApply(draft, true)}>
                    Apply and search
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
