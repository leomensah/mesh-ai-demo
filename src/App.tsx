import { useEffect } from 'react';
import { Outlet, createHashRouter, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from '@/pages/HomePage';
import { ResultsPage } from '@/pages/ResultsPage';
import { SessionsPage } from '@/pages/SessionsPage';

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Outlet />
      <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
    </>
  );
}

/*
  Hash routes (#/s/ses_abc/2) so the app works when opened as a file and on static hosting
  such as S3 without any rewrite rules.
*/
export const router = createHashRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sessions', element: <SessionsPage /> },
      { path: '/s/:sessionId/:n', element: <ResultsPage /> },
      { path: '*', element: <HomePage /> }
    ]
  }
]);
