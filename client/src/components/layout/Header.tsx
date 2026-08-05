import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';

/** Helper to generate page title from current pathname */
const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/inventory':
      return 'Inventory Items';
    case '/categories':
      return 'Categories';
    case '/suppliers':
      return 'Suppliers';
    case '/purchases':
      return 'Purchase Orders';
    case '/sales':
      return 'Sales & Invoices';
    case '/activity':
      return 'Activity Log';
    case '/users':
      return 'User Management';
    case '/settings':
      return 'Settings';
    default:
      return 'Workspace';
  }
};

/**
 * Header.tsx — Main application top navigation bar
 *
 * Features:
 *   - Mobile menu sheet drawer trigger
 *   - Current page title / location breadcrumb
 *   - API connection status badge
 *   - User profile dropdown menu with role badge and logout action
 */
export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = getPageTitle(location.pathname);

  // Compute user initials for avatar fallback (e.g. "Jane Doe" -> "JD")
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'U';

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Drawer & Current Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Navigation Sheet Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 bg-card border-r border-border"
          >
            <Sidebar onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Page Title / Breadcrumb */}
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: API Status & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* API Connection Indicator (Desktop) */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>API Online</span>
        </div>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-accent focus-visible:ring-1"
            >
              {/* User Avatar Circle */}
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>

              {/* User Name & Role (Desktop) */}
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-none">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {user?.role}
                </span>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Header Profile Summary */}
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {user?.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Menu Items */}
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile Settings</span>
            </DropdownMenuItem>

            {user?.role === 'ADMIN' && (
              <DropdownMenuItem onClick={() => navigate('/users')}>
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>User Management</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>System Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout Action */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
