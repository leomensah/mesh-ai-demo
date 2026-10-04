/*
  Data shapes shared by the UI and the API. They mirror the records in the Mesh-AI design doc
  (Session, Query, Event), so the mock API can be swapped for the real service without UI changes.
*/

export type FilterKey = 'type' | 'topic' | 'health' | 'region' | 'country' | 'hub' | 'lang' | 'year';

/** Multi-select filters: a result matches any choice within a filter, and every filter in use. */
export type Filters = Record<FilterKey, string[]>;

export type AnswerFormat = 'resources' | 'summary' | 'paragraph' | 'report';

export type QueryTrigger = 'new_search' | 'follow_up' | 'filters_changed';

export type SessionOrigin = 'home' | 'example';

export interface Resource {
  id: string;
  title: string;
  url: string;
  summary: string;
  typeLabel: string;
  where: string;
  date: string;
  authors: string;
  tags: Partial<Filters>;
}

/** A resource as shown for one query: numbered so the answer can cite it. */
export interface RankedResource extends Resource {
  n: number;
}

export interface Query {
  id: string;
  n: number;
  at: string; // ISO date
  trigger: QueryTrigger;
  text: string;
  /** The follow-up rewritten as a standalone query, using the session's earlier queries as context. */
  searchedAs: string | null;
  filters: Filters;
  /** Topic key the sample data uses to pick resources and answers. */
  topic: string;
  /** Set when the prototype has no sample answer for this exact query. */
  fallback: 'sample' | 'inherited' | null;
  formatAutomatic: AnswerFormat;
  formatReason: string;
  formatChosen: AnswerFormat | null;
  vote: 'up' | 'down' | null;
}

export interface Session {
  id: string;
  startedAt: string; // ISO date
  startedFrom: SessionOrigin;
  queries: Query[];
}

/** What the query-understanding step returns before retrieval runs. */
export interface Understanding {
  topic: string;
  fallback: Query['fallback'];
  formatAutomatic: AnswerFormat;
  formatReason: string;
  /** True when the user's own words asked for a format. */
  formatAsked: boolean;
  searchedAs: string | null;
}

export interface SearchResult {
  resources: RankedResource[];
  /** How many resources the topic has before filters are applied. */
  totalBeforeFilters: number;
}

export interface AnswerRequest {
  topic: string;
  format: Exclude<AnswerFormat, 'resources'>;
  /** Citation numbers of the resources the user can see; citations to others are dropped. */
  visible: number[];
  /** True when an earlier query in the session was about the malaria vaccine trial. */
  malariaContext: boolean;
}
