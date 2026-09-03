import React, { useState, useEffect } from 'react';
import { Github, FolderOpen } from 'lucide-react';

export const Projects: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
      setError('Conecte seu GitHub primeiro');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      } else {
        setError('Erro ao carregar repositórios');
      }
    } catch (err) {
      setError('Erro ao conectar com GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#8b5cf6', fontSize: '28px', marginBottom: '20px' }}>
          Projetos
        </h1>

        {loading ? (
          <p style={{ color: '#9ca3af' }}>Carregando...</p>
        ) : error ? (
          <div style={{ background: '#131320', border: '1px solid #ef4444', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</p>
            <a href="/" style={{ color: '#8b5cf6' }}>Voltar ao Dashboard</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {repos.map((repo) => (
              <div
                key={repo.id}
                style={{
                  background: '#131320',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Github size={20} color="#8b5cf6" style={{ marginRight: '10px' }} />
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
        )}
      </div>
    </div>
  );
};
