import type { CSSProperties } from 'react';

/**
 * The scaffold state communicates clearly to the developer that the project
 * is in early setup, while providing links to verify that both the frontend
 * and backend are running correctly.
 *
 * No Tailwind, no shadcn — those are Task 21 and 22.
 * Inline styles are intentional and temporary.
 */
function App() {
  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.badge}>Task 03 — Scaffold complete</div>
        <h1 style={styles.heading}>Smart Inventory Management System</h1>
        <p style={styles.subheading}>
          Vite + React 18 + TypeScript is running.
        </p>

        <div style={styles.divider} />

        <ul style={styles.checklist}>
          <li>✅ Vite dev server (port 5173)</li>
          <li>✅ React 18 + StrictMode</li>
          <li>✅ TypeScript strict mode</li>
          <li>✅ HMR — edit this file and the page updates instantly</li>
          <li>✅ @ path alias configured</li>
          <li>✅ /api proxy → Express on port 5000</li>
        </ul>

        <div style={styles.divider} />

        <p style={styles.caption}>
          Coming next: Tailwind (Task 21) · shadcn/ui (Task 22) · React Router
          (Task 27) · AppShell (Task 28)
        </p>

        <a
          href="http://localhost:5000"
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          Verify API server →
        </a>
      </div>
    </div>
  );
}

export default App;

// ─── Temporary inline styles ──────────────────────────────────────────────────
// These are replaced entirely when Tailwind is added in Task 21.
// Using a style object (not a <style> tag) keeps the file self-contained
// and avoids polluting the global CSS namespace during the scaffold phase.
const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#09090b',
    padding: '1.5rem',
  },
  card: {
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '480px',
    width: '100%',
  },
  badge: {
    display: 'inline-block',
    background: '#052e16',
    color: '#4ade80',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    padding: '0.25rem 0.625rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  heading: {
    margin: '0 0 0.5rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fafafa',
  },
  subheading: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#a1a1aa',
  },
  divider: {
    height: '1px',
    background: '#27272a',
    margin: '1.25rem 0',
  },
  checklist: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#a1a1aa',
  },
  caption: {
    fontSize: '0.75rem',
    color: '#52525b',
    margin: 0,
  },
  link: {
    display: 'inline-block',
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#0070f3',
    textDecoration: 'none',
  },
} satisfies Record<string, CSSProperties>;
