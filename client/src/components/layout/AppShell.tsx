import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * AppShell.tsx — Main application layout wrapper
 *
 * Combines fixed desktop Sidebar, top Header, and dynamic <Outlet /> content container.
 * Applied as a layout route in AppRoutes.tsx to wrap all protected workspace pages.
 */
export const AppShell = () => {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Desktop Fixed Sidebar */}
      <Sidebar className="hidden lg:flex shrink-0" />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
