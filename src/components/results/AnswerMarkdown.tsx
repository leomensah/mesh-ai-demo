import type { ReactNode } from 'react';

/*
  Renders the answer service's markdown: "# title", "*byline*", "## heading", "- bullet" and
  paragraphs, with [n] citation markers turned into numbered pins that jump to the source.
*/
interface Props {
  text: string;
  streaming: boolean;
  onCite: (n: number) => void;
}

function inline(text: string, onCite: (n: number) => void, keyBase: string): ReactNode[] {
  return text.split(/(\[\d+\])/).map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return part;
    const n = Number(m[1]);
    return (
      <button
        key={keyBase + i}
        type="button"
        onClick={() => onCite(n)}
        aria-label={`Go to source ${n}`}
        className="mx-px inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-[5px] bg-tint px-1 align-[2px] font-sans text-[11px] font-bold leading-none text-primary-ink hover:bg-[#d3e9df]"
      >
        {n}
      </button>
    );
  });
}

export function AnswerMarkdown({ text, streaming, onCite }: Props) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length);
  return (
    <div className="prose-answer" id="answer-text" aria-busy={streaming}>
      {blocks.map((block, i) => {
        const last = i === blocks.length - 1;
        const caret = streaming && last ? 'caret' : undefined;
        const b = block.trim();
        if (b.startsWith('## ')) return <h4 key={i} className={caret}>{b.slice(3)}</h4>;
        if (b.startsWith('# ')) return <h3 key={i} className={caret}>{b.slice(2)}</h3>;
        if (b.startsWith('*')) return <div key={i} className={['meta', caret].filter(Boolean).join(' ')}>{b.replace(/^\*|\*$/g, '')}</div>;
        if (b.startsWith('- ')) {
          const items = b.split('\n').filter((l) => l.startsWith('- '));
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j} className={last && j === items.length - 1 ? caret : undefined}>
                  {inline(item.slice(2), onCite, `${i}-${j}-`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={caret}>
            {inline(b, onCite, `${i}-`)}
          </p>
        );
      })}
      {streaming && blocks.length === 0 && <p className="caret" />}
    </div>
  );
}
