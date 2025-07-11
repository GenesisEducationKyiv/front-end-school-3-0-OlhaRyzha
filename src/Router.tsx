import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { ROOT, TRACKS } from './constants/route.constant';
import { Loader } from '@/components/shared';

const HomePage = lazy(() => import('./pages/HomePage'));
const TracksPage = lazy(() => import('./pages/TracksPage'));

export const router = createBrowserRouter(
  [
    {
      path: ROOT,
      element: <App />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loader loading />}>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: `${ROOT}${TRACKS}`,
          element: (
            <Suspense fallback={<Loader loading />}>
              <TracksPage />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: (
            <Navigate
              to={ROOT}
              replace
            />
          ),
        },
      ],
    },
  ],
  {
    basename: '/tracker',
  }
);
