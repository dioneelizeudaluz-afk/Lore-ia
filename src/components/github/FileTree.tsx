import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
  FileImage,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { GithubFile } from '@/types/github';
import { getFileLanguage } from '@/utils/fileParser';

interface FileTreeProps {
  tree: GithubFile | null;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  activeFile,
  onFileSelect,
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src']));

  const toggleDir = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      return FileImage;
    }
    if (['json'].includes(extension || '')) {
      return FileJson;
    }
    if (['ts', 'tsx', 'js', 'jsx'].includes(extension || '')) {
      return FileCode;
    }
    if (['md', 'txt'].includes(extension || '')) {
      return FileText;
    }
    return File;
  };

  const renderTree = (node: GithubFile, level: number = 0): React.ReactNode => {
    const paddingLeft = `${level * 16}px`;
    
    if (node.type === 'file') {
      const FileIcon = getFileIcon(node.name);
      const isActive = activeFile === node.path;
      
      return (
        <button
          key={node.path}
          onClick={() => onFileSelect(node.path)}
          style={{ paddingLeft }}
          className={`
            w-full flex items-center py-2 pr-2 text-left text-sm transition-colors
            ${isActive
              ? 'bg-lore-purple/20 text-lore-purple border-r-2 border-lore-purple'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          <FileIcon className="w-4 h-4 mr-2 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
      );
    }

    const isExpanded = expandedDirs.has(node.path);
    const FolderIcon = isExpanded ? FolderOpen : Folder;

    return (
      <div key={node.path}>
        <button
          onClick={() => toggleDir(node.path)}
          style={{ paddingLeft }}
          className="w-full flex items-center py-2 pr-2 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1 shrink-0" />
          )}
          <FolderIcon className="w-4 h-4 mr-2 shrink-0 text-lore-purple" />
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!tree) {
    return (
      <div className="p-4 text-center text-gray-500">
        Carregando estrutura...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2">
        {tree.children?.map((child) => renderTree(child))}
      </div>
    </div>
  );
};
