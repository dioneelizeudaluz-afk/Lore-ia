import React, { useState } from 'react';
import { GitCompare, Plus, Minus, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DiffResult } from '@/features/diff/diffEngine';

interface DiffViewerProps {
  diffs: Map<string, DiffResult>;
  onApply: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  diffs,
  onApply,
  onCancel,
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(
    diffs.size > 0 ? Array.from(diffs.keys())[0] : null
  );

  const currentDiff = selectedFile ? diffs.get(selectedFile) : null;

  const totalAdditions = Array.from(diffs.values()).reduce((sum, diff) => sum + diff.additions, 0);
  const totalDeletions = Array.from(diffs.values()).reduce((sum, diff) => sum + diff.deletions, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-5 h-5 text-lore-purple" />
          <h3 className="font-semibold">Alterações</h3>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <span className="flex items-center text-green-400">
            <Plus className="w-4 h-4 mr-1" />
            {totalAdditions}
          </span>
          <span className="flex items-center text-red-400">
            <Minus className="w-4 h-4 mr-1" />
            {totalDeletions}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-48 border-r border-white/10 overflow-y-auto">
          {Array.from(diffs.keys()).map((path) => (
            <button
              key={path}
              onClick={() => setSelectedFile(path)}
              className={`
                w-full text-left px-3 py-2 text-sm transition-colors
                ${selectedFile === path
                  ? 'bg-lore-purple/20 text-lore-purple'
                  : 'text-gray-400 hover:bg-white/5'
                }
              `}
            >
              <span className="block truncate">{path}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentDiff && (
            <div className="p-4">
              <h4 className="font-semibold mb-4">{currentDiff.path}</h4>
              {currentDiff.hunks.map((hunk, hunkIndex) => (
                <div key={hunkIndex} className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
                  </div>
                  {hunk.lines.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`flex px-2 py-0.5 font-mono text-sm ${
                        line.type === 'addition'
                          ? 'bg-green-500/10 text-green-400'
                          : line.type === 'deletion'
                          ? 'bg-red-500/10 text-red-400'
                          : 'text-gray-300'
                      }`}
                    >
                      <span className="w-8 text-gray-500 text-right mr-3 select-none">
                        {line.type === 'deletion'
                          ? line.oldLineNumber
                          : line.newLineNumber || ''}
                      </span>
                      <span className="w-6 select-none">
                        {line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap">{line.content}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-end space-x-2">
        <Button
          variant="ghost"
          onClick={onCancel}
          icon={X}
        >
          Cancelar
        </Button>
        <Button
          onClick={onApply}
          loading={loading}
          icon={Check}
        >
          Aplicar Alterações
        </Button>
      </div>
    </div>
  );
};
