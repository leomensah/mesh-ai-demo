import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Composer } from '@/components/home/Composer';
import { Examples } from '@/components/home/Examples';
import { RecentSessions } from '@/components/home/RecentSessions';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { useSessionActions } from '@/hooks/useSessionActions';
import { emptyFilters } from '@/lib/filters';
import { useSortedSessions } from '@/store/sessions';
import { TOPICS } from '@/api/mock/topics';

export function HomePage() {
  const sessions = useSortedSessions();
  const { startSession } = useSessionActions();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Mesh-AI';
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <main className="mx-auto flex w-full max-w-[920px] flex-1 flex-col gap-9 px-6 pb-14 pt-16 max-[640px]:pt-9">
        <div>
          <h1 className="m-0 text-[40px] font-bold leading-[1.12] tracking-[-0.02em] text-balance max-[640px]:text-[30px]">Ask the Global Health Network</h1>
          <p className="mb-0 mt-3 max-w-[680px] text-[19px] leading-normal text-[#3d4f48] max-[640px]:text-[17px]">
            Search guides, reports and courses from every TGHN hub, or ask a question and get an answer that cites them.
          </p>
        </div>
        <Composer
          key={location.key}
          initialFilters={emptyFilters()}
          onSearch={(text, filters, format) => startSession(text.trim() || TOPICS.malaria.question, filters, format, 'home')}
        />
        <RecentSessions sessions={sessions} />
        <Examples onPick={(q) => startSession(q, emptyFilters(), 'auto', 'example')} />
      </main>
      <Footer />
    </div>
  );
}
