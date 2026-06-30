"use client";

import { create } from "zustand";

function cleanPath(path) {
  if (!path) return "";
  return path.split("?")[0].split("#")[0].replace(/\/$/, "");
}

export const useNavHistory = create((set, get) => ({
  history: [],
  root: "Dashboard",
  labels: {},

  reset: () => set({ history: [], labels: {} }),

  setRoot: (name) => set({ root: name }),

  setLabel: (id, name) =>
    set((state) => ({   
      labels: { ...state.labels, [id]: name },
    })),

  addPage: (path) => {
    const clean = cleanPath(path);
    if (!clean) return;

    const history = get().history;
    if (history[history.length - 1] === clean) return;

    set({ history: [...history, clean] });
  },

  goBackTo: (path) => {
    const clean = cleanPath(path);
    const history = get().history;
    const i = history.indexOf(clean);
    if (i !== -1) {
      set({ history: history.slice(0, i + 1) });
    }
  },
}));
