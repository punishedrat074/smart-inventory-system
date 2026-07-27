import '@/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';

// Locate the root DOM element declared in index.html.
// We throw a descriptive error rather than passing null to createRoot(),
// which would produce a confusing React-internal error message.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[main] Root element <div id="root"> not found in index.html. ' +
      'The application cannot mount.',
  );
}

// React 18's concurrent-capable root API.
// Using createRoot() (not the legacy ReactDOM.render()) is required to:
//   - Enable Concurrent Mode features (Suspense, transitions)
//   - Opt into automatic batching of state updates
//   - Use the StrictMode double-invoke behavior for side-effect detection
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
