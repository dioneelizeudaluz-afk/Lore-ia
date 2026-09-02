import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { ProjectView } from '@/pages/ProjectView';
import { Settings } from '@/pages/Settings';
import { History } from '@/pages/History';
import { useAppStore } from '@/stores/appStore';

function App() {
  const { token } = useAppStore();

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/project/:repoId"
            element={token ? <ProjectView /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
