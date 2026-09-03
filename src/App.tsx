import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, GitBranch, History, Settings, Sparkles, Key, Menu, X } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Branches } from './pages/Branches';
import { SettingsPage } from './pages/SettingsPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projetos', path: '/projects' },
    { icon: GitBranch, label: 'Branches', path: '/branches' },
    { icon: History, label: 'Histórico', path: '/history' },
    { icon: Key, label: 'API Key', path: '/settings' },
    { icon: Sparkles, label: 'IA Engine', path: '/settings' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <Router>
      <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
        <header style={{
          background: '#131320',
          borderBottom: '1px solid #2a2a3e',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#8b5cf6',
                cursor: 'pointer',
                marginRight: '10px',
                padding: '5px',
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 style={{ color: '#8b5cf6', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
              LORE IA
            </h1>
          </div>
        </header>

        {menuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '280px',
            height: '100%',
            background: '#131320',
            borderRight: '1px solid #2a2a3e',
            zIndex: 200,
            paddingTop: '60px',
          }}>
            <nav>
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '16px',
                    borderBottom: '1px solid #1a1a2e',
                  }}
                >
                  <item.icon size={20} style={{ marginRight: '15px', color: '#8b5cf6' }} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 150,
            }}
          />
        )}

        <main style={{ padding: '15px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
