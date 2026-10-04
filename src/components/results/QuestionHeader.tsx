import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ChevronDown, History, Info, Pencil, Search } from 'lucide-react';
import type { Query } from '@/api/types';
import { cn } from '@/lib/utils';

/** "query 1", "queries 1 and 2", "queries 1 to 4": the queries before this one. */
function earlierQueries(n: number) {
  const before = n - 1;
  if (before <= 1) return 'query 1';
  if (before === 2) return 'queries 1 and 2';
  return `queries 1 to ${before}`;
}

/*
  The question on screen, in a tinted card so it reads as the person's question rather than
  part of Mesh-AI's answer.

  View mode: the question, an Edit button, and for follow-ups "Used earlier queries", which opens
  what Mesh-AI actually searched for after reading the follow-up with the earlier queries.

  Edit mode (after Edit): the same card becomes a text box. Search starts a new session with no
  filters (onEdit); Enter searches, Shift+Enter adds a line, Esc cancels.

  Render with key={query.id} so both modes reset when another query is shown.
*/
export function QuestionHeader({ query, onEdit }: { query: Query; onEdit: (text: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(query.text);
  const [busy, setBusy] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const panelId = useId();
  const fieldId = useId();
  const field = useRef<HTMLTextAreaElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  const searchedAs = query.searchedAs ? query.searchedAs.charAt(0).toUpperCase() + query.searchedAs.slice(1) : '';
  const empty = !draft.trim();

  // Grow the text box with its content.
  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, editing]);

  // Entering edit mode focuses the text box with the cursor at the end; leaving it returns focus to Edit.
  useEffect(() => {
    if (editing) {
      const el = field.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    } else if (returnFocus.current) {
      returnFocus.current = false;
      editButton.current?.focus();
    }
  }, [editing]);

  function startEditing() {
    setDraft(query.text);
    setContextOpen(false);
    setEditing(true);
  }

  function cancel() {
    returnFocus.current = true;
    setEditing(false);
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (empty || busy) return;
    setBusy(true);
    try {
      await onEdit(draft);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <>
      {editing ? (
        <form
          onSubmit={submit}
          aria-label="Edit question"
          className="rounded-[14px] border-[1.5px] border-primary bg-surface px-3.5 py-3 shadow-[0_0_0_4px_rgba(14,107,85,0.10)]"
        >
          <label htmlFor={fieldId} className="mb-1 ml-0.5 block text-xs font-semibold text-muted">
            Edit question
          </label>
          <textarea
            id={fieldId}
            ref={field}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            className="block w-full resize-none overflow-hidden border-none bg-transparent p-0.5 text-xl leading-[1.4] text-ink outline-none max-[640px]:text-[19px]"
          />
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-line-2 pt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
              <Info className="size-[15px] shrink-0" strokeWidth={2} aria-hidden="true" />
              Searching starts a new session with no filters.
            </span>
            <span className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={cancel}
                className="h-9 rounded-[9px] border border-line bg-surface px-3.5 text-sm font-semibold text-ink-2 hover:bg-[#f7f9f8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={empty || busy}
                className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-[#9db8ae]"
              >
                <Search className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
                Search
              </button>
            </span>
          </div>
        </form>
      ) : (
        <div className="rounded-[14px] border border-[#d2e4da] bg-[#eaf3ee] px-[18px] pb-3.5 pt-4">
          <div className="flex items-start gap-4">
            <h1 className="m-0 min-w-0 flex-1 text-xl font-normal leading-[1.4] text-pretty max-[640px]:text-[19px]">{query.text}</h1>
            <button
              ref={editButton}
              type="button"
              onClick={startEditing}
              title="Edit the question. Searching starts a new session."
              className="-mr-1.5 -mt-0.5 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[9px] border border-[#d2e4da] bg-white/75 pl-2.5 pr-3 text-[13px] font-semibold text-ink-2 hover:bg-surface hover:text-ink"
            >
              <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
              Edit
            </button>
          </div>

          {searchedAs && (
            <div className="mt-2.5 flex">
              <button
                type="button"
                aria-expanded={contextOpen}
                aria-controls={panelId}
                onClick={() => setContextOpen(!contextOpen)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full border bg-surface pl-[9px] pr-2.5 text-[13px] font-semibold',
                  contextOpen ? 'border-[#9fc4b4] text-primary-ink' : 'border-[#d2e4da] text-ink-2 hover:text-ink'
                )}
              >
                <History className="size-[15px]" strokeWidth={2} aria-hidden="true" />
                Used earlier queries
                <ChevronDown className={cn('size-3.5 transition-transform', contextOpen && 'rotate-180')} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          )}

          {searchedAs && contextOpen && (
            <div id={panelId} className="mt-3 border-t border-[#d2e4da] pt-3 text-sm leading-normal text-ink-2">
              <span className="mb-0.5 block text-xs font-semibold text-muted">Mesh-AI searched for</span>
              <span className="block">{searchedAs}</span>
              <span className="mt-1.5 block text-[12.5px] text-muted-2">Your follow-up, read together with {earlierQueries(query.n)}.</span>
            </div>
          )}
        </div>
      )}

      {query.fallback && (
        <p role="note" className="m-0 rounded-[10px] border border-[#f0d7b4] bg-[#fff7ec] px-3.5 py-2.5 text-sm text-[#5e3a0f]">
          {query.fallback === 'sample'
            ? 'This prototype has sample answers for a few questions, so it is showing the malaria vaccine example.'
            : 'This prototype has no sample answer for this follow-up, so it repeats the answer for this session’s topic. The live product answers it using the earlier queries in the session as context.'}
        </p>
      )}
    </>
  );
}
