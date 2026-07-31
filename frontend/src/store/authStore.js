import { create } from 'zustand';

/**
 * FloorForge – Auth Store (Zustand)
 * Vollständige Auth-Logik folgt in Issue #4
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    // Token im Memory halten (nicht localStorage wegen Docker-Sandbox)
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));
