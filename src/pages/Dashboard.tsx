import React, { useState, useEffect } from 'react';

export const Dashboard: React.FC = () => {
  const [token, setToken] = useState('');
  const [repos, setRepos] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setToken(savedToken);
      setConnected(true);
      loadRepos(savedToken);
    }
  }, []);

  const loadRepos = async (tk: string) => {
    const res = await fetch('https://api.github.com/user/repos', {
      headers: { 'Authorization': `token ${tk}` },
    });
    const data = await res.json();
    setRepos(data);
  };

  const connect = async () => {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}` },
    });
    if (res.ok) {
      localStorage.setItem('github_token', token);
      setConnected(true);
      loadRepos(token);
    } else {
      alert('Token inválido');
    }
  };

  const openRepo = async (repo: any) => {
    setSelectedRepo(repo);
    const res = await fetch(`https://api.github.com/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`, {
      headers: { 'Authorization': `token ${token}` },
    });
    const data = await res.json();
    const fileList = data.tree.filter((item: any) => item.type === 'blob');
    setFiles(fileList);
  };

  const openFile = async (path: string) => {
    const res = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/contents/${path}`, {
      headers: { 'Authorization': `token ${token}` },
    });
    const data = await res.json();
    const fileContent = atob(data.content.replace(/\n/g, ''));
    setEditingFile(path);
    setContent(fileContent);
    setMessage(`update: ${path}`);
  };

  const saveFile = async () => {
    const getRes = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/contents/${editingFile}`, {
      headers: { 'Authorization': `token ${token}` },
    });
    const getData = await getRes.json();
    const sha = getData.sha;

    const updateRes = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/contents/${editingFile}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        content: btoa(unescape(encodeURIComponent(content))),
        sha: sha,
      }),
    });

    if (updateRes.ok) {
      alert('Arquivo salvo com sucesso!');
      setEditingFile(null);
    } else {
      const err = await updateRes.json();
      alert('Erro: ' + err.message);
    }
  };

  if (!connected) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#8b5cf6' }}>LORE IA</h1>
        <p style={{ color: '#9ca3af' }}>Digite seu token do GitHub</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_..."
          style={{ width: '100%', maxWidth: '400px', padding: '12px', marginBottom: '10px', background: '#1a1a2e', border: '1px solid #8b5cf6', borderRadius: '8px', color: 'white' }}
        />
        <br />
        <button
          onClick={connect}
          style={{ padding: '12px 30px', background: '#8b5cf6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: 'bold' }}
        >
          Conectar
        </button>
      </div>
    );
  }

  if (editingFile) {
    return (
      <div style={{ padding: '15px' }}>
        <button onClick={() => setEditingFile(null)} style={{ padding: '8px 16px', background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '6px', color: '#9ca3af', marginBottom: '10px' }}>
          ← Voltar
        </button>
        <h2 style={{ color: '#8b5cf6', fontSize: '14px' }}>{editingFile}</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '400px', background: '#131320', border: '1px solid #2a2a3e', borderRadius: '8px', color: 'white', fontFamily: 'monospace', fontSize: '14px', padding: '12px', marginBottom: '10px' }}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', padding: '10px', background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '6px', color: 'white', marginBottom: '10px' }}
        />
        <button
          onClick={saveFile}
          style={{ width: '100%', padding: '14px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: 'bold' }}
        >
          SALVAR NO GITHUB
        </button>
      </div>
    );
  }

  if (selectedRepo) {
    return (
      <div style={{ padding: '15px' }}>
        <button onClick={() => setSelectedRepo(null)} style={{ padding: '8px 16px', background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '6px', color: '#9ca3af', marginBottom: '10px' }}>
          ← Voltar
        </button>
        <h2 style={{ color: 'white', marginBottom: '15px' }}>{selectedRepo.name}</h2>
        <div style={{ display: 'grid', gap: '5px' }}>
          {files.slice(0, 50).map((file: any) => (
            <button
              key={file.path}
              onClick={() => openFile(file.path)}
              style={{ padding: '12px', background: '#131320', border: '1px solid #2a2a3e', borderRadius: '6px', color: '#9ca3af', textAlign: 'left', fontSize: '13px' }}
            >
              📄 {file.path}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px' }}>
      <h1 style={{ color: '#8b5cf6', marginBottom: '15px' }}>Seus Repositórios</h1>
      <div style={{ display: 'grid', gap: '10px' }}>
        {repos.map((repo: any) => (
          <button
            key={repo.id}
            onClick={() => openRepo(repo)}
            style={{ padding: '15px', background: '#131320', border: '1px solid #2a2a3e', borderRadius: '8px', color: 'white', textAlign: 'left', fontSize: '16px' }}
          >
            {repo.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => { localStorage.clear(); setConnected(false); setToken(''); }}
        style={{ marginTop: '20px', padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: '6px', color: 'white' }}
      >
        Sair
      </button>
    </div>
  );
};
