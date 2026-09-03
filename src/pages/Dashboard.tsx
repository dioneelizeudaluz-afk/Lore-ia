import React, { useState, useEffect } from 'react';
import { 
  Github, 
  FolderOpen, 
  GitCommit, 
  Zap, 
  ArrowRight, 
  FileCode, 
  Save, 
  X, 
  Check,
  Sparkles,
  Send,
  Bot,
  Loader2
} from 'lucide-react';

const FileEditor: React.FC<{
  filePath: string;
  fileName: string;
  content: string;
  repoName: string;
  branch: string;
  onClose: () => void;
  onSave: (path: string, content: string, message: string) => void;
}> = ({ filePath, fileName, content, repoName, branch, onClose, onSave }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [commitMessage, setCommitMessage] = useState(`update: ${fileName}`);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    setSaving(true);
    onSave(filePath, editedContent, commitMessage);
    setTimeout(() => {
      setSaving(false);
      setShowConfirm(false);
      onClose();
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#0a0a0f',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        background: '#131320',
        borderBottom: '1px solid #2a2a3e',
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <FileCode size={18} color="#8b5cf6" style={{ marginRight: '10px', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fileName}
            </p>
            <p style={{ color: '#6b7280', fontSize: '11px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {filePath}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 15px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Save size={14} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '6px',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '15px' }}>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            background: '#131320',
            border: '1px solid #2a2a3e',
            borderRadius: '8px',
            color: '#e5e7eb',
            fontSize: '14px',
            fontFamily: 'monospace',
            padding: '15px',
            boxSizing: 'border-box',
            resize: 'vertical',
            lineHeight: '1.5',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}
        />
      </div>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#131320',
            border: '1px solid #8b5cf6',
            borderRadius: '12px',
            padding: '25px',
            maxWidth: '400px',
            width: '100%',
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '15px' }}>
              Confirmar alterações
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>
              Arquivo: <span style={{ color: '#8b5cf6' }}>{filePath}</span>
            </p>
            <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Mensagem do commit
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                marginBottom: '20px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1a1a2e',
                  border: '1px solid #2a2a3e',
                  borderRadius: '6px',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {saving ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [showFiles, setShowFiles] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [editingFile, setEditingFile] = useState<{
    path: string;
    name: string;
    content: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o LORE IA. Posso analisar seu projeto e criar planos de alteração. O que deseja fazer?',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [modificationPlan, setModificationPlan] = useState<any>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [applyingChanges, setApplyingChanges] = useState(false);

  const [deployStatus, setDeployStatus] = useState<{
    step: string;
    status: 'pending' | 'loading' | 'success' | 'error';
    message: string;
  }[]>([
    { step: 'Alterações aplicadas', status: 'pending', message: '' },
    { step: 'Commit criado', status: 'pending', message: '' },
    { step: 'Push enviado para GitHub', status: 'pending', message: '' },
    { step: 'Deploy acionado', status: 'pending', message: '' },
  ]);
  const [showDeployProgress, setShowDeployProgress] = useState(false);
  const [commitMessageInput, setCommitMessageInput] = useState('');
  const [showCommitModal, setShowCommitModal] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    const savedUser = localStorage.getItem('github_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setConnected(true);
      loadRepositories(savedToken);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadRepositories = async (githubToken: string) => {
    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      }
    } catch (err) {
      console.error('Erro ao carregar repositórios:', err);
    }
  };

  const handleConnect = async () => {
    if (!token.trim()) {
      setError('Digite um token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token.trim()}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setConnected(true);
        localStorage.setItem('github_token', token.trim());
        localStorage.setItem('github_user', JSON.stringify(userData));
        
        await loadRepositories(token.trim());
      } else {
        setError('Token inválido ou expirado');
      }
    } catch (err) {
      setError('Erro ao conectar com GitHub');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setConnected(false);
    setUser(null);
    setRepos([]);
    setToken('');
    setSelectedRepo(null);
    setFileTree([]);
    setShowFiles(false);
    setEditingFile(null);
    setAiMessages([
      {
        role: 'assistant',
        content: 'Olá! Sou o LORE IA. Posso analisar seu projeto e criar planos de alteração. O que deseja fazer?',
      },
    ]);
    setAiOpen(false);
    setModificationPlan(null);
    setShowDiff(false);
    setShowDeployProgress(false);
    setShowCommitModal(false);
  };

    const openRepository = async (repo: any) => {
    setSelectedRepo(repo);
    setShowFiles(false);
    setFileTree([]);
    setAiOpen(false);
    setModificationPlan(null);
    setShowDiff(false);
    
    // Verificar e criar banco de dados automaticamente
    await ensureDatabaseFiles(repo);
  };

  const ensureDatabaseFiles = async (repo: any) => {
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return;

    const filesToCheck = [
      {
        path: 'src/services/database.ts',
        content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error('Erro ao buscar usuários:', error);
  return data || [];
}

export async function saveUser(user: any) {
  return await supabase.from('users').insert([user]);
}

export async function updateUser(id: number, updates: any) {
  return await supabase.from('users').update(updates).eq('id', id);
}

export async function deleteUser(id: number) {
  return await supabase.from('users').delete().eq('id', id);
}

export async function getProjects() {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) console.error('Erro ao buscar projetos:', error);
  return data || [];
}

export async function saveProject(project: any) {
  return await supabase.from('projects').insert([project]);
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) console.error('Erro ao buscar configurações:', error);
  return data || [];
}

export async function saveSettings(settings: any) {
  return await supabase.from('settings').insert([settings]);
}

export async function getCommits() {
  const { data, error } = await supabase.from('commits').select('*');
  if (error) console.error('Erro ao buscar commits:', error);
  return data || [];
}

export async function saveCommit(commit: any) {
  return await supabase.from('commits').insert([commit]);
}`,
      },
      {
        path: 'supabase/schema.sql',
        content: `-- Schema do banco de dados
-- Execute este arquivo no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  repo_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  ai_provider TEXT DEFAULT 'gemini',
  ai_model TEXT DEFAULT 'gemini-3.6-flash',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commits (
  id SERIAL PRIMARY KEY,
  project_name TEXT,
  message TEXT,
  sha TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`,
      },
    ];

    for (const file of filesToCheck) {
      try {
        // Verificar se o arquivo existe
        const checkResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/contents/${file.path}?ref=${repo.default_branch}`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (checkResponse.status === 404) {
          // Arquivo não existe, criar
          const createResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/contents/${file.path}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `feat: adicionar ${file.path}`,
                content: btoa(unescape(encodeURIComponent(file.content))),
                branch: repo.default_branch,
              }),
            }
          );
        }
      } catch (err) {
        console.log('Erro ao verificar arquivo:', file.path);
      }
    }
  };

  const loadFileTree = async () => {
    if (!selectedRepo) return;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return;

    setLoadingFiles(true);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/git/trees/${selectedRepo.default_branch}?recursive=1`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const files = data.tree.filter((item: any) => item.type === 'blob');
        setFileTree(files);
        setShowFiles(true);
      } else {
        showToast('Erro ao carregar arquivos', 'error');
      }
    } catch (err) {
      showToast('Erro ao carregar arquivos', 'error');
    } finally {
      setLoadingFiles(false);
    }
  };

  const openFile = async (filePath: string) => {
    if (!selectedRepo) return;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/contents/${filePath}?ref=${selectedRepo.default_branch}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content.replace(/\n/g, ''));
        const fileName = filePath.split('/').pop() || filePath;
        
        setEditingFile({
          path: filePath,
          name: fileName,
          content: content,
        });
      } else {
        showToast('Erro ao abrir arquivo', 'error');
      }
    } catch (err) {
      showToast('Erro ao abrir arquivo', 'error');
    }
  };

  const saveFile = async (filePath: string, content: string, message: string) => {
    if (!selectedRepo) return;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return;

    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/contents/${filePath}?ref=${selectedRepo.default_branch}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!getResponse.ok) {
        showToast('Erro ao obter arquivo atual', 'error');
        return;
      }

      const fileData = await getResponse.json();
      const sha = fileData.sha;

      const updateResponse = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            sha: sha,
            branch: selectedRepo.default_branch,
          }),
        }
      );

      if (updateResponse.ok) {
        showToast('Arquivo salvo com sucesso!', 'success');
      } else {
        const errorData = await updateResponse.json();
        showToast(`Erro ao salvar: ${errorData.message}`, 'error');
      }
    } catch (err) {
      showToast('Erro ao salvar arquivo', 'error');
    }
  };

  const analyzeProject = async () => {
    if (!selectedRepo) return null;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return null;

    try {
      const response = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoFullName: selectedRepo.full_name,
          branch: selectedRepo.default_branch,
          githubToken: githubToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.context;
      }
    } catch (err) {
      console.error('Erro ao analisar projeto:', err);
    }
    return null;
  };

  const sendAIMessage = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    
    const userMessage = aiPrompt.trim();
    setAiPrompt('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);
    setAiError('');

    try {
      const context = await analyzeProject();
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          context: context || { framework: 'unknown', structure: [] },
          conversation: aiMessages,
          mode: 'analyze',
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setAiError(data.error || 'Erro ao contactar AI Engine');
        setAiMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || 'Não foi possível contactar o AI Engine.' 
        }]);
      }
    } catch (err) {
      setAiError('Erro ao contactar AI Engine');
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Não foi possível contactar o AI Engine.' 
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const generateModification = async () => {
    if (!aiPrompt.trim() || aiLoading || !selectedRepo) return;
    
    const userMessage = aiPrompt.trim();
    setAiPrompt('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);
    setAiError('');

    try {
      const context = await analyzeProject();
      
      const githubToken = localStorage.getItem('github_token');
      const fileContents: Record<string, string> = {};
      
      if (context) {
        const filesToRead = [
          ...(context.pages || []).slice(0, 3),
          ...(context.components || []).slice(0, 5),
          ...(context.styles || []).slice(0, 3),
        ];

        for (const filePath of filesToRead) {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${selectedRepo.full_name}/contents/${filePath}?ref=${selectedRepo.default_branch}`,
              {
                headers: {
                  'Authorization': `token ${githubToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                },
              }
            );
            if (response.ok) {
              const data = await response.json();
              if (data.content) {
                fileContents[filePath] = atob(data.content.replace(/\n/g, ''));
              }
            }
          } catch (err) {
            // Skip file
          }
        }
      }

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          context: { ...(context || {}), fileContents },
          conversation: aiMessages,
          mode: 'modify',
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        try {
          let cleaned = data.response.trim();
          
          cleaned = cleaned.replace(/```json/gi, '');
          cleaned = cleaned.replace(/```/g, '');
          cleaned = cleaned.trim();
          
          const jsonStart = cleaned.indexOf('{');
          const jsonEnd = cleaned.lastIndexOf('}');
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
          }
          
          const parsed = JSON.parse(cleaned);
          
          if (parsed.files && Array.isArray(parsed.files) && parsed.files.length > 0) {
            setModificationPlan(parsed);
            setShowDiff(true);
            setAiMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `Plano gerado! ${parsed.summary || ''}\n\n${parsed.files.length} arquivo(s) serão alterados. Revise o Diff.` 
            }]);
          } else {
            setAiMessages(prev => [...prev, { 
              role: 'assistant', 
              content: 'A IA respondeu mas não consegui identificar as alterações. Tente ser mais específico no pedido.' 
            }]);
          }
        } catch (parseErr) {
          console.error('Parse error:', parseErr);
          setAiMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Erro ao processar resposta da IA. Tente novamente com um pedido mais específico.' 
          }]);
        }
      } else {
        setAiError(data.error || 'Erro ao contactar AI Engine');
      }
    } catch (err) {
      setAiError('Erro ao gerar alterações');
    } finally {
      setAiLoading(false);
    }
  };

  const generateCommitMessage = (plan: any): string => {
    if (!plan) return 'Update project files';
    
    const summary = plan.summary || '';
    
    if (summary.toLowerCase().includes('fix') || summary.toLowerCase().includes('corrig')) {
      return `fix: ${summary}`;
    }
    if (summary.toLowerCase().includes('add') || summary.toLowerCase().includes('criar')) {
      return `feat: ${summary}`;
    }
    if (summary.toLowerCase().includes('update') || summary.toLowerCase().includes('atualizar')) {
      return `update: ${summary}`;
    }
    if (summary.toLowerCase().includes('remove') || summary.toLowerCase().includes('remover')) {
      return `remove: ${summary}`;
    }
    
    return `update: ${summary || 'project files'}`;
  };

  const commitAndPush = async () => {
    if (!modificationPlan || !selectedRepo || applyingChanges) return;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) {
      showToast('GitHub não conectado', 'error');
      return;
    }

    setCommitMessageInput(generateCommitMessage(modificationPlan));
    setShowCommitModal(true);
  };

  const confirmCommitAndPush = async () => {
    if (!modificationPlan || !selectedRepo) return;
    
    const githubToken = localStorage.getItem('github_token');
    if (!githubToken) return;

    setShowCommitModal(false);
    setShowDeployProgress(true);
    setApplyingChanges(true);

    setDeployStatus([
      { step: 'Alterações aplicadas', status: 'loading', message: 'Aplicando alterações...' },
      { step: 'Commit criado', status: 'pending', message: '' },
      { step: 'Push enviado para GitHub', status: 'pending', message: '' },
      { step: 'Deploy acionado', status: 'pending', message: '' },
    ]);

    try {
      const changes = modificationPlan.files.map((file: any) => ({
        path: file.path,
        content: file.newContent || '',
        action: file.action,
      }));

      const commitResponse = await fetch('/api/github/commit-and-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoFullName: selectedRepo.full_name,
          branch: selectedRepo.default_branch,
          githubToken: githubToken,
          message: commitMessageInput || generateCommitMessage(modificationPlan),
          changes: changes,
        }),
      });

      const commitData = await commitResponse.json();

      if (!commitResponse.ok) {
        setDeployStatus(prev => prev.map((s, i) => 
          i === 0 ? { ...s, status: 'error', message: commitData.error || 'Erro ao aplicar alterações' } : s
        ));
        showToast(commitData.error || 'Erro ao aplicar alterações', 'error');
        return;
      }

      setDeployStatus(prev => prev.map((s, i) => 
        i === 0 ? { ...s, status: 'success', message: 'Alterações aplicadas com sucesso' } :
        i === 1 ? { ...s, status: 'success', message: `Commit: ${commitData.commitSha?.substring(0, 7) || 'criado'}` } :
        i === 2 ? { ...s, status: 'success', message: 'Push enviado para GitHub' } :
        i === 3 ? { ...s, status: 'loading', message: 'Aguardando deploy automático...' } : s
      ));

      const checkResponse = await fetch('/api/github/check-deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoFullName: selectedRepo.full_name,
          githubToken: githubToken,
        }),
      });

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.success) {
        setDeployStatus(prev => prev.map((s, i) => 
          i === 3 ? { ...s, status: 'success', message: 'Deploy acionado. O serviço de deploy conectado ao GitHub vai publicar automaticamente.' } : s
        ));
        showToast('Push enviado. Deploy automático acionado!', 'success');
      } else {
        setDeployStatus(prev => prev.map((s, i) => 
          i === 3 ? { ...s, status: 'success', message: 'Push confirmado. Deploy será acionado pelo GitHub.' } : s
        ));
        showToast('Push enviado. Deploy será acionado pelo GitHub.', 'success');
      }

      if (showFiles) {
        await loadFileTree();
      }
    } catch (err) {
      console.error('Erro no commit e push:', err);
      setDeployStatus(prev => prev.map((s, i) => 
        s.status === 'loading' ? { ...s, status: 'error', message: 'Erro na operação' } : s
      ));
      showToast('Erro ao fazer commit e push', 'error');
    } finally {
      setApplyingChanges(false);
      setModificationPlan(null);
      setShowDiff(false);
    }
  };

  const renderDiff = () => {
    if (!modificationPlan || !showDiff) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
      }}>
        <div style={{
          background: '#131320',
          border: '1px solid #8b5cf6',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #2a2a3e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ color: 'white', fontSize: '16px', margin: 0 }}>
              Diff - {modificationPlan.summary || 'Alterações'}
            </h3>
            <button
              onClick={() => {
                setShowDiff(false);
                setModificationPlan(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {modificationPlan.files.map((file: any, index: number) => (
              <div key={index} style={{
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginRight: '8px',
                    background: file.action === 'create' ? '#10b981' : file.action === 'delete' ? '#ef4444' : '#8b5cf6',
                    color: 'white',
                  }}>
                    {file.action === 'create' ? 'NOVO' : file.action === 'delete' ? 'EXCLUIR' : 'MODIFICAR'}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.path}
                  </span>
                </div>

                {file.action === 'delete' && (
                  <p style={{ color: '#ef4444', fontSize: '13px', margin: '10px 0' }}>
                    ⚠️ Esta alteração irá excluir este arquivo permanentemente!
                  </p>
                )}

                {file.action !== 'delete' && (
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {file.originalContent && file.originalContent !== file.newContent && (
                      <div style={{ marginBottom: '8px' }}>
                        <p style={{ color: '#ef4444', margin: '0 0 5px' }}>--- Antes:</p>
                        <pre style={{
                          background: '#0a0a0f',
                          padding: '8px',
                          borderRadius: '4px',
                          color: '#ef4444',
                          margin: 0,
                          maxHeight: '150px',
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}>
                          {file.originalContent?.substring(0, 500)}
                          {(file.originalContent?.length || 0) > 500 ? '...' : ''}
                        </pre>
                      </div>
                    )}
                    <div>
                      <p style={{ color: '#10b981', margin: '0 0 5px' }}>+++ Depois:</p>
                      <pre style={{
                        background: '#0a0a0f',
                        padding: '8px',
                        borderRadius: '4px',
                        color: '#10b981',
                        margin: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}>
                        {file.newContent?.substring(0, 500)}
                        {(file.newContent?.length || 0) > 500 ? '...' : ''}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            padding: '15px',
            borderTop: '1px solid #2a2a3e',
            display: 'flex',
            gap: '10px',
          }}>
            <button
              onClick={() => {
                setShowDiff(false);
                setModificationPlan(null);
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              CANCELAR
            </button>
            <button
              onClick={commitAndPush}
              disabled={applyingChanges}
              style={{
                flex: 1,
                padding: '12px',
                background: applyingChanges ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: applyingChanges ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {applyingChanges ? 'APLICANDO...' : 'APLICAR ALTERAÇÕES'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCommitModal = () => {
    if (!showCommitModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: '#131320',
          border: '1px solid #8b5cf6',
          borderRadius: '12px',
          padding: '25px',
          maxWidth: '450px',
          width: '100%',
        }}>
          <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '15px' }}>
            Commit e Push
          </h3>
          
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>
            {modificationPlan?.files?.length || 0} arquivo(s) serão enviados para:
          </p>
          
          <p style={{ color: '#8b5cf6', fontSize: '14px', marginBottom: '15px' }}>
            {selectedRepo?.full_name} ({selectedRepo?.default_branch})
          </p>

          <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Mensagem do commit
          </label>
          <input
            type="text"
            value={commitMessageInput}
            onChange={(e) => setCommitMessageInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              marginBottom: '20px',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowCommitModal(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmCommitAndPush}
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              COMMIT E PUSH
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeployProgress = () => {
    if (!showDeployProgress) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.9)',
        zIndex: 2600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: '#131320',
          border: '1px solid #8b5cf6',
          borderRadius: '12px',
          padding: '25px',
          maxWidth: '450px',
          width: '100%',
        }}>
          <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>
            Publicando Alterações
          </h3>

          <div>
            {deployStatus.map((step, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '10px',
                background: '#1a1a2e',
                borderRadius: '8px',
                border: '1px solid #2a2a3e',
              }}>
                {step.status === 'success' && (
                  <span style={{ color: '#10b981', fontSize: '20px', marginRight: '10px' }}>✓</span>
                )}
                {step.status === 'error' && (
                  <span style={{ color: '#ef4444', fontSize: '20px', marginRight: '10px' }}>✗</span>
                )}
                {step.status === 'loading' && (
                  <Loader2 size={20} color="#8b5cf6" style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />
                )}
                {step.status === 'pending' && (
                  <span style={{ color: '#4b5563', fontSize: '20px', marginRight: '10px' }}>○</span>
                )}
                <div>
                  <p style={{ 
                    color: step.status === 'success' ? '#10b981' : step.status === 'error' ? '#ef4444' : '#9ca3af',
                    fontSize: '14px',
                    margin: 0,
                    fontWeight: 'bold',
                  }}>
                    {step.step}
                  </p>
                  {step.message && (
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '5px 0 0' }}>
                      {step.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowDeployProgress(false)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px',
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '20px' }}>
        Dashboard
      </h1>

      {!connected ? (
        <div style={{ 
          background: '#131320', 
          border: '1px solid #8b5cf6', 
          borderRadius: '12px', 
          padding: '30px', 
          textAlign: 'center',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          <Github size={48} color="#8b5cf6" style={{ marginBottom: '20px' }} />
          <h2 style={{ color: 'white', marginBottom: '10px', fontSize: '20px' }}>
            Conectar GitHub
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>
            Digite seu Personal Access Token
          </p>
          
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #8b5cf6',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              marginBottom: '15px',
              boxSizing: 'border-box',
            }}
          />
          
          <button
            onClick={handleConnect}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Conectando...' : 'Conectar'}
          </button>

          {error && (
            <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px' }}>{error}</p>
          )}

          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '20px' }}>
            Crie seu token em: github.com/settings/tokens
          </p>
        </div>
      ) : selectedRepo ? (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            <button
              onClick={() => {
                setSelectedRepo(null);
                setShowFiles(false);
                setAiOpen(false);
                setModificationPlan(null);
                setShowDiff(false);
              }}
              style={{
                padding: '8px 16px',
                background: '#131320',
                border: '1px solid #2a2a3e',
                borderRadius: '6px',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
              Voltar
            </button>

            <button
              onClick={() => setAiOpen(!aiOpen)}
              style={{
                padding: '8px 16px',
                background: aiOpen ? '#8b5cf6' : '#131320',
                border: '1px solid #8b5cf6',
                borderRadius: '6px',
                color: aiOpen ? 'white' : '#8b5cf6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <Sparkles size={16} />
              AI Assistant
            </button>
          </div>

          {aiOpen && (
            <div style={{
              background: '#131320',
              border: '1px solid #8b5cf6',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '15px',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '15px',
                borderBottom: '1px solid #2a2a3e',
                paddingBottom: '10px',
              }}>
                <Bot size={20} color="#8b5cf6" style={{ marginRight: '10px' }} />
                <h3 style={{ color: '#8b5cf6', fontSize: '16px', margin: 0 }}>
                  LORE IA Assistant
                </h3>
              </div>

              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                marginBottom: '15px',
              }}>
                {aiMessages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      background: msg.role === 'user' ? '#8b5cf6' : '#1a1a2e',
                      border: '1px solid ' + (msg.role === 'user' ? '#8b5cf6' : '#2a2a3e'),
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <p style={{
                        color: 'white',
                        fontSize: '13px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.5',
                      }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                
                {aiLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                    <div style={{
                      background: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Loader2 size={16} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
                      <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                        LORE IA está analisando o projeto...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendAIMessage();
                    }
                  }}
                  placeholder="Descreva o que você quer analisar ou alterar..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#1a1a2e',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={sendAIMessage}
                  disabled={aiLoading || !aiPrompt.trim()}
                  style={{
                    padding: '12px 15px',
                    background: aiLoading || !aiPrompt.trim() ? '#4b5563' : '#1a1a2e',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: aiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={16} />
                </button>
              </div>

              <button
                onClick={generateModification}
                disabled={aiLoading || !aiPrompt.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: aiLoading || !aiPrompt.trim() ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: aiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {aiLoading ? 'GERANDO...' : 'GERAR ALTERAÇÕES'}
              </button>

              {aiError && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '10px' }}>
                  {aiError}
                </p>
              )}
            </div>
          )}

          <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <Github size={28} color="#8b5cf6" style={{ marginRight: '12px' }} />
              <div>
                <h2 style={{ color: 'white', fontSize: '20px', margin: 0 }}>{selectedRepo.name}</h2>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>{selectedRepo.full_name}</p>
              </div>
            </div>

            {!showFiles ? (
              <button
                onClick={loadFileTree}
                disabled={loadingFiles}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {loadingFiles ? 'Carregando...' : 'Ver Arquivos do Projeto'}
              </button>
            ) : (
              <div>
                <h3 style={{ color: 'white', fontSize: '16px', marginBottom: '15px' }}>
                  Arquivos ({fileTree.length})
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {fileTree.slice(0, 100).map((file: any) => (
                    <button
                      key={file.path}
                      onClick={() => openFile(file.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #1a1a2e',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <FileCode size={14} color="#8b5cf6" style={{ marginRight: '10px', flexShrink: 0 }} />
                      <span style={{ color: '#9ca3af', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.path}
                      </span>
                    </button>
                  ))}
                  {fileTree.length > 100 && (
                    <p style={{ color: '#6b7280', fontSize: '13px', padding: '10px', textAlign: 'center' }}>
                      ... e mais {fileTree.length - 100} arquivos
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px',
            background: '#131320',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #2a2a3e',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                Bem-vindo, {user?.login}
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                {repos.length} repositórios encontrados
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Sair
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '15px' }}>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '15px' }}>
              <FolderOpen size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
              <h3 style={{ color: 'white', fontSize: '22px', margin: '0 0 5px' }}>{repos.length}</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Projetos</p>
            </div>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '15px' }}>
              <GitCommit size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
              <h3 style={{ color: 'white', fontSize: '22px', margin: '0 0 5px' }}>0</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Commits</p>
            </div>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '15px' }}>
              <Zap size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
              <h3 style={{ color: 'white', fontSize: '22px', margin: '0 0 5px' }}>0</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Alterações IA</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {repos.map((repo) => (
              <div
                key={repo.id}
                style={{
                  background: '#131320',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => openRepository(repo)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    <Github size={18} color="#8b5cf6" style={{ marginRight: '10px', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ color: 'white', fontSize: '16px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {repo.name}
                      </h3>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {repo.description || 'Sem descrição'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    {repo.language || 'Unknown'}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    {new Date(repo.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingFile && (
        <FileEditor
          filePath={editingFile.path}
          fileName={editingFile.name}
          content={editingFile.content}
          repoName={selectedRepo?.name || ''}
          branch={selectedRepo?.default_branch || 'main'}
          onClose={() => setEditingFile(null)}
          onSave={saveFile}
        />
      )}

      {renderDiff()}
      {renderCommitModal()}
      {renderDeployProgress()}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};
