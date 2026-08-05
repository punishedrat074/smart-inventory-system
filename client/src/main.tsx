import '@/index.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/queryClient';

// Locate the root DOM element declared in index.html.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[main] Root element <div id="root"> not found in index.html. ' +
      'The application cannot mount.',
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </React.StrictMode>,
);
