import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { AppBar } from '@/components/layout/AppBar';
import { FilterDialog } from '@/components/filters/FilterDialog';
import { AnswerCard } from '@/components/results/AnswerCard';
import { AppliedFilters } from '@/components/results/AppliedFilters';
import { FormatSwitch } from '@/components/results/FormatSwitch';
import { QuestionHeader } from '@/components/results/QuestionHeader';
import { ResourceList } from '@/components/results/ResourceList';
import { SessionTimeline } from '@/components/results/SessionTimeline';
import { useSearch } from '@/hooks/useSearch';
import { useSessionActions, resultsPath } from '@/hooks/useSessionActions';
import { countFilters, emptyFilters } from '@/lib/filters';
import { shownFormat } from '@/lib/format';
import { useSessions } from '@/store/sessions';
import { toast } from 'sonner';

export function ResultsPage() {
  const { sessionId = '', n = '' } = useParams();
  const session = useSessions((s) => s.sessions.find((x) => x.id === sessionId));
  const updateQuery = useSessions((s) => s.updateQuery);
  const { followUp, changeFilters } = useSessionActions();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const query = session?.queries.find((q) => q.n === Number(n));
  const search = useSearch(query?.topic ?? 'malaria', query?.filters ?? emptyFilters());

  useEffect(() => {
    if (query) document.title = `${query.text} · Mesh-AI`;
  }, [query]);

  if (!session) return <Navigate to="/sessions" replace />;
  if (!query) return <Navigate to={resultsPath(session.id, session.queries[session.queries.length - 1].n)} replace />;

  const cite = (num: number) => {
    const el = document.getElementById(`res-${num}`);
    if (!el) {
      toast('That source is hidden by your filters');
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlighted(num);
    window.setTimeout(() => setHighlighted(null), 1400);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar
        variant="results"
        filterCount={countFilters(query.filters)}
        onOpenFilters={() => setFiltersOpen(true)}
        onAsk={(text) => followUp(session, query, text)}
      />
      {/*
        Session timeline in the left margin down to 900px wide (narrower margin from 1100px);
        below 900px it folds into a "This session" bar above the question.
      */}
      <div className="mx-auto grid w-full max-w-[1180px] flex-1 grid-cols-[208px_minmax(0,800px)] items-start gap-x-11 gap-y-4 px-6 pb-14 pt-7 max-[1100px]:grid-cols-[184px_minmax(0,1fr)] max-[1100px]:gap-x-8 max-[900px]:max-w-[848px] max-[900px]:grid-cols-[minmax(0,1fr)]">
        <SessionTimeline session={session} current={query.n} />
        <main className="flex min-w-0 flex-col gap-[18px]">
          <section aria-label="Question" className="flex flex-col gap-4">
            <QuestionHeader key={query.id} query={query} />
            <FormatSwitch query={query} onChange={(f) => updateQuery(session.id, query.n, { formatChosen: f })} />
          </section>
          <AnswerCard
            session={session}
            query={query}
            resources={search.data?.resources}
            totalBeforeFilters={search.data?.totalBeforeFilters ?? 0}
            onCite={cite}
            onVote={(vote) => updateQuery(session.id, query.n, { vote })}
          />
          <section aria-label="Filters applied">
            <AppliedFilters
              filters={query.filters}
              emptyText="No filters applied, so all public TGHN resources are searched."
              onRemove={(k, v) => changeFilters(session, query, { ...query.filters, [k]: query.filters[k].filter((x) => x !== v) })}
              onClear={() => changeFilters(session, query, emptyFilters())}
            />
          </section>
          <ResourceList
            resources={search.data?.resources}
            resourcesOnly={shownFormat(query) === 'resources'}
            highlighted={highlighted}
            onClearFilters={() => changeFilters(session, query, emptyFilters())}
          />
        </main>
      </div>
      <FilterDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        initial={query.filters}
        context="results"
        onApply={(next) => {
          setFiltersOpen(false);
          changeFilters(session, query, next);
        }}
      />
    </div>
  );
}
