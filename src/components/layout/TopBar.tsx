import React from 'react';
import { Menu, Github, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';
import { useAppStore } from '@/stores/appStore';
import { useIsMobile } from '@/hooks/useMediaQuery';

export const TopBar: React.FC = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useUIStore();
  const { user, selectedRepo } = useAppStore();

  return (
    <header className="h-16 bg-lore-dark border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            icon={Menu}
            aria-label="Menu"
          />
        )}
        <Zap className="w-8 h-8 text-lore-purple" />
        <h1 className="text-2xl font-bold text-gradient">LORE IA</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {selectedRepo && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
            <Github className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{selectedRepo.fullName}</span>
          </div>
        )}
        
        {user ? (
          <div className="flex items-center space-x-2">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-lore-purple/50"
            />
            <span className="text-sm text-gray-300 hidden sm:inline">{user.name}</span>
          </div>
        ) : (
          <Button
            size="sm"
            icon={Github}
            onClick={() => window.location.href = '/auth/github'}
          >
            Conectar GitHub
          </Button>
        )}
      </div>
    </header>
  );
};
