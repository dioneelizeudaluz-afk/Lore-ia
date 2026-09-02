import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GithubUser, GithubRepo } from '@/types/github';

interface AppState {
  user: GithubUser | null;
  token: string | null;
  selectedRepo: GithubRepo | null;
  selectedBranch: string;
  setUser: (user: GithubUser | null) => void;
  setToken: (token: string | null) => void;
  setSelectedRepo: (repo: GithubRepo | null) => void;
  setSelectedBranch: (branch: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      selectedRepo: null,
      selectedBranch: 'main',
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setSelectedRepo: (repo) => set({ selectedRepo: repo }),
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      logout: () => set({ user: null, token: null, selectedRepo: null }),
    }),
    {
      name: 'lore-ia-storage',
    }
  )
);
