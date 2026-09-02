import React, { useEffect, useState } from 'react';
import { GitCommit, Clock, User, MessageSquare } from 'lucide-react';
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
          <
