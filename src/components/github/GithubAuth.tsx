import React, { useState } from 'react';
import { Github, Loader2, AlertCircle } from 'lucide-react';
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

  const handleOAuthLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || 
      `${window.location.origin}/auth/callback`;
    
    if (!clientId) {
      setError('OAuth não configurado. Use autenticação por token.');
      return;
    }

    const scopes = ['repo', 'read:user', 'user:email'].join(' ');
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
    
    window.location.href = authUrl;
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
            Conecte sua conta GitHub para começar
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            icon={Github}
            onClick={handleOAuthLogin}
            loading={loading}
          >
            Conectar com OAuth
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-lore-dark px-2 text-gray-500">
                ou use token
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              label="Personal Access Token"
            />
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleTokenAuth}
              loading={loading}
            >
              Autenticar com Token
            </Button>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Seu token é armazenado apenas no seu navegador e nunca é enviado para nossos servidores
          </p>
        </div>
      </Card>
    </div>
  );
};
