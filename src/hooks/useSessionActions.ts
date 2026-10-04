import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { api } from '@/api';
import type { AnswerFormat, Filters, Query, Session, SessionOrigin } from '@/api/types';
import { showNewSessionToast } from '@/components/results/NewSessionToast';
import { copyFilters, emptyFilters, sameFilters } from '@/lib/filters';
import { useSessions, type NewQuery } from '@/store/sessions';

export const resultsPath = (sessionId: string, n: number) => `/s/${sessionId}/${n}`;

/* The session rules in one place: start, edit a question, follow up, change filters. */
export function useSessionActions() {
  const navigate = useNavigate();

  /** Creates a session whose first query is `text`, and returns its id. */
  async function createSession(text: string, filters: Filters, format: AnswerFormat | 'auto', origin: SessionOrigin) {
    const u = await api.understand(text, null, []);
    const query: NewQuery = {
      at: new Date().toISOString(),
      trigger: 'new_search',
      text: text.trim(),
      searchedAs: null,
      filters: copyFilters(filters),
      topic: u.topic,
      fallback: u.fallback,
      formatAutomatic: u.formatAutomatic,
      formatReason: u.formatReason,
      formatChosen: format !== 'auto' && format !== u.formatAutomatic ? format : null,
      vote: null
    };
    return useSessions.getState().createSession(origin, query);
  }

  /** A search from the home page: always a new session. */
  async function startSession(text: string, filters: Filters, format: AnswerFormat | 'auto', origin: SessionOrigin) {
    const id = await createSession(text, filters, format, origin);
    navigate(resultsPath(id, 1));
  }

  /**
   * Editing the question on screen starts a new session with no filters and the automatic format.
   * The session it came from is left as it was; the toast offers a way back to it.
   */
  async function editAsNewSession(from: Session, onScreen: Query, text: string) {
    const id = await createSession(text, emptyFilters(), 'auto', 'edit');
    navigate(resultsPath(id, 1));
    showNewSessionToast(() => navigate(resultsPath(from.id, onScreen.n)));
  }

  /** A follow-up keeps the filters and format on screen, unless its own words ask for a format. */
  async function followUp(session: Session, onScreen: Query, text: string) {
    const u = await api.understand(text, onScreen, session.queries);
    const keep = u.formatAsked ? null : onScreen.formatChosen;
    const n = useSessions.getState().appendQuery(session.id, {
      at: new Date().toISOString(),
      trigger: 'follow_up',
      text: text.trim(),
      searchedAs: u.searchedAs,
      filters: copyFilters(onScreen.filters),
      topic: u.topic,
      fallback: u.fallback,
      formatAutomatic: u.formatAutomatic,
      formatReason: u.formatReason,
      formatChosen: keep && keep !== u.formatAutomatic ? keep : null,
      vote: null
    });
    navigate(resultsPath(session.id, n));
  }

  /** Changing filters re-runs the question on screen and adds it to the end of the session. */
  function changeFilters(session: Session, onScreen: Query, filters: Filters) {
    if (sameFilters(onScreen.filters, filters)) return;
    const { id, n: previous, ...rest } = onScreen;
    void id;
    void previous;
    const n = useSessions.getState().appendQuery(session.id, {
      ...rest,
      at: new Date().toISOString(),
      trigger: 'filters_changed',
      filters: copyFilters(filters),
      vote: null
    });
    navigate(resultsPath(session.id, n));
    toast(`Filters changed, so query ${n} was added to this session`);
  }

  return { startSession, editAsNewSession, followUp, changeFilters };
}
