import React, { useState } from 'react';
import { Github, FolderOpen, GitCommit, Zap, Key, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<any>(null);

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
        
        const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
          headers: {
            'Authorization': `token ${token.trim()}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } else {
        setError('Token inválido');
      }
    } catch (err) {
      setError('Erro ao conectar');
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
  };

  return (
    <div>
      <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '20px' }}>
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
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            background: '#131320',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #2a2a3e',
          }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '18px' }}>
                Bem-vindo, {user?.login}
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
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

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '20px' }}>
              <FolderOpen size={24} color="#8b5cf6" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '5px' }}>{repos.length}</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Projetos</p>
            </div>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '20px' }}>
              <GitCommit size={24} color="#8b5cf6" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '5px' }}>0</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Commits</p>
            </div>
            <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '20px' }}>
              <Zap size={24} color="#8b5cf6" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '5px' }}>0</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Alterações IA</p>
            </div>
          </div>

          {/* Repositories */}
          <div style={{ display: 'grid', gap: '15px' }}>
            {repos.map((repo) => (
              <div
                key={repo.id}
                style={{
                  background: '#131320',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a3e';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Github size={18} color="#8b5cf6" style={{ marginRight: '10px' }} />
                  <h3 style={{ color: 'white', fontSize: '18px' }}>{repo.name}</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '10px' }}>
                  {repo.description || 'Sem descrição'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
    </div>
  );
};
