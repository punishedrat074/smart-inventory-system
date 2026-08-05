import {
  Activity,
  FolderTree,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/auth.types';
import { cn } from '@/utils';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Categories', href: '/categories', icon: FolderTree },
  { label: 'Suppliers', href: '/suppliers', icon: Truck },
  { label: 'Purchases', href: '/purchases', icon: ShoppingBag },
  { label: 'Sales', href: '/sales', icon: Receipt },
  { label: 'Activity Log', href: '/activity', icon: Activity },
  {
    label: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['ADMIN'],
    badge: 'Admin',
  },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick?: () => void;
  className?: string;
}

/**
 * Sidebar.tsx — Main navigation sidebar component
 *
 * Supports expanded (w-64) and collapsed (w-16) icon-rail modes for desktop viewports,
 * active route highlighting, role-gated Admin items, and collapse toggle controls.
 */
export const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  onItemClick,
  className,
}: SidebarProps) => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  // Filter navigation links based on user role
  const visibleNavItems = navItems.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole)),
  );

  return (
    <aside
      className={cn(
        'bg-card border-r border-border flex flex-col justify-between h-full select-none transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Brand Logo & Header */}
      <div>
        <div
          className={cn(
            'h-16 flex items-center border-b border-border/50 transition-all duration-300',
            collapsed ? 'justify-center px-0' : 'justify-between px-6',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
              <Package className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="font-bold text-base tracking-tight leading-none text-foreground whitespace-nowrap">
                  SIMS
                </span>
                <span className="text-[11px] text-muted-foreground font-mono mt-0.5 whitespace-nowrap">
                  Smart Inventory
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={cn('p-2 space-y-1', collapsed ? 'px-2' : 'p-3')}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-md text-sm font-medium transition-colors duration-150 group relative',
                    collapsed
                      ? 'justify-center h-10 w-full px-0'
                      : 'justify-between px-3 py-2.5',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        'flex items-center min-w-0',
                        collapsed ? 'justify-center' : 'gap-3',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Optional Badge (Expanded Mode Only) */}
                    {!collapsed && item.badge && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 font-mono font-normal border-primary/30 text-primary"
                      >
                        {item.badge}
                      </Badge>
                    )}

                    {/* Active Bar Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls & Status */}
      <div className="border-t border-border/50 p-2 sm:p-3 space-y-2">
        {/* Collapse Toggle Button (Desktop/Tablet) */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'w-full flex items-center text-muted-foreground hover:text-foreground',
              collapsed ? 'justify-center px-0' : 'justify-between px-3',
            )}
          >
            {!collapsed && (
              <span className="text-xs font-mono">Collapse Rail</span>
            )}
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Footer Version Info */}
        {!collapsed ? (
          <div className="px-3 py-1 text-xs text-muted-foreground flex items-center justify-between font-mono">
            <span>SIMS v1.0.0</span>
            <span className="h-2 w-2 rounded-full bg-success inline-block" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span
              className="h-2 w-2 rounded-full bg-success inline-block"
              title="System Online"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
