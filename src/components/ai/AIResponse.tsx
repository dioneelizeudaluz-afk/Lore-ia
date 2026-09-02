import React from 'react';
import { Bot, User, Sparkles, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Message } from '@/types/ai';

interface AIResponseProps {
  messages: Message[];
  loading?: boolean;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  messages,
  loading = false,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] ${
              message.role === 'user' ? 'order-1' : 'order-2'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex items-center mb-1">
                <Bot className="w-4 h-4 text-lore-purple mr-1" />
                <span className="text-xs text-lore-purple font-semibold">LORE IA</span>
              </div>
            )}
            <Card
              className={`p-3 ${
                message.role === 'user'
                  ? 'bg-lore-purple/20 border-lore-purple/30'
                  : 'bg-white/5'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[85%]">
            <div className="flex items-center mb-1">
              <Bot className="w-4 h-4 text-lore-purple mr-1" />
              <span className="text-xs text-lore-purple font-semibold">LORE IA</span>
            </div>
            <Card className="p-3 bg-white/5">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-lore-purple animate-spin" />
                <p className="text-sm text-gray-400">Analisando projeto...</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
