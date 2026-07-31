import { create } from 'zustand';

const THEMES = ['dark', 'light', 'vikings', 'iff'];

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('floorforge-theme') || 'dark',
  themes: THEMES,
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('floorforge-theme', theme);
    set({ theme });
  },
}));

export default useThemeStore;
