import type { MeshApi } from './client';
import type { AnswerRequest, Filters, Query, SearchResult, Understanding } from './types';

/*
  Client for the real Mesh-AI service. Endpoints are a proposal that matches the design doc:
    POST /understand   { text, onScreen, session }   -> Understanding
    POST /search       { topic, filters }            -> SearchResult
    POST /answer       AnswerRequest                 -> text/plain stream of markdown
  Nothing in the UI changes when this replaces the mock.
*/
export function createHttpApi(baseUrl: string): MeshApi {
  const url = (path: string) => baseUrl.replace(/\/$/, '') + path;

  async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(url(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`${path} failed with ${res.status}`);
    return (await res.json()) as T;
  }

  return {
    understand: (text: string, onScreen: Query | null, session: Query[]) =>
      post<Understanding>('/understand', { text, onScreen, session }),
    search: (topic: string, filters: Filters) => post<SearchResult>('/search', { topic, filters }),
    async *streamAnswer(request: AnswerRequest, signal?: AbortSignal) {
      const res = await fetch(url('/answer'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal
      });
      if (!res.ok || !res.body) throw new Error(`/answer failed with ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) return;
        yield decoder.decode(value, { stream: true });
      }
    }
  };
}
