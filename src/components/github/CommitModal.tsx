import React, { useState } from 'react';
import { GitCommit, Upload, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileChange } from '@/types';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (message: string) => Promise<void>;
  files: FileChange[];
  loading?: boolean;
}

export const CommitModal: React.FC<CommitModalProps> = ({
  isOpen,
  onClose,
  onCommit,
  files,
  loading = false,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      setError('Digite uma mensagem de commit');
      return;
    }

    setError(null);
    try {
      await onCommit(commitMessage);
      setCommitMessage('');
      onClose();
    } catch (err) {
      setError('Erro ao criar commit');
      console.error(err);
    }
  };

  const getDefaultMessage = () => {
    if (files.length === 0) return 'feat: atualiza projeto';
    const firstFile = files[0].path;
    const action = files[0].status === 'added' ? 'adiciona' : 'atualiza';
    return `${action} ${firstFile}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Commit"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            icon={Upload}
            onClick={handleCommit}
            loading={loading}
          >
            Commit & Push
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            Arquivos alterados ({files.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <span className="text-sm text-gray-300">{file.path}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    file.status === 'added'
                      ? 'bg-green-500/20 text-green-400'
                      : file.status === 'deleted'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {file.status === 'added' ? 'Novo' : file.status === 'deleted' ? 'Removido' : 'Modificado'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Input
            label="Mensagem do commit"
            placeholder="feat: atualiza página inicial"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            onFocus={() => !commitMessage && setCommitMessage(getDefaultMessage())}
            error={error || undefined}
          />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <GitCommit className="w-4 h-4" />
          <span>O commit será enviado para o GitHub</span>
        </div>
      </div>
    </Modal>
  );
};
