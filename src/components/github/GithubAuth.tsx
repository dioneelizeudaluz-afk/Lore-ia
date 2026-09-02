import React, { useState } from 'react';
import { Github, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/stores/appStore';
import { githubService } from '@/services/github/githubService';

export const GithubAuth: React.FC = () => {
  const { setToken, setUser } = useAppStore();
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTokenAuth = async () => {
    if (!tokenInput.trim()) {
      setError('Digite um token válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      githubService.setToken(tokenInput.trim());
      const user = await githubService.getCurrentUser();
      
      setToken(tokenInput.trim());
      setUser(user);
      
      setTokenInput('');
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError('Token inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lore-black p-4">
      <Card className="p-8 max-w-md w-full" glow>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lore-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Github className="w-8 h-8 text-lore-purple" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            LORE <span className="text-gradient">IA</span>
          </h1>
          <p className="text-gray-400">
            Digite seu token do GitHub para começar
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Personal Access Token
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lore-purple/50"
            />
          </div>
          
          <button
            onClick={handleTokenAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-lore-purple to-lore-violet text-white font-medium py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-lore-purple/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Autenticar'}
          </button>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Token armazenado apenas no seu navegador
          </p>
        </div>
      </Card>
    </div>
  );
};
