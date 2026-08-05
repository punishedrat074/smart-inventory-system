import {
  Activity,
  FolderTree,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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

/**
 * MobileNav.tsx — Responsive mobile navigation sheet drawer component
 *
 * Provides a slide-out drawer navigation for screen sizes below lg breakpoint (< 1024px).
 * Automatically closes upon clicking any navigation link.
 */
export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const userRole = user?.role;

  // Filter navigation links based on user role
  const visibleNavItems = navItems.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole)),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground hover:text-foreground"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-72 bg-card border-r border-border flex flex-col justify-between h-full select-none"
      >
        <div>
          {/* Mobile Drawer Header */}
          <SheetHeader className="h-16 px-6 flex items-center justify-between border-b border-border/50 text-left">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="font-bold text-base tracking-tight leading-none text-foreground">
                  SIMS
                </SheetTitle>
                <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  Smart Inventory
                </span>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 relative',
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 font-mono font-normal border-primary/30 text-primary"
                        >
                          {item.badge}
                        </Badge>
                      )}

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

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-between font-mono">
          <span>SIMS Mobile v1.0.0</span>
          <span className="h-2 w-2 rounded-full bg-success inline-block" />
        </div>
      </SheetContent>
    </Sheet>
  );
};
