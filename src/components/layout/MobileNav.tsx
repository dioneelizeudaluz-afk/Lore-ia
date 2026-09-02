import React from 'react';
import {
  FolderOpen,
  Code,
  Sparkles,
  GitCompare,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export const MobileNav: React.FC = () => {
  const { mobileView, setMobileView } = useUIStore();

  const items = [
    { icon: FolderOpen, label: 'Arquivos', view: 'files' as const },
    { icon: Code, label: 'Editor', view: 'editor' as const },
    { icon: Sparkles, label: 'IA', view: 'ai' as const },
    { icon: GitCompare, label: 'Diff', view: 'diff' as const },
  ];

  return (
    <nav className="h-16 bg-lore-dark border-t border-white/10 flex items-center justify-around px-2">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => setMobileView(item.view)}
          className={`
            flex flex-col items-center justify-center px-3 py-2 rounded-lg
            transition-colors
            ${mobileView === item.view
              ? 'bg-lore-purple/20 text-lore-purple'
              : 'text-gray-400 hover:bg-white/5'
            }
          `}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
