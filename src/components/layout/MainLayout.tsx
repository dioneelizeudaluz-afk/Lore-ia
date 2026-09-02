import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useUIStore } from '@/stores/uiStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { sidebarOpen } = useUIStore();

  return (
    <div className="h-screen flex flex-col bg-lore-black">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {!isMobile && sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      {isMobile && <MobileNav />}
    </div>
  );
};
