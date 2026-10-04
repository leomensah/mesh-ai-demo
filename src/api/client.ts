import type { AnswerRequest, Filters, Query, SearchResult, Understanding } from './types';

/*
  Everything the UI needs from the backend. The prototype uses the mock implementation;
  set VITE_API_URL to use the real service instead (see http.ts).
*/
export interface MeshApi {
  /** Reads the query: answer format, topic, and (for follow-ups) a standalone rewrite. */
  understand(text: string, onScreen: Query | null, session: Query[]): Promise<Understanding>;
  /** Hybrid search with filters. Results are numbered so answers can cite them. */
  search(topic: string, filters: Filters): Promise<SearchResult>;
  /** Streams the written answer as markdown with [n] citation markers. */
  streamAnswer(request: AnswerRequest, signal?: AbortSignal): AsyncIterable<string>;
}
