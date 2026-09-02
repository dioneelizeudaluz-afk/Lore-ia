import { create } from 'zustand';
import { ProjectInfo, ProjectFile } from '@/types/project';
import { GithubFile } from '@/types/github';

interface ProjectState {
  projectInfo: ProjectInfo | null;
  fileTree: GithubFile | null;
  openFiles: Map<string, ProjectFile>;
  activeFile: string | null;
  isAnalyzing: boolean;
  setProjectInfo: (info: ProjectInfo) => void;
  setFileTree: (tree: GithubFile) => void;
  setOpenFiles: (files: Map<string, ProjectFile>) => void;
  setActiveFile: (path: string | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectInfo: null,
  fileTree: null,
  openFiles: new Map(),
  activeFile: null,
  isAnalyzing: false,
  setProjectInfo: (info) => set({ projectInfo: info }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setOpenFiles: (files) => set({ openFiles: files }),
  setActiveFile: (path) => set({ activeFile: path }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));
