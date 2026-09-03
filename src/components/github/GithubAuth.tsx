import React, { useState } from 'react';
import { Github } from 'lucide-react';

export const GithubAuth: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTokenAuth = async () => {
    if (!tokenInput.trim()) {
      setError('Digite um token válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${tokenInput.trim()}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('github_token', tokenInput.trim());
        localStorage.setItem('github_user', JSON.stringify(user));
        window.location.href = '/';
      } else {
        setError('Token inválido ou expirado');
      }
    } catch (err) {
      setError('Erro ao conectar com GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0a0f',
      padding: '20px',
    }}>
      <div style={{
        background: '#131320',
        border: '1px solid #8b5cf6',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        <Github size={48} color="#8b5cf6" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ color: '#8b5cf6', fontSize: '28px', marginBottom: '10px' }}>
          LORE IA
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '30px' }}>
          Digite seu token do GitHub para começar
        </p>

        <input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxx"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
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
          onClick={handleTokenAuth}
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
            marginBottom: '15px',
          }}
        >
          {loading ? 'Autenticando...' : 'Autenticar'}
        </button>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '20px' }}>
          Token armazenado apenas no seu navegador
        </p>
      </div>
    </div>
  );
};
