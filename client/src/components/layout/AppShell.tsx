import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

const COLLAPSED_STORAGE_KEY = 'sims_sidebar_collapsed';

/**
 * AppShell.tsx — Main application layout wrapper
 *
 * Combines fixed desktop Sidebar (with collapsible rail state), top Header, and dynamic <Outlet />.
 * Applied as a layout route in AppRoutes.tsx to wrap all protected workspace pages.
 */
export const AppShell = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore sidebar collapse state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Desktop Fixed Sidebar (collapsible rail) */}
      <Sidebar
        collapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        className="hidden lg:flex shrink-0"
      />

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
