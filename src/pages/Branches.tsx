import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';

export const Branches: React.FC = () => {
  const [repo, setRepo] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadBranches = async () => {
    if (!repo.trim()) {
      setError('Digite o nome do repositório');
      return;
    }

    const token = localStorage.getItem('github_token');
    
    if (!token) {
      setError('Conecte seu GitHub primeiro');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/branches`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        setError('Repositório não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar branches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#8b5cf6', fontSize: '28px', marginBottom: '20px' }}>
          Branches
        </h1>

        <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '10px' }}>
            Digite o repositório (ex: usuario/repositorio)
          </p>
          <input
            type="text"
            placeholder="usuario/repositorio"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              border: '1px solid #8b5cf6',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              marginBottom: '10px',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={loadBranches}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#8b5cf6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Carregando...' : 'Ver Branches'}
          </button>
          {error && (
            <p style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px' }}>{error}</p>
          )}
        </div>

        {branches.length > 0 && (
          <div style={{ display: 'grid', gap: '10px' }}>
            {branches.map((branch) => (
              <div
                key={branch.name}
                style={{
                  background: '#131320',
                  border: '1px solid #2a2a3e',
                  borderRadius: '10px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <GitBranch size={18} color="#8b5cf6" style={{ marginRight: '10px' }} />
                <span style={{ color: 'white', fontSize: '16px' }}>{branch.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
