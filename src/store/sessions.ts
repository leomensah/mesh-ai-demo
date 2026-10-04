import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Query, Session, SessionOrigin } from '@/api/types';
import { TOPICS, EXAMPLES } from '@/api/mock/topics';
import { copyFilters, emptyFilters } from '@/lib/filters';
import { randomId } from '@/lib/utils';

/*
  Sessions live in this browser (localStorage). Every search from the home page starts one;
  follow-ups and filter changes add queries to the end; switching format updates the query on screen.
*/

export type NewQuery = Omit<Query, 'id' | 'n'>;

interface SessionsState {
  sessions: Session[];
  createSession: (origin: SessionOrigin, first: NewQuery) => string;
  appendQuery: (sessionId: string, query: NewQuery) => number;
  updateQuery: (sessionId: string, n: number, patch: Partial<Pick<Query, 'formatChosen' | 'vote'>>) => void;
  clearAll: () => void;
}

const queryId = (sessionId: string, n: number) => sessionId.replace('ses_', 'q_') + '_' + n;

export const lastActive = (s: Session) => s.queries[s.queries.length - 1].at;
export const byRecent = (a: Session, b: Session) => lastActive(b).localeCompare(lastActive(a));

/* Sample sessions for a first visit, so Home and All sessions have something to open. */
function sampleSessions(): Session[] {
  const now = Date.now();
  const ago = (min: number) => new Date(now - min * 60000).toISOString();
  const english = copyFilters({ lang: ['English'] });
  const schoolsMalaria = TOPICS.schools.rewrite!({ malaria: true });
  const q = (sessionId: string, n: number, rest: Omit<Query, 'id' | 'n' | 'vote' | 'formatChosen' | 'fallback' | 'searchedAs' | 'filters'> & Partial<Query>): Query => ({
    id: queryId(sessionId, n),
    n,
    vote: null,
    formatChosen: null,
    fallback: null,
    searchedAs: null,
    filters: emptyFilters(),
    ...rest
  });
  return [
    {
      id: 'ses_sample1',
      startedAt: ago(26),
      startedFrom: 'example',
      queries: [
        q('ses_sample1', 1, { at: ago(26), trigger: 'new_search', text: EXAMPLES[0].q, topic: 'malaria', formatAutomatic: 'summary', formatReason: TOPICS.malaria.formatReason, filters: copyFilters(english) }),
        q('ses_sample1', 2, { at: ago(23), trigger: 'follow_up', text: 'How could we involve local schools?', topic: 'schools', formatAutomatic: 'summary', formatReason: TOPICS.schools.formatReason, filters: copyFilters(english), searchedAs: schoolsMalaria }),
        q('ses_sample1', 3, { at: ago(20), trigger: 'follow_up', text: 'Write this up as a report I can share with my team', topic: 'schools', formatAutomatic: 'report', formatReason: 'you asked for a report', filters: copyFilters(english), searchedAs: 'a report on ' + schoolsMalaria })
      ]
    },
    {
      id: 'ses_sample2',
      startedAt: ago(190),
      startedFrom: 'home',
      queries: [
        q('ses_sample2', 1, { at: ago(190), trigger: 'new_search', text: EXAMPLES[1].q, topic: 'trials', formatAutomatic: 'resources', formatReason: 'you asked for a list of resources' }),
        q('ses_sample2', 2, { at: ago(185), trigger: 'follow_up', text: 'What about schools?', topic: 'schools', formatAutomatic: 'summary', formatReason: TOPICS.schools.formatReason, searchedAs: TOPICS.schools.rewrite!({ malaria: false }) })
      ]
    },
    {
      id: 'ses_sample3',
      startedAt: ago(24 * 60 + 150),
      startedFrom: 'home',
      queries: [q('ses_sample3', 1, { at: ago(24 * 60 + 150), trigger: 'new_search', text: EXAMPLES[3].q, topic: 'trials', formatAutomatic: 'paragraph', formatReason: 'you asked for one paragraph' })]
    },
    {
      id: 'ses_sample4',
      startedAt: ago(4 * 24 * 60 + 60),
      startedFrom: 'example',
      queries: [q('ses_sample4', 1, { at: ago(4 * 24 * 60 + 60), trigger: 'new_search', text: EXAMPLES[2].q, topic: 'malaria', formatAutomatic: 'report', formatReason: 'you asked for a report' })]
    }
  ];
}

export const useSessions = create<SessionsState>()(
  persist(
    (set, get) => ({
      sessions: sampleSessions(),

      createSession: (origin, first) => {
        const id = randomId('ses_');
        const session: Session = { id, startedAt: first.at, startedFrom: origin, queries: [{ ...first, id: queryId(id, 1), n: 1 }] };
        set({ sessions: [session, ...get().sessions] });
        return id;
      },

      appendQuery: (sessionId, query) => {
        let n = 0;
        set({
          sessions: get().sessions.map((s) => {
            if (s.id !== sessionId) return s;
            n = s.queries.length + 1;
            return { ...s, queries: [...s.queries, { ...query, id: queryId(s.id, n), n }] };
          })
        });
        return n;
      },

      updateQuery: (sessionId, n, patch) =>
        set({
          sessions: get().sessions.map((s) =>
            s.id !== sessionId ? s : { ...s, queries: s.queries.map((q) => (q.n === n ? { ...q, ...patch } : q)) }
          )
        }),

      clearAll: () => set({ sessions: [] })
    }),
    { name: 'mesh-ai-sessions', version: 1, storage: createJSONStorage(() => localStorage) }
  )
);

export function useSortedSessions(): Session[] {
  const sessions = useSessions((s) => s.sessions);
  return [...sessions].sort(byRecent);
}
