import { create } from 'zustand';
import api from '../utils/api.js';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Fehler ignorieren – immer ausloggen
    } finally {
      set({ user: null });
    }
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, loading: false });
    } catch (_) {
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;
