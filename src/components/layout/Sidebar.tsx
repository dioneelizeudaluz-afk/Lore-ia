import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  GitBranch,
  History,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSidebarOpen } = useUIStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projetos', path: '/projects' },
    { icon: GitBranch, label: 'Branches', path: '/branches' },
    { icon: History, label: 'Histórico', path: '/history' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-lore-dark border-r border-white/10 flex flex-col animate-slide-down">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gradient">LORE IA</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(false)}
          icon={X}
          aria-label="Fechar sidebar"
        />
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center px-4 py-3 text-left transition-colors
              ${location.pathname === item.path
                ? 'bg-lore-purple/20 text-lore-purple border-r-2 border-lore-purple'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-gray-500">v1.0.0</p>
      </div>
    </aside>
  );
};
