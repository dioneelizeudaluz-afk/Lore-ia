import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, GitBranch, History, Settings, Sparkles, Key } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Branches } from './pages/Branches';

function App() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projetos', path: '/projects' },
    { icon: GitBranch, label: 'Branches', path: '/branches' },
    { icon: History, label: 'Histórico', path: '/history' },
    { icon: Key, label: 'API Key', path: '/api-key' },
    { icon: Sparkles, label: 'IA Engine', path: '/ia-engine' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <Router>
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          background: '#131320',
          borderRight: '1px solid #2a2a3e',
          minHeight: '100vh',
          padding: '20px 0',
        }}>
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #2a2a3e' }}>
            <h1 style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: 'bold' }}>
              LORE IA
            </h1>
          </div>
          <nav style={{ padding: '20px 0' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a1a2e';
                  e.currentTarget.style.color = '#8b5cf6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <item.icon size={18} style={{ marginRight: '12px' }} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/branches" element={<Branches />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
