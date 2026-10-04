import { useState, type FormEvent } from 'react';
import { Folder, ListFilter, Plus, Search } from 'lucide-react';
import { IconButton, IconLink } from '@/components/ui/icon-button';
import { Tooltip } from '@/components/ui/tooltip';
import { Brand } from './Brand';
import { LanguageSelect } from './LanguageSelect';

interface ResultsBarProps {
  variant: 'results';
  filterCount: number;
  onOpenFilters: () => void;
  onAsk: (text: string) => Promise<void> | void;
}
interface SessionsBarProps {
  variant: 'sessions';
}

/*
  The pinned top bar. On results it holds the only text box (the follow-up box) and the
  icon actions; on All sessions it holds just New search and the folder.
  The 252px first column lines the follow-up box up with the answer column below.
*/
export function AppBar(props: ResultsBarProps | SessionsBarProps) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (props.variant !== 'results' || !text.trim() || busy) return;
    setBusy(true);
    try {
      await props.onAsk(text);
      setText('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface shadow-[0_1px_6px_rgba(21,36,31,0.06)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[252px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 px-6 py-2.5 max-[1100px]:grid-cols-[auto_minmax(0,1fr)_auto] max-[640px]:grid-cols-[minmax(0,1fr)_auto]">
        <Brand />
        {props.variant === 'results' ? (
          <form
            onSubmit={submit}
            className="flex min-w-0 items-center gap-1.5 rounded-xl border-[1.5px] border-primary bg-surface py-[3px] pl-3.5 pr-[3px] shadow-[0_1px_6px_rgba(14,107,85,0.10)] max-[640px]:col-span-full max-[640px]:row-start-2"
          >
            <label htmlFor="follow-up" className="sr-only">
              Ask a follow-up question in this session
            </label>
            <input
              id="follow-up"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
              placeholder="Ask a follow-up, e.g. what should the consent process include?"
              className="h-9 min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-2"
            />
            <Tooltip label="Ask">
              <button
                type="submit"
                aria-label="Ask follow-up"
                disabled={busy}
                className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-primary text-white hover:bg-primary-hover disabled:opacity-70"
              >
                <Search className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </Tooltip>
          </form>
        ) : (
          <span className="max-[640px]:hidden" />
        )}
        <div className="flex items-center gap-1.5 max-[640px]:gap-1">
          {props.variant === 'results' && (
            <IconButton
              label={props.filterCount ? `Filters, ${props.filterCount} applied` : 'Filters'}
              tooltip="Filters"
              active={props.filterCount > 0}
              badge={props.filterCount}
              onClick={props.onOpenFilters}
              aria-haspopup="dialog"
            >
              <ListFilter className="size-[19px]" strokeWidth={2} aria-hidden="true" />
            </IconButton>
          )}
          <IconLink to="/" label="New search">
            <Plus className="size-[19px]" strokeWidth={2.2} aria-hidden="true" />
          </IconLink>
          <IconLink to="/sessions" label="All sessions" active={props.variant === 'sessions'} current={props.variant === 'sessions'}>
            <Folder className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </IconLink>
          <LanguageSelect className="ml-1.5 max-[640px]:ml-1 max-[640px]:max-w-[84px]" />
        </div>
      </div>
    </header>
  );
}
