import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, FolderOpen, GitCommit, Zap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useAppStore } from '@/stores/appStore';
import { githubService } from '@/services/github/githubService';
import { GithubRepo } from '@/types/github';
import { formatDate } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, setSelectedRepo } = useAppStore();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadRepositories();
    }
  }, [token]);

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

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRepo = (repo: GithubRepo) => {
    setSelectedRepo(repo);
    navigate(`/project/${repo.id}`);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md" glow>
          <Github className="w-16 h-16 text-lore-purple mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Conecte seu GitHub</h2>
          <p className="text-gray-400 mb-6">
            Conecte sua conta GitHub para começar a desenvolver com IA
          </p>
          <Button
            size="lg"
            icon={Github}
            onClick={() => window.location.href = '/auth/github'}
          >
            Conectar GitHub
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo, <span className="text-gradient">{user?.name}</span>
          </h2>
          <p className="text-gray-400">
            Selecione um projeto para começar a desenvolver
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <FolderOpen className="w-8 h-8 text-lore-purple" />
              <span className="text-3xl font-bold">{repos.length}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Projetos</h3>
            <p className="text-sm text-gray-400">Repositórios conectados</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <GitCommit className="w-8 h-8 text-lore-purple" />
              <span className="text-3xl font-bold">0</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Commits</h3>
            <p className="text-sm text-gray-400">Alterações realizadas</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-lore-purple" />
              <span className="text-3xl font-bold">0</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">IA</h3>
            <p className="text-sm text-gray-400">Modificações geradas</p>
          </Card>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Pesquisar repositórios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={loadRepositories}>Tentar novamente</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <Card
                key={repo.id}
                className="p-6 hover:border-lore-purple/50"
                onClick={() => handleSelectRepo(repo)}
                glow
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Github className="w-5 h-5 text-lore-purple" />
                    <h3 className="font-semibold">{repo.name}</h3>
                  </div>
                  {repo.private && (
                    <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                      Privado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {repo.description || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{repo.language}</span>
                  <span>{formatDate(repo.updatedAt)}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <ArrowRight className="w-5 h-5 text-lore-purple" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
