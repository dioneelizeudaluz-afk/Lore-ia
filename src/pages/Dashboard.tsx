import React, { useState, useEffect } from 'react';
import { Github, FolderOpen, GitCommit, Zap, ArrowRight, FileCode, Save, X, Check } from 'lucide-react';

// Componente do Editor de Arquivos
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

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'kt': 'kotlin',
      'sql': 'sql',
      'sh': 'shell',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'svg': 'xml',
    };
    return langMap[ext || ''] || 'plaintext';
  };

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
      {/* Header */}
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

      {/* Editor */}
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

      {/* Modal de Confirmação */}
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
  };

  const openRepository = (repo: any) => {
    setSelectedRepo(repo);
    setShowFiles(false);
    setFileTree([]);
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
      // Get current file SHA
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

      // Update file
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
          <button
            onClick={() => {
              setSelectedRepo(null);
              setShowFiles(false);
            }}
            style={{
              padding: '8px 16px',
              background: '#131320',
              border: '1px solid #2a2a3e',
              borderRadius: '6px',
              color: '#9ca3af',
              cursor: 'pointer',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
            }}
          >
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Voltar
          </button>

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
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
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

      {/* Editor de Arquivos */}
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

      {/* Toast */}
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
