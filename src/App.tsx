import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Branches } from './pages/Branches';

function App() {
  return (
    <Router>
      <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
        <nav style={{
          background: '#131320',
          padding: '15px',
          borderBottom: '1px solid #2a2a3e',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <Link to="/" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '16px' }}>
            Dashboard
          </Link>
          <Link to="/projects" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '16px' }}>
            Projetos
          </Link>
          <Link to="/branches" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '16px' }}>
            Branches
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/branches" element={<Branches />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
