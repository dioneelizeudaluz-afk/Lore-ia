import React, { useState, useEffect } from 'react';
import { GitCommit, Clock, User } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCommits();
  }, []);

  const loadCommits = async () => {
    const token = localStorage.getItem('github_token');
    const savedRepo = localStorage.getItem('selected_repo');

    if (!token) {
      setError('Conecte seu GitHub primeiro');
      setLoading(false);
      return;
    }

    try {
      // Get user repos first
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const user = await userResponse.json();
      const username = user.login;

      // Get first repo
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const repos = await reposResponse.json();
      
      let allCommits: any[] = [];
      
      for (const repo of repos) {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=10`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (commitsResponse.ok) {
          const repoCommits = await commitsResponse.json();
          repoCommits.forEach((commit: any) => {
            allCommits.push({
              ...commit,
              repoName: repo.name,
            });
          });
        }
      }

      // Sort by date
      allCommits.sort((a, b) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
      );

      setCommits(allCommits.slice(0, 50));
    } catch (err) {
      setError('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '20px' }}>
        Histórico de Commits
      </h1>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
          Carregando...
        </p>
      ) : error ? (
        <div style={{ background: '#131320', border: '1px solid #ef4444', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>
        </div>
      ) : commits.length === 0 ? (
        <div style={{ background: '#131320', border: '1px solid #2a2a3e', borderRadius: '10px', padding: '30px', textAlign: 'center' }}>
          <GitCommit size={40} color="#8b5cf6" style={{ marginBottom: '15px' }} />
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Nenhum commit encontrado
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {commits.map((commit, index) => (
            <div
              key={index}
              style={{
                background: '#131320',
                border: '1px solid #2a2a3e',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <GitCommit size={18} color="#8b5cf6" style={{ marginRight: '10px' }} />
                <span style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}>
                  {commit.repoName}
                </span>
              </div>
              <p style={{ color: 'white', fontSize: '14px', marginBottom: '10px' }}>
                {commit.commit?.message || 'Sem mensagem'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                  <User size={12} style={{ marginRight: '5px' }} />
                  {commit.commit?.author?.name || 'Unknown'}
                </span>
                <span style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                  <Clock size={12} style={{ marginRight: '5px' }} />
                  {new Date(commit.commit?.author?.date || '').toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
