import { create } from 'zustand';

import {
  getMeApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
} from '@/api/auth.api';
import { setAccessToken } from '@/api/client';
import { queryClient } from '@/lib/queryClient';
import type { AuthUser, LoginInput, RegisterInput } from '@/types/auth.types';

/**
 * authStore.ts — Centralized Zustand Authentication Store
 *
 * Manages client-side user session state, token synchronization with the Axios
 * HTTP client (api/client.ts), and query cache cleanup on logout.
 *
 * Security Model:
 *   - Access tokens stay in-memory (`client.ts` module state via `setAccessToken`).
 *   - Refresh tokens are stored in HttpOnly cookies managed automatically by the server.
 */

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;

  // State mutators
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;

  // Async session actions
  login: (credentials: LoginInput) => Promise<AuthUser>;
  register: (credentials: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,

  /**
   * Updates state with authenticated user and passes access token to Axios.
   */
  setAuth: (user: AuthUser, accessToken: string) => {
    setAccessToken(accessToken);
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      isInitializing: false,
    });
  },

  /**
   * Resets authentication state, clears access token, and purges query cache.
   */
  clearAuth: () => {
    setAccessToken(null);
    queryClient.clear();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
    });
  },

  /**
   * Executes user login API call and updates session state.
   */
  login: async (credentials: LoginInput) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(credentials);
      const { user, accessToken } = response.data;
      get().setAuth(user, accessToken);
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Executes user registration API call and updates session state.
   */
  register: async (credentials: RegisterInput) => {
    set({ isLoading: true });
    try {
      const response = await registerApi(credentials);
      const { user, accessToken } = response.data;
      get().setAuth(user, accessToken);
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Calls server logout endpoint to revoke refresh token cookie and clears local session.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
    } catch {
      // Silently proceed with local session clearing even if server logout fails
    } finally {
      get().clearAuth();
    }
  },

  /**
   * Restores session on app startup via refresh cookie.
   * Runs once on application mount.
   */
  initAuth: async () => {
    set({ isInitializing: true });
    try {
      // 1. Attempt token refresh using the HttpOnly cookie
      const refreshRes = await refreshApi();
      const accessToken = refreshRes.data.accessToken;
      setAccessToken(accessToken);

      // 2. Fetch authenticated user profile using the new access token
      const meRes = await getMeApi();
      get().setAuth(meRes.data.user, accessToken);
    } catch {
      // If refresh or getMe fails (no cookie / expired session), finish initialization unauthenticated
      get().clearAuth();
    }
  },
}));

// ─── Global Event Listener ───────────────────────────────────────────────────
// Listens for 'auth:logout' event emitted by api/client.ts when 401 refresh fails.
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth();
  });
}
