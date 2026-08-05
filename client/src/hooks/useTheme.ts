import type { ResolvedTheme, Theme } from '@/store/themeStore';
import { useThemeStore } from '@/store/themeStore';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

/**
 * useTheme.ts — Custom React hook for accessing and toggling themes
 *
 * Usage:
 *   const { theme, resolvedTheme, setTheme } = useTheme();
 *   setTheme('dark');
 */
export const useTheme = (): UseThemeReturn => {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
};
