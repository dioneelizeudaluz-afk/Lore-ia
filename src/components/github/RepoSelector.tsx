import React, { useEffect, useState } from 'react';
import { Github, Search, GitBranch, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useAppStore } from '@/stores/appStore';
import { githubService } from '@/services/github/githubService';
import { GithubRepo, GithubBranch } from '@/types/github';

interface RepoSelectorProps {
  onSelectRepo: (repo: GithubRepo) => void;
}

export const RepoSelector: React.FC<RepoSelectorProps> = ({ onSelectRepo }) => {
  const { token, selectedRepo, selectedBranch, setSelectedBranch } = useAppStore();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [branches, setBranches] = useState<GithubBranch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRepoList, setShowRepoList] = useState(false);

  useEffect(() => {
    if (token && !selectedRepo) {
      loadRepositories();
    }
  }, [token]);

  useEffect(() => {
    if (selectedRepo) {
      loadBranches(selectedRepo);
    }
  }, [selectedRepo]);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const repositories = await githubService.listRepositories();
      setRepos(repositories);
    } catch (err) {
      setError('Erro ao carregar repositórios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async (repo: GithubRepo) => {
    setLoadingBranches(true);
    try {
      const [owner, repoName] = repo.fullName.split('/');
      const branchList = await githubService.listBranches(owner, repoName);
      setBranches(branchList);
    } catch (err) {
      console.error('Erro ao carregar branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {selectedRepo ? (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6 text-lore-purple" />
              <div>
                <h3 className="font-semibold">{selectedRepo.name}</h3>
                <p className="text-sm text-gray-400">{selectedRepo.fullName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRepoList(!showRepoList)}
            >
              Trocar
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center">
              <GitBranch className="w-4 h-4 mr-2" />
              Branch
            </label>
            {loadingBranches ? (
              <Spinner size="sm" />
            ) : (
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white"
              >
                {branches.map((branch) => (
                  <option key={branch.name} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <Button
            icon={Github}
            onClick={() => setShowRepoList(true)}
            className="w-full"
          >
            Selecionar Repositório
          </Button>
        </Card>
      )}

      {showRepoList && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Repositórios</h3>
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={loadRepositories}
                loading={loading}
              />
            </div>

            <Input
              placeholder="Pesquisar repositórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />

            {loading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredRepos.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      onSelectRepo(repo);
                      setShowRepoList(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-lore-purple" />
                      <div className="text-left">
                        <p className="font-medium">{repo.name}</p>
                        <p className="text-xs text-gray-400">{repo.language}</p>
                      </div>
                    </div>
                    {repo.private && (
                      <span className="text-xs text-yellow-400">Privado</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
