import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/stores/appStore';
import { githubService } from '@/services/github/githubService';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAppStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setStatus('error');
        setMessage('Autenticação cancelada ou falhou');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('Código de autenticação não encontrado');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Em produção, isso deve ser feito no backend
        // Aqui estamos simulando a troca do código por token
        // O token deve vir de uma API serverless na Vercel
        
        const response = await fetch('/api/github/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Falha na troca do código');
        }

        const data = await response.json();
        
        githubService.setToken(data.token);
        const user = await githubService.getCurrentUser();
        
        setToken(data.token);
        setUser(user);
        
        setStatus('success');
        setMessage('Autenticação realizada com sucesso!');
        
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error('Erro na autenticação:', err);
        setStatus('error');
        setMessage('Erro ao processar autenticação');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, setToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-lore-black p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-lore-purple animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Autenticando...</h2>
            <p className="text-gray-400">
              Processando sua autenticação com GitHub
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sucesso!</h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecionando para o dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Erro</h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecionando para o início...
            </p>
          </>
        )}
      </Card>
    </div>
  );
};
