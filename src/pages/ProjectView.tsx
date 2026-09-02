import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FolderOpen,
  Code,
  Sparkles,
  GitCompare,
  GitCommit,
  RefreshCw,
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
      
      const tree = await githubService.getFileTree(owner, repoName, selectedBranch);
      setFileTree(tree);

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
      const context: AIContext = {
        projectInfo,
        conversation: messages,
        relevantFiles: [],
      };

      const response = await aiEngine.generateModification(prompt, context);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.explanation,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      const fileChanges: FileChange[] = response.modifications.map(mod => ({
        path: mod.path,
        content: mod.newContent || '',
        originalContent: fileContent,
        status: mod.action === 'create' ? 'added' : mod.action === 'delete' ? 'deleted' : 'modified',
      }));

      setChanges(fileChanges);
      const newDiffs = diffEngine.compareFiles(fileChanges);
      setDiffs(newDiffs);
      setDiffPanelOpen(true);
      
      if (isMobile) {
        setMobileView('diff');
      }
    } catch (err) {
      console.error('Erro ao processar prompt:', err);
      setToast({
        message: 'Erro ao processar solicitação',
        type: 'error',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!selectedRepo || changes.length === 0) return;

    setShowCommitModal(true);
    setDiffPanelOpen(false);
  };

  const handleCommit = async (message: string) => {
    if (!selectedRepo) return;

    setCommitLoading(true);
    try {
      const [owner, repoName] = selectedRepo.fullName.split('/');
      
      const commitChanges = changes.map(change => ({
        path: change.path,
        content: change.content,
        mode: change.status === 'added' ? 'create' as const : 
              change.status === 'deleted' ? 'delete' as const : 'update' as const,
      }));

      const commitSha = await githubService.createCommit(
        owner,
        repoName,
        selectedBranch,
        message,
        commitChanges
      );

      setToast({
        message: `Commit criado: ${commitSha.substring(0, 7)}`,
        type: 'success',
      });

      await loadProject(selectedRepo);
      setChanges([]);
      setDiffs(new Map());
    } catch (err) {
      console.error('Erro ao criar commit:', err);
      setToast({
        message: 'Erro ao criar commit',
        type: 'error',
      });
    } finally {
      setCommitLoading(false);
      setShowCommitModal(false);
    }
  };

  const handleEditorChange = (value: string) => {
    setFileContent(value);
    
    if (activeFile) {
      const newOpenFiles = new Map(openFiles);
      const file = newOpenFiles.get(activeFile);
      if (file) {
        file.content = value;
        newOpenFiles.set(activeFile, file);
        setOpenFiles(newOpenFiles);
      }
    }
  };

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <RepoSelector onSelectRepo={setSelectedRepo} />
      </div>
    );
  }

  if (loadingTree) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-400">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 bg-lore-dark border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <FolderOpen className="w-5 h-5 text-lore-purple" />
          <h2 className="font-semibold">{selectedRepo.name}</h2>
          <span className="text-sm text-gray-500">{selectedBranch}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() => loadProject(selectedRepo)}
            title="Recarregar projeto"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={GitCommit}
            onClick={() => setShowCommitModal(true)}
            title="Ver commits"
          />
        </div>
      </div>

      {isMobile ? (
        <div className="flex-1 overflow-hidden">
          {mobileView === 'files' && (
            <div className="h-full overflow-y-auto">
              <FileTree
                tree={fileTree}
                activeFile={activeFile}
                onFileSelect={handleFileSelect}
              />
            </div>
          )}
          {mobileView === 'editor' && (
            <div className="h-full flex flex-col">
              {activeFile ? (
                <>
                  <div className="h-10 bg-lore-dark border-b border-white/10 flex items-center px-3">
                    <Code className="w-4 h-4 text-lore-purple mr-2" />
                    <span className="text-sm truncate">{activeFile}</span>
                  </div>
                  <div className="flex-1">
                    {loadingFile ? (
                      <div className="h-full flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      <CodeEditor
                        filename={activeFile}
                        content={fileContent}
                        onChange={handleEditorChange}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Selecione um arquivo para editar
                </div>
              )}
            </div>
          )}
          {mobileView === 'ai' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                <AIResponse messages={messages} loading={isAnalyzing} />
                <AnalysisProgress isAnalyzing={isAnalyzing} />
              </div>
              <PromptInput
                onSubmit={handlePromptSubmit}
                loading={isAnalyzing}
                disabled={!projectInfo}
              />
            </div>
          )}
          {mobileView === 'diff' && diffPanelOpen && (
            <div className="h-full">
              <DiffViewer
                diffs={diffs}
                onApply={handleApplyChanges}
                onCancel={() => setDiffPanelOpen(false)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-white/10 overflow-y-auto">
            <div className="p-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-gray-400">Arquivos</h3>
            </div>
            <FileTree
              tree={fileTree}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
            />
          </div>

          <div className="flex-1 flex flex-col">
            {activeFile ? (
              <>
                <div className="h-10 bg-lore-dark border-b border-white/10 flex items-center px-3">
                  <Code className="w-4 h-4 text-lore-purple mr-2" />
                  <span className="text-sm truncate">{activeFile}</span>
                </div>
                <div className="flex-1">
                  {loadingFile ? (
                    <div className="h-full flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <CodeEditor
                      filename={activeFile}
                      content={fileContent}
                      onChange={handleEditorChange}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Selecione um arquivo para editar
              </div>
            )}
          </div>

          <div className="w-96 border-l border-white/10 flex flex-col">
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 flex items-center">
                  <Sparkles className="w-4 h-4 text-lore-purple mr-2" />
                  LORE IA
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={GitCompare}
                  onClick={() => setDiffPanelOpen(!diffPanelOpen)}
                  title="Ver alterações"
                />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {diffPanelOpen ? (
                <DiffViewer
                  diffs={diffs}
                  onApply={handleApplyChanges}
                  onCancel={() => setDiffPanelOpen(false)}
                />
              ) : (
                <>
                  <AIResponse messages={messages} loading={isAnalyzing} />
                  <AnalysisProgress isAnalyzing={isAnalyzing} />
                </>
              )}
            </div>
            {!diffPanelOpen && (
              <PromptInput
                onSubmit={handlePromptSubmit}
                loading={isAnalyzing}
                disabled={!projectInfo}
              />
            )}
          </div>
        </div>
      )}

      <CommitModal
        isOpen={showCommitModal}
        onClose={() => setShowCommitModal(false)}
        onCommit={handleCommit}
        files={changes}
        loading={commitLoading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
