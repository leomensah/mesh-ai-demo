import { useEffect, useState } from 'react';
import { api } from '@/api';
import type { AnswerRequest } from '@/api/types';

/* Finished answers, so going back to a query shows its answer at once instead of writing it again. */
const finished = new Map<string, string>();

interface StreamState {
  text: string;
  done: boolean;
  error: string | null;
}

/** Streams a written answer. Pass null when no answer is needed (resources only, or still searching). */
export function useAnswerStream(cacheKey: string, request: AnswerRequest | null): StreamState {
  const cached = request ? finished.get(cacheKey) : undefined;
  const [state, setState] = useState<StreamState>({ text: cached ?? '', done: !!cached, error: null });

  useEffect(() => {
    if (!request) return;
    const hit = finished.get(cacheKey);
    if (hit) {
      setState({ text: hit, done: true, error: null });
      return;
    }
    const controller = new AbortController();
    let text = '';
    setState({ text: '', done: false, error: null });
    (async () => {
      try {
        for await (const chunk of api.streamAnswer(request, controller.signal)) {
          text += chunk;
          setState({ text, done: false, error: null });
        }
        finished.set(cacheKey, text);
        setState({ text, done: true, error: null });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setState({ text, done: true, error: 'The answer could not be written. Try again.' });
      }
    })();
    return () => controller.abort();
    // The cache key captures everything in the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, request === null]);

  return state;
}
