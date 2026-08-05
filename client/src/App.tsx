import { useEffect } from 'react';

import { AppRoutes } from '@/routes/AppRoutes';
import { useAuthStore } from '@/store/authStore';

/**
 * App.tsx — Main application root component
 *
 * Initializes the authentication session on app mount and renders AppRoutes.
 */
function App() {
  useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  return <AppRoutes />;
}

export default App;
