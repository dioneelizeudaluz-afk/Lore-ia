import React from 'react';
import { Github, Key, Zap, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/stores/appStore';

export const Settings: React.FC = () => {
  const { user, logout } = useAppStore();

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Configurações</h2>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Github className="w-6 h-6 text-lore-purple mr-2" />
              GitHub
            </h3>
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-400">@{user.login}</p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  onClick={logout}
                >
                  Desconectar
                </Button>
              </div>
            ) : (
              <Button icon={Github}>
                Conectar GitHub
              </Button>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Key className="w-6 h-6 text-lore-purple mr-2" />
              API Key
            </h3>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Sua API Key"
                label="OpenAI API Key"
              />
              <Input
                type="password"
                placeholder="Sua API Key"
                label="Anthropic API Key"
              />
              <Input
                type="password"
                placeholder="Sua API Key"
                label="Google AI API Key"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-6 h-6 text-lore-purple mr-2" />
              AI Engine
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Provider Padrão
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white">
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Modelo
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white">
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5">GPT-3.5</option>
                  <option value="claude-2">Claude 2</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-500/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-red-400">
              <Trash2 className="w-6 h-6 mr-2" />
              Zona de Perigo
            </h3>
            <p className="text-gray-400 mb-4">
              Estas ações são irreversíveis
            </p>
            <Button variant="danger">
              Limpar todos os dados
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
