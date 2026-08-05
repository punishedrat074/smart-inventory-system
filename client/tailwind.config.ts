import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  // ─── Dark Mode Strategy ──────────────────────────────────────────────────────
  // 'class' strategy: dark mode activates when a `.dark` class is present on
  // the <html> element. This lets the user toggle dark/light mode via JavaScript
  // (stored in localStorage), unlike the 'media' strategy which only responds
  // to the OS preference and cannot be overridden by the user.
  darkMode: 'class',

  // ─── Content Sources ─────────────────────────────────────────────────────────
  // Tailwind scans these files to determine which utility classes are used.
  // Only the classes found here are included in the final CSS bundle.
  // This keeps the production CSS extremely small (typically < 20KB).
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  theme: {
    extend: {
      // ─── Color Palette ─────────────────────────────────────────────────────
      // All colours reference CSS custom properties defined in index.css.
      // This approach (CSS variables + Tailwind mapping) is the standard
      // shadcn/ui pattern — it allows themes to be switched at runtime
      // without regenerating the CSS bundle.
      colors: {
        // Semantic surface colours
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Card / panel surfaces
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Popover surfaces (dropdowns, tooltips, etc.)
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Primary brand colour (used for primary buttons, active states)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // Secondary / muted actions
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Muted text and backgrounds (placeholders, captions)
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Accent highlights (hover states, active tabs)
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Destructive / danger actions (delete, error states)
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Form / input borders
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Status colours used in badges and alerts
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
      },

      // ─── Border Radius ──────────────────────────────────────────────────────
      // References a single CSS variable so the entire app's corner radius can
      // be changed in one place. shadcn/ui uses this same pattern.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ─── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        // Inter: the standard professional SaaS font (Linear, Vercel, Stripe).
        // Loaded via Google Fonts @import in index.css.
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // JetBrains Mono: used for code snippets, token values, IDs.
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },

      // ─── Animation ──────────────────────────────────────────────────────────
      // Used by shadcn/ui components (accordion, dialog, etc.)
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
      },
    },
  },

  plugins: [tailwindcssAnimate],
};

export default config;
