import { Copy, Download, ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { usingSampleData } from '@/api';
import type { AnswerRequest, Query, RankedResource, Session } from '@/api/types';
import { useAnswerStream } from '@/hooks/useAnswerStream';
import { shownFormat } from '@/lib/format';
import { cn, plural } from '@/lib/utils';
import { AnswerMarkdown } from './AnswerMarkdown';

interface Props {
  session: Session;
  query: Query;
  resources: RankedResource[] | undefined;
  totalBeforeFilters: number;
  onCite: (n: number) => void;
  onVote: (vote: Query['vote']) => void;
}

/*
  The written answer. Resources appear first; the answer streams in once they are known,
  built only from the resources that match the filters.
*/
export function AnswerCard({ session, query, resources, totalBeforeFilters, onCite, onVote }: Props) {
  const format = shownFormat(query);
  const visible = resources?.map((r) => r.n) ?? [];
  const wanted = format !== 'resources' && resources !== undefined && visible.length > 0;
  const request: AnswerRequest | null = wanted
    ? {
        topic: query.topic,
        format: format as AnswerRequest['format'],
        visible,
        malariaContext: session.queries.slice(0, query.n).some((q) => q.topic === 'malaria')
      }
    : null;
  const stream = useAnswerStream(`${query.id}|${format}|${visible.join(',')}`, request);

  if (format === 'resources') return null;

  if (resources && visible.length === 0) {
    return (
      <div role="status" className="rounded-[14px] border border-dashed border-[#b9c5bf] bg-surface px-[18px] py-4 text-sm">
        Mesh-AI only answers from TGHN resources, and none match your filters, so there is no written answer.
      </div>
    );
  }

  const hidden = totalBeforeFilters - visible.length;
  const isReport = format === 'report';
  const writing = !stream.done;

  return (
    <article aria-labelledby="answer-title" className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface px-[22px] pb-3.5 pt-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="answer-title" className="m-0 flex items-center gap-2 text-[13px] font-semibold text-ai">
          <span aria-hidden="true" className={cn('size-2 rounded-full bg-ai-dot', writing && 'animate-pulse')} />
          {resources ? `${isReport ? 'Report' : 'Answer'} by Mesh-AI from ${plural(visible.length, 'TGHN resource', 'TGHN resources')}` : 'Finding resources'}
        </h2>
        <span className="text-[13px] text-muted-2">{writing ? (isReport ? 'Writing the report…' : 'Writing…') : 'Check the sources before acting'}</span>
      </div>

      {resources && hidden > 0 && (
        <p className="m-0 rounded-lg border border-[#e6decb] bg-[#f5f2ea] px-3 py-2 text-[13px] leading-[1.45] text-[#5b4a2a]">
          Your filters removed {hidden} of the {totalBeforeFilters} sources.{' '}
          {usingSampleData
            ? `The live product rewrites the answer from the ${visible.length} that match; this sample drops the citations it can no longer show.`
            : `This answer is written from the ${visible.length} that match.`}
        </p>
      )}

      {stream.text ? (
        <AnswerMarkdown text={stream.text} streaming={writing} onCite={onCite} />
      ) : (
        <div className="flex flex-col gap-2.5 py-1" aria-hidden="true">
          <div className="skeleton h-4 w-[92%]" />
          <div className="skeleton h-4 w-[97%]" />
          <div className="skeleton h-4 w-[78%]" />
        </div>
      )}
      {stream.error && <p role="alert" className="m-0 text-sm text-danger">{stream.error}</p>}

      {stream.done && stream.text && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-2 pt-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Helpful answer"
              aria-pressed={query.vote === 'up'}
              onClick={() => onVote(query.vote === 'up' ? null : 'up')}
              className={cn('flex size-[34px] items-center justify-center rounded-lg', query.vote === 'up' ? 'bg-tint text-primary-ink' : 'text-muted hover:bg-[#f0f3f1]')}
            >
              <ThumbsUp className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Not helpful"
              aria-pressed={query.vote === 'down'}
              onClick={() => onVote(query.vote === 'down' ? null : 'down')}
              className={cn('flex size-[34px] items-center justify-center rounded-lg', query.vote === 'down' ? 'bg-tint text-primary-ink' : 'text-muted hover:bg-[#f0f3f1]')}
            >
              <ThumbsDown className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Copy answer"
              onClick={() =>
                navigator.clipboard.writeText(stream.text).then(
                  () => toast('Answer copied'),
                  () => toast('Copying is blocked in this browser')
                )
              }
              className="flex size-[34px] items-center justify-center rounded-lg text-muted hover:bg-[#f0f3f1]"
            >
              <Copy className="size-4" aria-hidden="true" />
            </button>
            {query.vote && <span className="pl-1 text-[13px] text-primary-ink">Thanks for the feedback</span>}
          </div>
          {isReport && (
            <div className="flex gap-1.5">
              {['Word', 'PDF'].map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => toast(`${kind} download is not active in this prototype`)}
                  className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-field bg-surface px-3 text-[13px] font-semibold"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  {kind}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
