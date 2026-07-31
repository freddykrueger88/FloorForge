import { create } from 'zustand';

/**
 * FloorForge – Theme Store (Zustand)
 * Themes: dark | light | vikings | iff
 */
export const useThemeStore = create((set) => ({
  theme: 'dark',

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('floorforge-theme', theme);
    } catch {
      // localStorage kann in manchen Umgebungen geblockt sein
    }
    set({ theme });
  },

  toggleDarkLight: () => {
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('floorforge-theme', next);
      } catch { /* noop */ }
      return { theme: next };
    });
  },
}));
