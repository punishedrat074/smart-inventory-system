import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'sims_theme_preference';

/** Helper: resolve active theme considering OS / browser prefers-color-scheme */
const getResolvedTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'dark';
  }
  return theme;
};

/** Helper: apply .dark or .light class to <html> DOM element */
const applyThemeToDOM = (resolvedTheme: ResolvedTheme): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
};

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system', // Default fallback is system
  resolvedTheme: 'dark',

  /**
   * Sets new theme preference, persists to localStorage, and updates DOM class.
   */
  setTheme: (theme: Theme) => {
    const resolved = getResolvedTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore localStorage access errors
    }
    applyThemeToDOM(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  /**
   * Initializes theme from localStorage or system media query on app load.
   */
  initTheme: () => {
    let savedTheme: Theme = 'system';
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        savedTheme = stored;
      }
    } catch {
      savedTheme = 'system';
    }

    const resolved = getResolvedTheme(savedTheme);
    applyThemeToDOM(resolved);
    set({ theme: savedTheme, resolvedTheme: resolved });

    // Listen for OS system theme preference changes if mode is 'system'
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: MediaQueryListEvent) => {
        if (get().theme === 'system') {
          const newResolved = e.matches ? 'dark' : 'light';
          applyThemeToDOM(newResolved);
          set({ resolvedTheme: newResolved });
        }
      };

      try {
        mediaQuery.removeEventListener('change', handleSystemChange);
        mediaQuery.addEventListener('change', handleSystemChange);
      } catch {
        try {
          mediaQuery.removeListener(handleSystemChange);
          mediaQuery.addListener(handleSystemChange);
        } catch {
          // Fallback for older browsers
        }
      }
    }
  },
}));
