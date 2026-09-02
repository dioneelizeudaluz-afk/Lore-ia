import React, { useEffect, useState } from 'react';
import { GitCommit, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAppStore } from '@/stores/appStore';
import { githubService } from '@/services/github/githubService';
import { GithubCommit } from '@/types/github';
import { formatDate } from '@/lib/utils';

export const History: React.FC = () => {
  const { selectedRepo, selectedBranch } = useAppStore();
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRepo) {
      loadCommits();
    }
  }, [selectedRepo, selectedBranch]);

  const loadCommits = async () => {
    if (!selectedRepo) return;
    
    setLoading(true);
    setError(null);
    try {
      const [owner, repo] = selectedRepo.fullName.split('/');
      const commitList = await githubService.listCommits(owner, repo, selectedBranch);
      setCommits(commitList);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRepo) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <GitCommit className="w-16 h-16 text-lore-purple mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhum projeto selecionado</h2>
          <p className="text-gray-400">
            Selecione um projeto para ver seu histórico
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Histórico de Commits</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-400">{error}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {commits.map((commit) => (
              <Card key={commit.sha} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-lore-purple/20 rounded-full flex items-center justify-center">
                    <GitCommit className="w-5 h-5 text-lore-purple" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{commit.message}</h3>
                      <span className="text-xs text-gray-500">{commit.sha.substring(0, 7)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {commit.author.name}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(commit.author.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
