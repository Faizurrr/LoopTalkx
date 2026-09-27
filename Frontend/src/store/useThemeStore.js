import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("LoopTalk-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("LoopTalk-theme", theme);
    set({ theme });
  },
}));