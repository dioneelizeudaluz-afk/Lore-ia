import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  diffPanelOpen: boolean;
  mobileView: 'files' | 'editor' | 'ai' | 'diff';
  setSidebarOpen: (open: boolean) => void;
  setAiPanelOpen: (open: boolean) => void;
  setDiffPanelOpen: (open: boolean) => void;
  setMobileView: (view: 'files' | 'editor' | 'ai' | 'diff') => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  aiPanelOpen: true,
  diffPanelOpen: false,
  mobileView: 'editor',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  setDiffPanelOpen: (open) => set({ diffPanelOpen: open }),
  setMobileView: (view) => set({ mobileView: view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
}));
