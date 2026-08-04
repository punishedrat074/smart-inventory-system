/**
 * App.tsx — Task 21 verification component
 *
 * Replaces the Task 03 inline-styles scaffold with Tailwind utility classes.
 * This component is intentionally simple — its only purpose is to confirm that:
 *   - Tailwind directives are working (@tailwind base/components/utilities)
 *   - CSS custom properties are resolving (bg-background, text-foreground, etc.)
 *   - The Inter font is loading from Google Fonts
 *   - Dark mode is the default (no .light class on <html>)
 *
 * This component will be replaced in Task 28 (AppShell) with the real layout.
 */
function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-8 space-y-5">
        {/* Status badge */}
        <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Task 21 — Tailwind configured
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Smart Inventory Management System
          </h1>
          <p className="text-sm text-muted-foreground">
            Tailwind CSS + design tokens are active.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Token verification list */}
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            'Tailwind utilities (bg-background, text-foreground)',
            'CSS variables resolved (HSL design tokens)',
            'Inter font loading from Google Fonts',
            'Dark mode default — .light class for light variant',
            'Border radius token (--radius)',
            'Success / warning / danger status colours',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-success mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Footer note */}
        <p className="text-xs text-muted-foreground/60">
          Next: shadcn/ui primitives (Task 22) · Axios client (Task 23)
        </p>

        {/* API server link */}
        <a
          href="http://localhost:5000"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-primary hover:text-primary/80 transition-colors duration-150"
        >
          Verify API server →
        </a>
      </div>
    </div>
  );
}

export default App;
