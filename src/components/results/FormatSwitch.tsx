import type { AnswerFormat, Query } from '@/api/types';
import { FORMATS, formatName, shownFormat } from '@/lib/format';
import { cn } from '@/lib/utils';

export function FormatSwitch({ query, onChange }: { query: Query; onChange: (f: AnswerFormat | null) => void }) {
  const current = shownFormat(query);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span id="format-label" className="text-[13px] text-muted">
        Answer format
      </span>
      <div
        role="group"
        aria-labelledby="format-label"
        className="flex flex-wrap gap-0.5 rounded-[10px] bg-[#e6ebe8] p-[3px] max-[640px]:grid max-[640px]:w-full max-[640px]:grid-cols-2"
      >
        {FORMATS.map((f) => {
          const on = f.key === current;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(f.key === query.formatAutomatic ? null : f.key)}
              className={cn(
                'min-h-[30px] rounded-[7px] px-3 text-[13px]',
                on ? 'bg-surface font-semibold text-primary-ink shadow-[0_1px_2px_rgba(21,36,31,0.16)]' : 'font-medium text-[#46574f]'
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <span className="text-[13px] text-muted">
        {query.formatChosen ? (
          <>
            You chose {formatName(current)}. The automatic choice was {formatName(query.formatAutomatic)}.{' '}
            <button type="button" onClick={() => onChange(null)} className="font-semibold text-primary underline underline-offset-[3px]">
              Use automatic
            </button>
          </>
        ) : (
          <>Chosen automatically: {query.formatReason}.</>
        )}
      </span>
    </div>
  );
}
