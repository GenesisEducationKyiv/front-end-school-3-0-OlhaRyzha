import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

import { ROOT, TRACKS } from './constants/route.constant';
import { HomePage, TracksPage } from './pages';

export const router = createBrowserRouter(
  [
    {
      path: ROOT,
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: `${ROOT}${TRACKS}`, element: <TracksPage /> },
        {
          path: '*',
          element: (
            <Navigate
              to='/'
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
