import { useEffect } from 'react';

import { AppRoutes } from '@/routes/AppRoutes';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

/**
 * App.tsx — Main application root component
 *
 * Initializes the authentication session and theme state on app mount, then renders AppRoutes.
 */
function App() {
  useEffect(() => {
    useThemeStore.getState().initTheme();
    useAuthStore.getState().initAuth();
  }, []);

  return <AppRoutes />;
}

export default App;
