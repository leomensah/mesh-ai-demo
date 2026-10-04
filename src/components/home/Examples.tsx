import { EXAMPLES } from '@/api/mock/topics';
import { formatLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

export function Examples({ onPick }: { onPick: (q: string) => void }) {
  return (
    <section aria-labelledby="examples-title">
      <div className="flex items-baseline justify-between gap-4 px-1 pb-2.5">
        <h2 id="examples-title" className="m-0 text-[17px] font-bold">
          Try asking
        </h2>
        <span className="text-sm text-muted">What Mesh-AI returns</span>
      </div>
      <ul className="m-0 list-none border-t border-line p-0">
        {EXAMPLES.map((e) => (
          <li key={e.q} className="border-b border-line">
            <button
              type="button"
              onClick={() => onPick(e.q)}
              className="group flex min-h-14 w-full flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1 py-2.5 text-left text-ink"
            >
              <span className="flex-[999_1_380px] text-[17px] leading-snug group-hover:underline group-hover:underline-offset-[3px]">{e.q}</span>
              <span className={cn('shrink-0 text-[15px]', e.format === 'resources' ? 'text-primary-ink' : 'text-ai')}>{formatLabel(e.format)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
