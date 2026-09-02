import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FolderOpen,
  Code,
  Sparkles,
  GitCompare,
  GitCommit,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { RepoSelector } from '@/components/github/RepoSelector';
import { FileTree } from '@/components/github/FileTree';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { PromptInput } from '@/components/ai/PromptInput';
import { AIResponse } from '@/components/ai/AIResponse';
import { AnalysisProgress } from '@/components/ai/AnalysisProgress';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { CommitModal } from '@/components/github/CommitModal';
import { useAppStore } from '@/stores/appStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUIStore } from '@/stores/uiStore';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { githubService } from '@/services/github/githubService';
import { projectAnalyzer } from '@/features/project/projectAnalyzer';
import { diffEngine } from '@/features/diff/diffEngine';
import { aiEngine } from '@/features/ai/aiEngine';
import { Message, AIContext } from '@/types/ai';
import { FileChange } from '@/types';
import { GithubRepo } from '@/types/github';

export const ProjectView: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const isMobile = useIsMobile();
  const { selectedRepo, selectedBranch, setSelectedRepo } = useAppStore();
  const {
    projectInfo,
    fileTree,
    activeFile,
    openFiles,
    isAnalyzing,
    setProjectInfo,
    setFileTree,
    setActiveFile,
    setOpenFiles,
    setIsAnalyzing,
  } = useProjectStore();
  const { mobileView, setMobileView, diffPanelOpen, setDiffPanelOpen } = useUIStore();

  const [fileContent, setFileContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [changes, setChanges] = useState<FileChange[]>([]);
  const [diffs, setDiffs] = useState<Map<string, any>>(new Map());
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingTree, setLoadingTree] = useState(false);

  const loadProject = useCallback(async (repo: GithubRepo) => {
    if (!repo) return;

    setLoadingTree(true);
    setIsAnalyzing(true);
    try {
      const [owner, repoName] = repo.fullName.split('/');
      
      // Carregar árvore de arquivos
      const tree = await githubService.getFileTree(owner, repoName, selectedBranch);
      setFileTree(tree);

      // Analisar projeto
      const info = projectAnalyzer.analyzeProject(tree, repoName);
      setProjectInfo(info);
      
      setToast({
        message: 'Projeto carregado com sucesso',
        type: 'success',
      });
    } catch (err) {
      console.error('Erro ao carregar projeto:', err);
      setToast({
        message: 'Erro ao carregar projeto',
        type: 'error',
      });
    } finally {
      setLoadingTree(false);
      setIsAnalyzing(false);
    }
  }, [selectedBranch, setFileTree, setProjectInfo, setIsAnalyzing]);

  useEffect(() => {
    if (selectedRepo && repoId === String(selectedRepo.id)) {
      loadProject(selectedRepo);
    }
  }, [selectedRepo, repoId, loadProject]);

  const handleFileSelect = async (path: string) => {
    if (!selectedRepo) return;

    setLoadingFile(true);
    setActiveFile(path);
    
    try {
      const [owner, repoName] = selectedRepo.fullName.split('/');
      const content = await githubService.getFileContent(owner, repoName, path, selectedBranch);
      setFileContent(content);
      
      // Atualizar arquivos abertos
      const newOpenFiles = new Map(openFiles);
      newOpenFiles.set(path, {
        path,
        name: path.split('/').pop() || path,
        extension: path.split('.').pop() || '',
        size: content.length,
        content,
      });
      setOpenFiles(newOpenFiles);
    } catch (err) {
      console.error('Erro ao carregar arquivo:', err);
      setToast({
        message: 'Erro ao carregar arquivo',
        type: 'error',
      });
    } finally {
      setLoadingFile(false);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!projectInfo) return;

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      // Analisar prompt e gerar modificações
      const context
        );
};
