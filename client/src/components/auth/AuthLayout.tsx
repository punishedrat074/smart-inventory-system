import { CheckCircle2, Package, ShieldCheck, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/**
 * AuthLayout.tsx — Split-panel authentication layout
 *
 * Left panel (desktop): Dark SaaS branding, feature bullets, and system stats badge.
 * Right panel: Centered auth form card with responsive spacing.
 */
export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background font-sans text-foreground">
      {/* Left Panel — SaaS Branding & Product Highlights (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-card border-r border-border relative overflow-hidden">
        {/* Subtle background glow accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block">SIMS</span>
            <span className="text-xs text-muted-foreground font-mono">
              Smart Inventory System
            </span>
          </div>
        </div>

        {/* Product Value Proposition */}
        <div className="space-y-6 relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Enterprise Inventory SaaS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
            Real-time control over every item in your supply chain.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage stock levels, automate purchase orders, track sales trends,
            and empower your team with role-based access control.
          </p>

          {/* Feature List */}
          <div className="space-y-3 pt-2 text-sm text-muted-foreground">
            {[
              {
                icon: ShieldCheck,
                text: 'Role-based authorization & JWT security',
              },
              { icon: Zap, text: 'Real-time stock alerts & reorder triggers' },
              {
                icon: CheckCircle2,
                text: 'Audit trail and transaction history',
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Badge */}
        <div className="relative z-10 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Smart Inventory System</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Right Panel — Form Container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <span className="font-bold text-base tracking-tight">SIMS</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Header titles */}
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {/* Render Form Child */}
          {children}
        </div>
      </div>
    </div>
  );
};
