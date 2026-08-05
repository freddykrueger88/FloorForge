import { create } from 'zustand';

const THEMES = ['dark', 'light', 'vikings', 'iff'];

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('openfloorball-theme') || 'dark',
  themes: THEMES,
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('openfloorball-theme', theme);
    set({ theme });
  },
}));

export default useThemeStore;
