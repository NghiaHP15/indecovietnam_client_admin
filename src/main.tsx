// react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// react
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// react helmet
import { HelmetProvider } from 'react-helmet-async';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';

import App from '@/App';

// import worker from './_mock';
// i18n
import './locales/i18n';
// tailwind css
import './theme/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      gcTime: 300_000,
      staleTime: 10_1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <App />
      </Suspense>
    </QueryClientProvider>
  </HelmetProvider>,
);

// 🥵 start service worker mock in development mode
if (process.env.NODE_ENV === 'development') {
  // worker.start({ onUnhandledRequest: 'bypass' });
}
